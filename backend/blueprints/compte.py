from flask import Blueprint, jsonify, request
import sqlite3
import secrets

compte_bp = Blueprint('compte', __name__)

#Créer un compte
@compte_bp.route('/createCompte', methods=['POST'])
def create_compte():
    # Récupérer les données envoyées dans la requête
    nom = request.form.get('nomCompte')
    prenom = request.form.get('prenomCompte')
    email = request.form.get('email')
    genre = request.form.get('genre')
    voiture = request.form.get('voiture')
    telephone = request.form.get('telephone')
    mdp = request.form.get('mdp')
    notificationMail = request.form.get('notificationMail')

    # Vérifier si le compte existe déjà dans la base de données
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE WHERE email = ?", (email,))
    compte = c.fetchone()

    if compte is not None:
        # Le compte existe déjà
        conn.close()
        return jsonify({'message': 'Le compte existe déjà'}), 409

    if not nom or not prenom or not email or not genre or not voiture or not telephone or not mdp or not notificationMail:
        # Il manque des informations dans la requête
        conn.close()
        return jsonify({'message': 'Informations manquantes'}), 400

    # Insérer le compte dans la base de données
    c.execute("INSERT INTO COMPTE (nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              (nom, prenom, email, genre, voiture, telephone, mdp, notificationMail))
    conn.commit()
    conn.close()

    # Envoyer une réponse avec le code HTTP 201 Created
    return jsonify({'message': 'Le compte a été créé'}), 201




#Se connecter à un compte avec email et mdp + creation token
@compte_bp.route('/connectCompte', methods=['POST'])
def connectCompte():
    email = request.form.get('email')
    mdp = request.form.get('mdp')

    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute(
        "SELECT idCompte FROM COMPTE WHERE email = ? AND mdp = ?", (email, mdp))
    compte = c.fetchone()
    idCompte = compte[0]

    if compte:
        # Création du token
        token = secrets.token_hex(16)  # generate a random token with 16 bytes
        c.execute("INSERT INTO TOKEN VALUES (?, ?, ?)",
                  (idCompte, token, "exp"))
        conn.commit()
        conn.close()

        # Retour de la réponse avec code 200 et le token
        return jsonify({'idCompte': idCompte, 'token': token}), 200
    else:
        # Retour de la réponse avec code 401 et un message d'erreur
        conn.close()
        return jsonify({'message': 'Email ou mot de passe incorrect.'}), 401





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


        c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", (idCompte,))

        # c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", idCompte)
        compte = c.fetchone()
        conn.close()

        # Récupération des noms de colonnes
        col_names = [desc[0] for desc in c.description]

        # Création d'un dictionnaire contenant les données
        compte_dict = {col_names[i]: compte[i] for i in range(len(col_names))}

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
    c.execute("SELECT idCompte FROM COMPTE WHERE token = ?"), token
    compte = c.fetchone()
    idCompte = compte[0]

    #Le token est valide et conduit bien a un compte
    if compte:
        email = request.form.get('email')
        #On verifie l'unicite de l'email
        c.execute("SELECT idCompte FROM COMPTE WHERE NOT(idCompte = ?)", idCompte)
        if c.fetchone():
            #L'adresse est deja utilisee
            conn.close()
            return jsonify({'message': 'L\'adresse mail est déjà utilisée.'}), 400

        else:
            tel = request.form.get('telephone')
            prenom = request.form.get('prenom')
            nom = request.form.get('nom')
            mdp = request.form.get('logpass')
            adresse = request.form.get('adresse')
            ville = request.form.get('ville')
            pays = request.form.get('pays')
            codePostal = request.form.get('codepostal')
            genre = request.form.get('sexe')
            voiture = request.form.get('voiture')
            if voiture == 'oui' :
                voiture = True
            else:
                voiture = False
                
            notifs = request.form.get('notif')
            if notifs == 'oui' :
                notifs = True
            else:
                notifs = False

            poster = request.files['poster']
            if poster != None :
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
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401


    