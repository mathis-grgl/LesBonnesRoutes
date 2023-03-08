from flask import Blueprint, jsonify, render_template, request
from datetime import datetime
import sqlite3

admin_bp = Blueprint('admin', __name__)

# Pages
@admin_bp.route('/')
def admin_index():
    return render_template('admin/index/admin-index.html')


@admin_bp.route('/account/<idCompte>')
def admin_account(idCompte):
    return render_template('admin/account/admin-account.html')


@admin_bp.route('/search-account')
def admin_search_account():
    return render_template('admin/search-account/admin-search-account.html')

@admin_bp.route('/search-route')
def admin_search_route():
    return render_template('admin/search-route/admin-search-route.html')


@admin_bp.route('/deconnexion')
def admin_deconnexion():
    return render_template('admin/deconnexion/admin-deconnexion.html')

@admin_bp.route('/account/edit/<idCompte>')
def admin_account_edit(idCompte):
    return render_template('admin/account/edit/admin-account-edit.html')

#Recuperer tous les comptes
@admin_bp.route('/users')
def get_users():
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE")
    rows = c.fetchall()

    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Création d'une liste de dictionnaires contenant les données
    users = []
    for row in rows:
        user = {col_names[i]: row[i] for i in range(len(col_names))}
        users.append(user)

    conn.close()
    return jsonify(users)



#Récupérer un compte
@admin_bp.route('/users/<int:idCompte>')
def get_user(idCompte):
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", (idCompte,))
    row = c.fetchone()

    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Création d'une liste de dictionnaires contenant les données
    compte_dict = {col_names[i]: row[i] for i in range(len(col_names))}

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

    conn.close()
    return jsonify(compte_dict)



#Recuperer tous les trajets
@admin_bp.route('/trajets')
def get_trajets():
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM TRAJET")
    rows = c.fetchall()

    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Création d'une liste de dictionnaires contenant les données
    trajets = []
    for row in rows:
        trajet = {col_names[i]: row[i] for i in range(len(col_names))}

        # Remplacement des ID des villes par leurs noms
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (row[10],))
        trajet['villeDepart'] = c.fetchone()[0]
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (row[11],))
        trajet['villeArrivee'] = c.fetchone()[0]
        trajets.append(trajet)

    conn.close()
    return jsonify(trajets)


#Supprimer un compte
@admin_bp.route('/deleteCompte/<string:token>/<int:idCompte>', methods=['DELETE'])
def deleteCompte(token, idCompte):
    #On verifie que le token est admin
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT isAdmin FROM TOKEN NATURAL JOIN COMPTE WHERE auth_token = ?", (token,))
    admin = c.fetchone()
    if not admin:
        #Le token n'existe pas
        conn.close()
        return jsonify({'message': 'Le token est invalide ou expiré'}), 401
    else:
        isAdmin = admin[0]
        if not isAdmin:
            #Le token n'est pas admin
            conn.close()
            return jsonify({'message': 'Le token n\'est pas admin'}), 401
        else:
            #On peut supprimer le compte
            c.execute("DELETE FROM COMPTE WHERE idCompte = ?", (idCompte,))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Le compte a bien été supprimé'}), 200



