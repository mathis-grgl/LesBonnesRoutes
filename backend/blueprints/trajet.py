from flask import Blueprint, jsonify, request
from datetime import datetime
import sqlite3

trajet_bp = Blueprint('trajet', __name__)


#Voir un trajet
@trajet_bp.route('/trajet/<int:idTrajet>', methods=['POST'])
def getTrajet(idTrajet):
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
    trajet = c.fetchone()

    if not trajet:
        conn.close()
        return jsonify({'message': 'Trajet non trouvé'}), 404

    else:

        # Récupération des noms de colonnes
        col_names = [desc[0] for desc in c.description]

        # Création d'un dictionnaire contenant les données du trajet
        trajet = {col_names[i]: trajet[i] for i in range(len(col_names))}

        # Conversion de la date de la colonne 'dateDepart'
        dateTrajet = datetime.strptime(trajet['dateDepart'], '%Y%m%d').strftime('%d %B, %Y')
        trajet['dateDepart'] = dateTrajet

        # Conversion de l'idVille en nomVille
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeDepart'],))
        trajet['villeDepart'] = c.fetchone()[0]
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeArrivee'],))
        trajet['villeArrivee'] = c.fetchone()[0]

        conn.close()

        return jsonify(trajet)




#Rechercher un trajet
@trajet_bp.route('/recherche', methods=['POST'])
def rechercher():
    # Récupérer les données envoyées dans la requête
    data = request.get_json()
    villeDepart = data.get('city-start')
    villeArrivee = data.get('city-end')
    date = data.get('date')
    nbPlaces = data.get('places')
    prixMin = data.get('lower-prices')
    prixMax = data.get('higher-prices')

    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    
    query = "SELECT * FROM TRAJET WHERE 1=1"

    params = []  # Initialisation de la liste des paramètres de la requête

    if villeDepart:
        #On recupere l'id de la ville
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeDepart,))
        ville = c.fetchone()
        if not ville:
            #Il y a un pbm, la ville n'existe pas
            conn.close()
            return jsonify({'message': 'La ville n\'existe pas'}), 404
        else:
            idVille = ville[0]
            query += " AND villeDepart = ?"
            params.append(idVille)
            print("VilleDepart = ", idVille)

    if villeArrivee:
        #On recupere l'id de la ville
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeArrivee,))
        ville = c.fetchone()
        if not ville:
            #Il y a un pbm, la ville n'existe pas
            conn.close()
            return jsonify({'message': 'La ville n\'existe pas'}), 404
        else:
            idVille = ville[0]
            query += " AND villeArrivee = ?"
            params.append(idVille)
            print("VilleArrivee = ", idVille)

    if date:
        #On reformate la date sous la forme YYYYMMDD
        date_obj = datetime.strptime(date, '%d %B, %Y')
        date = date_obj.strftime('%Y%m%d')
        query += " AND dateDepart = ?"
        params.append(date)

    if nbPlaces:
        query += " AND nbPlaces = ?"
        params.append(nbPlaces)

    if prixMin:
        query += " AND prix >= ?"
        params.append(prixMin)

    if prixMax:
        query += " AND prix <= ?"
        params.append(prixMax)

    # Exécution de la requête avec les paramètres
    c.execute(query, params)

    # Récupération des résultats
    results = c.fetchall()

    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Création d'une liste de dictionnaires contenant les données
    trajets = []
    for row in results:
        trajet = {col_names[i]: row[i] for i in range(len(col_names))}

        # Conversion de la date de la colonne 'dateDepart'
        dateTrajet = datetime.strptime(trajet['dateDepart'], '%Y%m%d').strftime('%d %B, %Y')
        trajet['dateDepart'] = dateTrajet
        trajets.append(trajet)

        # Conversion de l'idVille en nomVille
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeDepart'],))
        trajet['villeDepart'] = c.fetchone()[0]
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeArrivee'],))
        trajet['villeArrivee'] = c.fetchone()[0]


    conn.close()
    return jsonify(trajets)



