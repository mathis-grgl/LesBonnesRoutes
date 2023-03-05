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
    c.execute("SELECT idCompte FROM TOKEN WHERE token = ?", token)
    compte = c.fetchone()

    if compte:
        #On peut chercher tous ses trajets
        idCompte = compte[0]
        c.execute("SELECT * FROM COMPTE INNER JOIN TRAJET ON COMPTE.idCompte = TRAJET.idConducteur INNER JOIN TRAJET_EN_COURS_PASSAGER ON TRAJET.idTrajet = TRAJET_EN_COURS_PASSAGER.idTrajet WHERE TRAJET_EN_COURS_PASSAGER.idCompte = [id du passager]");
        rows = c.fetchall()

        # Récupération des noms de colonnes
        col_names = [desc[0] for desc in c.description]

        # Conversion de la date dans chaque ligne de résultat
        trajets = []
        for row in rows:
            trajet = {col_names[i]: row[i] for i in range(len(col_names))}

            # Conversion de la date de la colonne 'dateTrajet'
            dateTrajet = datetime.strptime(trajet['dateTrajet'], '%Y%m%d').strftime('%d %B, %Y')
            trajet['dateTrajet'] = dateTrajet

            trajets.append(trajet)

        conn.commit()
        conn.close()

        # Retour de la réponse avec code 200
        return jsonify({'message': 'Le compte a bien été déconnecté.'}), 200
    else:
        # Retour de la réponse avec code 401 et un message d'erreur
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401