@admin_bp.route('/deleteTrajet/<string:token>/<int:idTrajet>', methods=['POST'])
def deleteTrajet(token, idTrajet):
    #On verifie que le token est admin
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT isAdmin FROM TOKEN NATURAL JOIN COMPTE WHERE auth_token = ?", (token,))
    admin = c.fetchone()
    if not admin:
        #Le token n'existe pas
        conn.close()
        return jsonify({'message': 'Le token est invalide ou expiré'}), 401
    else:
        isAdmin = admin[0]
        if not isAdmin:
            #Le token n'est pas admin
            conn.close()
            return jsonify({'message': 'Le token n\'est pas admin'}), 401
        else:
            #On verifie que le trajet existe
            c.execute("SELECT * FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
            trajet = c.fetchone()
            if not trajet:
                conn.close()
                return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
            else:
                c.execute("DELETE FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
                conn.commit()
                conn.close()
                return jsonify({'message': 'Le trajet a bien été supprimé.'}), 200
                
    


#Recuperer toutes les villes
@admin_bp.route('/villes', methods=['GET'])
def getRoutes():
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT nomVille FROM VILLE")
    rows = c.fetchall()
    return jsonify(rows), 200




#Modifier un compte côté admin; Vérification de si c'est l'admin, puis récupération du cookie user et modif de ses infos
@admin_bp.route('/modifCompte/<string:token>/<int:idCompte>', methods=['POST'])
def modifCompte(token, idCompte):
    #On verifie que le token est admin
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT isAdmin FROM COMPTE INNER JOIN TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    admin = c.fetchone()
    if not admin or admin[0] == 0:
        #Le token n'existe pas
        conn.close()
        return jsonify({'message': 'Le token est invalide ou expiré'}), 401

    data = request.get_json()
    email = data.get('email')
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




#Modifier un trajet côté admin
@admin_bp.route('/modifTrajet/<string:token>/<int:idTrajet>', methods=['POST'])
def modifTrajet(token, idTrajet):
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On verifie que le trajet existe
        c.execute("SELECT * FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        trajet = c.fetchone()
        if not trajet:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            #On verifie que l'utilisateur est admin
            c.execute("SELECT isAdmin FROM TOKEN NATURAL JOIN COMPTE WHERE auth_token = ?", (token,))
            admin = c.fetchone()
            if not admin:
                #Le token n'existe pas
                conn.close()
                return jsonify({'message': 'Le token n\'est pas admin'}), 401
            else:
                #On peut modifier le trajet
                data = request.get_json()
                heureDepart = data.get('heureDepart')
                dateDepart = data.get('dateDepart')
                nbPlaces = data.get('nbPlaces')
                prix = data.get('prix')
                commentaires = data.get('commentaires')
                precisionRdv = data.get('precisionRdv')
                villeDepart = data.get('villeDepart')
                villeArrivee = data.get('villeArrivee')

                #On verifie qu'il ne manque pas de donnees
                if not heureDepart or not dateDepart or not nbPlaces or not prix or not villeDepart or not villeArrivee:
                    conn.close()
                    return jsonify({'message': 'Il manque une ou plusieurs informations'}), 401
                else:
                    #On recupere les id des villes
                    c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeDepart,))
                    ville = c.fetchone()
                    if not ville:
                        conn.close()
                        return jsonify({'message': 'VilleDepart inexistante'}), 404
                    else:
                        villeDepart = ville[0]
                    c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeArrivee,))
                    ville = c.fetchone()
                    if not ville:
                        conn.close()
                        return jsonify({'message': 'VilleArrivee inexistante'}), 404
                    else:
                        villeArrivee = ville[0]

                    #On reformate la date
                    dateDepart = datetime.strptime(dateDepart, '%d %B, %Y').strftime('%Y%m%d')


                    query = None
                    values = ()
                    if not commentaires:
                        if not precisionRdv:
                            query = "UPDATE TRAJET SET heureDepart = ?, dateDepart = ?, nbPlaces = ?, prix = ?, villeDepart = ?, villeArrivee = ? WHERE idTrajet = ?"
                            values = (heureDepart, dateDepart, nbPlaces, prix, villeDepart, villeArrivee, idTrajet)
                        else:
                            query = "UPDATE TRAJET SET heureDepart = ?, dateDepart = ?, nbPlaces = ?, prix = ?, villeDepart = ?, villeArrivee = ?, precisionRdv = ? WHERE idTrajet = ?"
                            values = (heureDepart, dateDepart, nbPlaces, prix, villeDepart, villeArrivee, precisionRdv, idTrajet)
                    else:
                        if not precisionRdv:
                            query = "UPDATE TRAJET SET heureDepart = ?, dateDepart = ?, nbPlaces = ?, prix = ?, villeDepart = ?, villeArrivee = ?, commentaires = ? WHERE idTrajet = ?"
                            values = (heureDepart, dateDepart, nbPlaces, prix, villeDepart, villeArrivee, commentaires, idTrajet)
                        else:
                            query = "UPDATE TRAJET SET heureDepart = ?, dateDepart = ?, nbPlaces = ?, prix = ?, villeDepart = ?, villeArrivee = ?, commentaires = ?, precisionRdv = ? WHERE idTrajet = ?"
                            values = (heureDepart, dateDepart, nbPlaces, prix, villeDepart, villeArrivee, commentaires, precisionRdv, idTrajet)
                    if query:
                        c.execute(query, values)
                        conn.commit()
                        conn.close()
                        return jsonify({'message': 'Le trajet a bien été modifié.'}), 200
                    else:
                        conn.close()
                        return jsonify({'message': 'Probleme au niveau de la requête'}), 401