#Voir la liste des trajets d'un compte avec son token
@trajet_bp.route('/trajetsCompte/<string:token>', methods=['GET'])
def trajetsCompte(token):
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if compte:
        #On peut chercher tous ses trajets
        idCompte = compte[0]
        c.execute("SELECT * FROM COMPTE INNER JOIN TRAJET ON COMPTE.idCompte = TRAJET.idConducteur INNER JOIN TRAJET_EN_COURS_PASSAGER ON TRAJET.idTrajet = TRAJET_EN_COURS_PASSAGER.idTrajet WHERE TRAJET_EN_COURS_PASSAGER.idCompte = ? ORDER BY dateDepart ASC", (idCompte,))
        rows = c.fetchall()

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
    else:
        # Retour de la réponse avec code 401 et un message d'erreur
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401




@trajet_bp.route('/createTrajet/<string:token>', methods=['POST', 'GET'])
def createTrajet(token):
    data = request.get_json()
    heureDepart = data.get('heureDepart')
    dateDepart = data.get('dateDepart')
    nbPlaces = data.get('nbPlaces')
    prix = data.get('prix')
    commentaires = data.get('commentaires')
    precisionRdv = data.get('precisionRdv')
    villeDepart = data.get('villeDepart')
    villeArrivee = data.get('villeArrivee')

    if not heureDepart or not dateDepart or not nbPlaces or not prix or not villeDepart or not villeArrivee:
        return jsonify({'message': 'I*l manque une ou plusieurs infos'}), 401

    #On reformate la date
    dateDepart = datetime.strptime(dateDepart, '%d %B, %Y').strftime('%Y%m%d')

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
        
        query = None
        values = ()
        if not commentaires:
            if not precisionRdv:
                query = "INSERT INTO TRAJET (idConducteur, heureDepart, dateDepart, nbPlaces, nbPlacesRestantes, prix, statusTrajet, villeDepart, villeArrivee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
                values = (idCompte, heureDepart, dateDepart, nbPlaces, nbPlaces, prix, 'A pourvoir', villeDepart, villeArrivee)
            else:
                query = "INSERT INTO TRAJET (idConducteur, heureDepart, dateDepart, nbPlaces, nbPlacesRestantes, prix, statusTrajet, villeDepart, villeArrivee, precisionRdv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                values = (idCompte, heureDepart, dateDepart, nbPlaces, nbPlaces, prix, 'A pourvoir', villeDepart, villeArrivee, precisionRdv)
        else:
            if not precisionRdv:
                query = "INSERT INTO TRAJET (idConducteur, heureDepart, dateDepart, nbPlaces, nbPlacesRestantes, prix, statusTrajet, villeDepart, villeArrivee, commentaires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                values = (idCompte, heureDepart, dateDepart, nbPlaces, nbPlaces, prix, 'A pourvoir', villeDepart, villeArrivee, commentaires)
            else:
                query = "INSERT INTO TRAJET (idConducteur, heureDepart, dateDepart, nbPlaces, nbPlacesRestantes, prix, statusTrajet, villeDepart, villeArrivee, commentaires, precisionRdv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                values = (idCompte, heureDepart, dateDepart, nbPlaces, nbPlaces, prix, 'A pourvoir', villeDepart, villeArrivee, commentaires, precisionRdv)
        if query:
            c.execute(query, values)
            conn.commit()
            conn.close()
            return jsonify({'message': 'Le trajet a bien été créé.'}), 200
        else:
            conn.close()
            return jsonify({'message': 'Probleme au niveau de la requête'}), 401



