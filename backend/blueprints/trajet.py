from flask import Blueprint, jsonify, request
import sqlite3

trajet_bp = Blueprint('trajet', __name__)


#Rechercher un trajet
@trajet_bp.route('/recherche', methods=['POST'])
def rechercher():
    # Récupérer les données envoyées dans la requête
    villeDepart = request.form.get('city-start')
    villeArrivee = request.form.get('city-end')
    date = request.form.get('date')
    nbPlaces = request.form.get('places')
    prixMin = request.form.get('lower-prices')
    prixMax = request.form.get('higher-prices')

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

        conn.commit()
        conn.close()

        # Retour de la réponse avec code 200
        return jsonify({'message': 'Le compte a bien été déconnecté.'}), 200
    else:
        # Retour de la réponse avec code 401 et un message d'erreur
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401