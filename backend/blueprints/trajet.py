from flask import Blueprint, jsonify, request
import sqlite3

trajet_bp = Blueprint('trajet', __name__)


#Rechercher un trajet
@trajet_bp.route('/recherche', methods=['GET'])
def rechercher():
    # Récupérer les données envoyées dans la requête
    villeDepart = request.form.get('city_start')
    villeArrivee = request.form.get('city_end')
    date = '20230312' #pour 12 mars 2023    --> recup ?
    nbPlaces = 1       #recup ?
    prixMin = 2      #recup ?
    prixMax = 10      #recup ?

    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    
    query = "SELECT * FROM TRAJET WHERE 1=1"

    params = []  # Initialisation de la liste des paramètres de la requête

    if villeDepart:
        #On recupere l'id de la ville
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", villeDepart)
        ville = c.fetchone()
        if not ville:
            #Il y a un pbm, la ville n'existe pas
            conn.close()
            return jsonify({'message': 'La ville n\'existe pas'}), 404
        else:
            idVille = ville[0]
            query += " AND villeDepart = ?"
            params.append(idVille)

    if villeArrivee:
        #On recupere l'id de la ville
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", villeDepart)
        ville = c.fetchone()
        if not ville:
            #Il y a un pbm, la ville n'existe pas
            conn.close()
            return jsonify({'message': 'La ville n\'existe pas'}), 404
        else:
            idVille = ville[0]
            query += " AND villeArrivee = ?"
            params.append(idVille)

    if date:
        query += " AND dateDepart = ?"
        params.append(date)

    if nbPlaces:
        if nbPlaces == '4+':
            query += " AND nbPlaces > 3"
        else:
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
    users = []
    for row in results:
        user = {col_names[i]: row[i] for i in range(len(col_names))}
        users.append(user)

    conn.close()
    return jsonify(users)
