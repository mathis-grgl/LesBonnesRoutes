from flask import Blueprint, jsonify, request
import sqlite3
import secrets

compte_bp = Blueprint('compte', __name__)

#Créer un compte
@compte_bp.route('/createCompte', methods=['POST'])
def create_compte():
    print("Othelo")
    data = request.get_json()
    # Récupérer les données envoyées dans la requête
    nom = data.get('name-sign')
    prenom = data.get('last-name-sign')
    email = data.get('email-sign')
    adresse = data.get('address-sign')
    ville = data.get('city-sign')
    codePostal = data.get('postal-sign')
    pays = data.get('country-sign')
    genre = data.get('gender-sign')
    voiture = data.get('checkbox-licence-sign')
    telephone = data.get('phone-sign')
    mdp = data.get('password-sign')
    #notificationMail = data.get('notificationMail')
    notificationMail = "1"
    noteCompte = "2.5"
    photo = "non"



    # Vérifier si le compte existe déjà dans la base de données
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE WHERE email = ?", (email,))
    compte = c.fetchone()

    if compte is not None:
        # Le compte existe déjà
        conn.close()
        # On ne précise pas la raison, soucis de sécurité
        return jsonify({'message': 'Une erreur est survenue'}), 409

    if not nom or not prenom or not email or not adresse or not ville or not codePostal or not pays or not genre or not voiture or not telephone or not mdp or not notificationMail:
        # Il manque des informations dans la requête
        conn.close()
        return jsonify({'message': 'Informations manquantes'}), 400

    # Insérer le compte dans la base de données
    c.execute("INSERT INTO COMPTE (nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              (nom, prenom, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail))

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

    conn = sqlite3.connect('../database.db')
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
    conn = sqlite3.connect('../database.db')
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
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    idCompte = compte[0]
    print("voici l'id du compte en fonction de son token : ", idCompte)

    # Le token est valide et conduit bien a un compte
    if compte:
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






#Modifier son compte avec son token
@compte_bp.route('/modifCompte/<string:token>', methods=['POST'])
def modifCompte(token):
    #Verif du token + recup id
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    idCompte = compte[0]
    print("voici l'id du compte en fonction de son token : ", idCompte)
    print('test')

    #Le token est valide et conduit bien a un compte
    if compte:
        data = request.get_json()
        print(data)
        email = data.get('email')
        print(email)
        #On verifie l'unicite de l'email
        idCompte = int(idCompte)
        # c.execute("SELECT idCompte FROM COMPTE WHERE NOT(idCompte = ?)", idCompte)
        # c.execute("SELECT idCompte, nomCompte, email FROM COMPTE WHERE NOT (idCompte = ?)", (idCompte,))
        c.execute("SELECT COUNT(*) FROM COMPTE WHERE email = 'adresse_mail_a_verifier'")
        test = c.fetchone()
        print(test[0])


        if len(test) > 1:
            #L'adresse est deja utilisee
            print("on est ici.")
            conn.close()
            return jsonify({'message': 'L\'adresse mail est déjà utilisée.'}), 400

        else:
            tel = data.get('telephone')
            prenom = data.get('prenom')
            nom = data.get('nom')
            mdp = data.get('mdp')
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

            # Est-ce bon ?
            print("6")
            poster = data.get('photo')
            print(poster)
            print("6")
            if poster :
                #Il y a une photo : on inserer le nom dans la db
                nomPhoto = poster.filename
                c.execute("UPDATE COMPTE SET telephone=?, prenomCompte=?, nomCompte=?, mdp=?, adresse=?, ville=?, pays=?, codePostal=?, genre=?, voiture=?, notificationMail=?, photo=? WHERE idCompte=?",
                    (tel, prenom, nom, mdp, adresse, ville, pays, codePostal, genre, voiture, notifs, nomPhoto, idCompte))
                conn.commit()
                conn.close()
                return jsonify({'message': 'ok'}), 200
            else :
                #On n'insere pas de photo
                c.execute("UPDATE COMPTE SET telephone=?, prenomCompte=?, nomCompte=?, mdp=?, adresse=?, ville=?, pays=?, codePostal=?, genre=?, voiture=?, notificationMail=? WHERE idCompte=?",
                    (tel, prenom, nom, mdp, adresse, ville, pays, codePostal, genre, voiture, notifs, idCompte))
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
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    else:
        idCompte = compte[0]
        c.execute("DELETE FROM COMPTE WHERE idCompte = ?", (idCompte,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Le compte a bien été supprimé'}), 200
