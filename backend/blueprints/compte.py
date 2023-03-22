URI_DATABASE = '../database.db'

from flask import Blueprint, Flask, jsonify, request
from datetime import datetime
from io import BytesIO
import sqlite3
import secrets
import os
import re
from werkzeug.utils import secure_filename
from hashlib import sha512

compte_bp = Blueprint('compte', __name__)

app = Flask(__name__, template_folder=".")

#Chemin pour enregistrer les photos
UPLOAD_FOLDER = 'static/images/profils'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@compte_bp.route('/checkToken/<string:token>', methods=['GET'])
def getCompte(token):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    conn.close()

    if compte is None:
        # Le token n'existe pas
        return jsonify({'message': 'Le token n\'existe pas'}), 404

    return jsonify({'message': 'Le token est valide'}), 200

#Créer un compte
@compte_bp.route('/createCompte', methods=['POST'])
def create_compte():
    nom = request.form.get('name-sign')
    prenom = request.form.get('last-name-sign')
    email = request.form.get('email-sign')
    adresse = request.form.get('address-sign')
    ville = request.form.get('city-sign')
    codePostal = request.form.get('postal-sign')
    pays = request.form.get('country-sign')
    genre = request.form.get('gender-sign')
    voiture = request.form.get('checkbox-licence-sign')
    telephone = request.form.get('phone-sign')
    mdp = request.form.get('password-sign')
    notificationMail = '1'
    noteCompte = '2.5'

    #On convertie le champ voiture
    if voiture == 'true':
        voiture = 1
    else:
        voiture = 0

    if 'file-sign' in request.files:
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER, mode=0o777, exist_ok=True)

        file = request.files['file-sign']
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Récupérer le nom de fichier pour la photo
        photo = secure_filename(request.files['file-sign'].filename)
    else:
        photo = None



    # Encodage du mot de passe
    mdp = mdp.encode()

    # Hashage du mot de passe
    mdp = sha512(mdp).hexdigest()

    # Vérifier si le compte existe déjà dans la base de données
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE WHERE email = ?", (email,))
    compte = c.fetchone()

    if compte is not None:
        # Le compte existe déjà
        conn.close()
        # On ne précise pas la raison, soucis de sécurité
        return jsonify({'message': 'Une erreur est survenue'}), 409

    if not nom or not prenom or not email or not adresse or not ville or not codePostal or not pays or not genre or not telephone or not mdp:
        # Il manque des informations dans la requête
        conn.close()
        return jsonify({'message': 'Informations manquantes'}), 400


    # Insérer le compte dans la base de données
    c.execute("INSERT INTO COMPTE (nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              (nom, prenom, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail, photo))

    # Recupération de l'id du compte    
    c.execute(
        "SELECT idCompte FROM COMPTE WHERE email = ? AND mdp = ?", (email, mdp))
    compte = c.fetchone()
    idCompte = compte[0]
    
    # Création du token
    token = secrets.token_hex(16)  # generate a random token with 16 bytes
    c.execute("INSERT INTO TOKEN VALUES (?, ?, ?)",
                (idCompte, token, "exp"))
    conn.commit()
    conn.close()

    # Envoyer une réponse avec le code HTTP 201 Created
    return jsonify({'message': 'Le compte a été créé', 'token': token}), 201




#Se connecter à un compte avec email et mdp + creation token
@compte_bp.route('/connectCompte', methods=['POST'])
def connectCompte():
    data = request.get_json()
    email = data.get('email-log')
    mdp = data.get('password-log')

    # Encodage du mot de passe
    mdp = mdp.encode()

    # Hashage du mot de passe
    mdp = sha512(mdp).hexdigest()

    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    # Récupérer isAdmin pour le laisser au front est moche
    c.execute(
        "SELECT idCompte, isAdmin FROM COMPTE WHERE email = ? AND mdp = ?", (email, mdp))
    compte = c.fetchone()

    if compte:
        idCompte = compte[0]
        isAdmin = compte[1]
        # Création du token
        token = secrets.token_hex(16)  # generate a random token with 16 bytes
        c.execute("INSERT INTO TOKEN VALUES (?, ?, ?)",
                  (idCompte, token, "exp"))
        conn.commit()
        conn.close()

        # Retour de la réponse avec code 200 et le token
        return jsonify({'idCompte': idCompte, 'token': token, 'isAdmin': isAdmin}), 200
    else:
        # Retour de la réponse avec code 401 et un message d'erreur
        conn.close()
        return jsonify({'message': 'Email ou mot de passe incorrect.'}), 401



#Se deconnecter à un compte avec token
@compte_bp.route('/deconnectCompte/<string:token>', methods=['POST'])
def deconnectCompte(token):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if compte:
        idCompte = compte[0]
        #On supprime de la table token
        c.execute("DELETE FROM TOKEN WHERE idCompte = ? AND auth_token = ?", (idCompte, token))
        conn.commit()
        conn.close()

        # Retour de la réponse avec code 200
        return jsonify({'message': 'Le compte a bien été déconnecté.'}), 200
    else:
        # Retour de la réponse avec code 401 et un message d'erreur
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401





#Recuperer les infos d'un compte avec son token
@compte_bp.route('/getInfoCompte/<string:token>', methods=['GET'])
def getInfoCompte(token):
     # Verif du token + recup id
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    print(token)
    compte = c.fetchone()

    # Le token est valide et conduit bien a un compte
    if compte:
        idCompte = compte[0]
        print("voici l'id du compte en fonction de son token : ", idCompte)
        idCompte = int(idCompte)

        # Récupération des données du compte
        c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", (idCompte,))

        # Affectation des données à une variable
        compte = c.fetchone()

        # Récupération des noms de colonnes
        col_names = [desc[0] for desc in c.description]

        # Création d'un dictionnaire contenant les données
        compte_dict = {col_names[i]: compte[i] for i in range(len(col_names))}

        # Récupération du nombre de notes
        c.execute("SELECT count(distinct(idNote)) as nbnotes FROM NOTE WHERE idCompteNote = ?", (idCompte,))

        # Affectation du nombre de notes à une variable
        nbnotes = c.fetchone()

        # Ajout du nombre de notes au dictionnaire
        compte_dict['nbnotes'] = nbnotes[0]

        # Récupération du nombre de trajets
        c.execute("SELECT count(distinct(idTrajet)) as nbtrajets FROM HISTORIQUE_TRAJET WHERE idCompte = ?", (idCompte,))

        # Affectation du nombre de trajets à une variable
        nbtrajets = c.fetchone()

        # Ajout du nombre de trajets au dictionnaire
        compte_dict['nbtrajets'] = nbtrajets[0]

        # Fermeture de la connexion
        conn.close()

        # Envoi de la réponse en JSON avec code 200 et le compte
        return jsonify(compte_dict), 200
    else:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401


# Récupère le nom d'un compte avec son id
@compte_bp.route('/getNomCompte/<string:id>', methods=['GET'])
def getNomCompte(id):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT nomCompte, prenomCompte FROM COMPTE WHERE idCompte = ?", (id,))
    compte = c.fetchone()

    # L'id est valide et conduit bien a un compte
    if compte:
        nomCompte = compte[0] + " " + compte[1]

        # Création d'un dictionnaire contenant les données
        compte_dict = {"nomCompte" : nomCompte}

        # Fermeture de la connexion
        conn.close()

        # Envoi de la réponse en JSON avec code 200 et le compte
        return jsonify(compte_dict), 200
    else:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401


#Modifier son compte avec son token
@compte_bp.route('/modifCompte/<string:token>', methods=['POST'])
def modifCompte(token):
    #Verif du token + recup id
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    #Le token est valide et conduit bien a un compte
    if compte:
        idCompte = compte[0]
        data = request.form
        email = data.get('email')

        #On verifie l'unicite de l'email
        c.execute("SELECT idCompte FROM COMPTE WHERE email = ? AND NOT idCompte = ?", (email, idCompte))
        mail = c.fetchone()

        if mail:
            #L'adresse est deja utilisee
            conn.close()
            return jsonify({'message': 'L\'adresse mail est déjà utilisée.'}), 400

        else:
            tel = data.get('telephone')
            prenom = data.get('prenom')
            nom = data.get('nom')
            mdp = data.get('mdp')
            if mdp:
                mdp = mdp.encode()
                mdp = sha512(mdp).hexdigest()
            adresse = data.get('adresse')
            ville = data.get('ville')
            pays = data.get('pays')
            codePostal = data.get('codepostal')
            genre = data.get('genre')
            voiture = data.get('voiture')
            
            if genre == '1':
                genre = "homme"
            elif genre == '2':
                genre = "femme"
            elif genre == '3':
                genre = "autre"
            else:
                genre = "pas de sexe"
        

       

            if voiture == 'oui' :
                voiture = True
            else:
                voiture = False
            
            notifs = data.get('notif')
            if notifs == 'oui' :
                notifs = True
            else:
                notifs = False

            if 'poster' in request.files:
                if not os.path.exists(UPLOAD_FOLDER):
                    os.makedirs(UPLOAD_FOLDER, mode=0o777, exist_ok=True)
                else:
                    c = conn.cursor()
                    c.execute("SELECT * FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
                    compte = c.fetchone()
                    if compte[15] and os.path.exists("static/images/profils/" + compte[15]):
                        os.remove("static/images/profils/" + compte[15])

                file = request.files['poster']
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                # Récupérer le nom de fichier pour la photo
                photo = secure_filename(request.files['poster'].filename)
            else:
                c = conn.cursor()
                c.execute("SELECT * FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
                compte = c.fetchone()
                photo = compte[15]


            #On insere les données
            c.execute("UPDATE COMPTE SET telephone=?, prenomCompte=?, nomCompte=?, mdp=?, adresse=?, ville=?, pays=?, codePostal=?, genre=?, voiture=?, notificationMail=?, email=?, photo=? WHERE idCompte=?",
                (tel, prenom, nom, mdp, adresse, ville, pays, codePostal, genre, voiture, notifs, email, photo, idCompte))
            conn.commit()
            conn.close()
            return jsonify({'message': 'ok'}), 200

    else:
        print('on rentre pas dans le if compte')
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401




@compte_bp.route('/deleteCompte/<string:token>', methods=['DELETE'])
def delCompte(token):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)

    #On supprime la photo
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if compte[15] and os.path.exists("static/images/profils/" + compte[15]):
        os.remove("static/images/profils/" + compte[15])

    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    else:
        idCompte = compte[0]
        c.execute("DELETE FROM COMPTE WHERE idCompte = ?", (idCompte,))
        c.execute("DELETE FROM TRAJET WHERE idConducteur = ?", (idCompte,))
        c.execute("DELETE FROM TRAJET_EN_COURS_PASSAGER WHERE idCompte = ?", (idCompte,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Le compte a bien été supprimé'}), 200



#Voir ses demandes de trajet
@compte_bp.route('/getDemandesEnCours/<string:token>', methods = ['POST'])
def getDemandesEnCours(token):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    else:
        idCompte = compte[0]
        #On peut recuperer ses demandes de trajets en cours
        c.execute("SELECT * FROM DEMANDE_TRAJET_EN_COURS inner join TRAJET on DEMANDE_TRAJET_EN_COURS.idTrajet = TRAJET.idTrajet WHERE idCompte = ?", (idCompte,))
        rows = c.fetchmany()
        if not rows:
            #Il n'y a aucune demande en cours
            conn.close()
            return jsonify({'message': 'Aucune demande en cours'}), 204
        else:
            # Récupération des noms de colonnes
            col_names = [desc[0] for desc in c.description]

            # Conversion de la date dans chaque ligne de résultat
            trajets = []
            for row in rows:
                trajet = {col_names[i]: row[i] for i in range(len(col_names))}
            
                # Conversion de la date de la colonne 'dateTrajet'
                dateTrajet = datetime.strptime(trajet['dateDepart'], '%Y%m%d').strftime('%d %B, %Y')
                trajet['dateDepart'] = dateTrajet

                # Conversion de l'idVille en nomVille
                c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeDepart'],))
                trajet['villeDepart'] = c.fetchone()[0]
                c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeArrivee'],))
                trajet['villeArrivee'] = c.fetchone()[0]


                trajets.append(trajet)
            conn.commit()
            conn.close()

            # Retour de la réponse avec code 200
            return jsonify(trajets), 200



@compte_bp.route('/getNotifs/<string:token>', methods=['GET'])
def getNotifs(token):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
   
    idCompte = compte[0]
    #On peut recuperer les notifications
    c.execute("""
    SELECT NOTIFICATION.idNotification, messageNotification, nomCompte, prenomCompte FROM NOTIF_RECUE 
        inner join NOTIFICATION on NOTIF_RECUE.idNotification = NOTIFICATION.idNotification
        inner join COMPTE on NOTIFICATION.idCompteEnvoyeur = COMPTE.idCompte
        WHERE NOTIF_RECUE.idCompte = ? """, (idCompte,))

    rows = c.fetchall()

    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Création d'une liste de dictionnaires contenant les données
    notifs = []
    for row in rows:
        notif = {col_names[i]: row[i] for i in range(len(col_names))}

        if row[0] in [id[0] for id in c.execute("SELECT idNotification FROM NOTIF_TRAJET")]:
            notif['typeNotif'] = 'Trajet'
            notif['idTrajet'] = [groupe[0] for groupe in c.execute("SELECT idTrajet FROM NOTIFICATION NATURAL JOIN NOTIF_TRAJET WHERE idNotification=?", (row[0],))][0]
        elif row[0] in [id[0] for id in c.execute("SELECT idNotification FROM NOTIF_GROUPE")]:
            notif['typeNotif'] = 'Groupe'
            notif['nomGroupe'] = [groupe[0] for groupe in c.execute("SELECT nomGroupe FROM NOTIFICATION NATURAL JOIN NOTIF_GROUPE INNER JOIN GROUPE ON NOTIF_GROUPE.idGroupe = GROUPE.idGroupe WHERE idNotification=?", (row[0],))][0]
        else:
            notif['typeNotif'] = None

        notifs.append(notif)

    print(notifs)
        
    conn.close()
    return jsonify(notifs)


@compte_bp.route('/suppNotif/<string:token>/<int:idNotif>', methods=['DELETE'])
def suppNotif(token, idNotif):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
   
    idCompte = compte[0]

    #On vérifie que le compte est bien receveur de la notif
    c.execute("SELECT * FROM NOTIF_RECUE WHERE idCompte = ? AND idNotification = ?", (idCompte, idNotif))
    receveur = c.fetchone()
    if not receveur:
        conn.close()
        return jsonify({'message': 'Vous n\'êtes pas autorisé à supprimer cette notification.'}), 403

    #On peut supprimer la notif
    c.execute("DELETE FROM NOTIFICATION WHERE idNotification = ?", (idNotif,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'La notification a bien été supprimé.'}), 200


@compte_bp.route('/suppAllNotif/<string:token>', methods=['DELETE'])
def suppAllNotif(token):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
   
    idCompte = compte[0]

    #On peut supprimer les notifs
    c.execute("DELETE FROM NOTIF_RECUE WHERE idCompte = ?", (idCompte,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Les notifications ont bien été supprimées.'}), 200


@compte_bp.route('/modifMdp/<string:token>/<string:mdp>', methods=['POST'])
def modifMdp(token, mdp):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN_RECUP_MDP on COMPTE.idCompte = TOKEN_RECUP_MDP.idCompte WHERE mdp_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
   
    idCompte = compte[0]

    #On vérifie que le mdp est valide
    # Expression régulière
    regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

    # Vérifier si le mot de passe respecte l'expression régulière
    if not re.match(regex, mdp):
        conn.close()
        return jsonify({'message': 'Le mdp ne respecte pas le format demandé.'}), 403


    #Le mdp et le token sont corrects

    #On supprime le token
    c.execute("DELETE FROM TOKEN_RECUP_MDP WHERE idCompte = ?", (idCompte,))

    #On modifie le mdp du compte
    # Encodage du mot de passe
    mdp = mdp.encode()

    # Hashage du mot de passe
    mdp = sha512(mdp).hexdigest()

    c.execute("UPDATE COMPTE SET mdp = ? WHERE idCompte = ?", (mdp, idCompte))
    
    conn.commit()
    conn.close()
    return jsonify('message : Le mdp a bien été modifié'), 200