@trajet_bp.route('/deleteTrajet/<string:token>/<int:idTrajet>', methods=['POST'])
def deleteTrajet(token, idTrajet):
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
        #On vérifie que le client est bien conducteur du trajet et que le trajet existe
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        conducteur = c.fetchone()
        if not conducteur:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            idConducteur = conducteur[0]
            if idCompte != idConducteur:
                conn.close()
                return jsonify({'message': 'Suppression non autorisée : vous n\'êtes pas conducteur de ce trajet'}), 403
            else:
                c.execute("DELETE FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
                conn.commit()
                conn.close()
                return jsonify({'message': 'Le trajet a bien été supprimé.'}), 200



@trajet_bp.route('/demandeTrajet/<string:token>/<int:idTrajet>/<int:nbPlaces>', methods=['POST'])
def demandeTrajet(token, idTrajet, nbPlaces):
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
        #On verifie que le compte ne participe pas deja au trajet ou n'a pas deja une demande en cours
        c.execute("SELECT * FROM TRAJET_EN_COURS_PASSAGER NATURAL JOIN TRAJET WHERE TRAJET_EN_COURS_PASSAGER.idCompte = ? OR TRAJET.idConducteur = ?", (idCompte, idCompte))
        particpe = c.fetchone()
        c.execute("SELECT * FROM DEMANDE_TRAJET_EN_COURS WHERE idCompte = ?", (idCompte,))
        demande = c.fetchone()
        if particpe or demande:
            conn.close()
            return jsonify({'message': 'Requête refusée : vous êtes déjà un participant du trajet ou avez une demande en cours'}), 403
        else:
            #On verifie le nombre de places restantes
            c.execute("SELECT nbPlacesRestantes FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
            nbPlacesRestantes = c.fetchone()[0]
            if nbPlaces > nbPlacesRestantes:
                conn.close()
                return jsonify({'message': 'Requête refusée : le nombre de places demandées est supérieure au nb disponible'}), 403
            else:
                c.execute("INSERT INTO DEMANDE_TRAJET_EN_COURS VALUES (?, ?, ?, ?)", (idCompte, idTrajet, nbPlaces, 'en cours'))
                conn.commit()
                conn.close()
                return jsonify({'message': 'La demande a bien été prise en compte.'}), 200



@trajet_bp.route('/quitterTrajet/<string:token>/<int:idTrajet>', methods=['POST'])
def quitterTrajet(token, idTrajet):
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
        #On vérifie que l'utilisateur n'est pas le conducteur du trajet
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        trajet = c.fetchone()
        if not trajet:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            if idCompte == trajet[0]:
                conn.close()
                return jsonify({'message': 'Requête refusée : vous ne pouvez pas quitter un trajet si vous êtes le conducteur'}), 403
            else:
                #On test si l'utilisateur est bien passager du trajet
                c.execute("SELECT * FROM TRAJET_EN_COURS_PASSAGER WHERE idTrajet = ?", (idTrajet,))
                if not c.fetchone():
                    conn.close()
                    return jsonify({'message': 'Requête refusée : vous ne pouvez pas quitter un trajet si vous n\'y participez pas'}), 403
                else:
                    #On peut quitter le trajet
                    c.execute("DELETE FROM TRAJET_EN_COURS_PASSAGER WHERE idTrajet = ? AND idCompte = ?", (idTrajet, idCompte))
                    conn.commit()
                    return jsonify({'message': 'La demande d\'annulation de participation a bien été prise en compte.'}), 200



@trajet_bp.route('/conducteur/<int:idTrajet', methods=['POST'])
def getConducteur(idTrajet):
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    #On vérifie que le trajet existe
    c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
    trajet = c.fetchone()
    if not trajet:
        conn.close()
        return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
    else:
        idConducteur = trajet[0]
        #On recupere les infos du conducteur
        c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", (idConducteur,))
        compte = c.fetchone()
        #On verifie que le compte existe bien
        if not compte:
            conn.close()
            return jsonify({'message': 'Cet utilisateur n\'existe pas'}), 404
        else:
            #On recupere les noms de colonnes
            col_names = [desc[0] for desc in c.description]
            compte = {col_names[i]: trajet[i] for i in range(len(col_names))}
            conn.close()
            return jsonify(compte), 200