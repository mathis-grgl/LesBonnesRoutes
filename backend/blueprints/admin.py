from flask import Blueprint, jsonify, render_template
import sqlite3

admin_bp = Blueprint('admin', __name__)

# Pages
@admin_bp.route('/')
def admin_index():
    return render_template('admin/index/admin-index.html')


@admin_bp.route('/account')
def admin_account():
    return render_template('admin/account/admin-account.html')


@admin_bp.route('/search-account')
def admin_search_account():
    return render_template('admin/search-account/admin-search-account.html')


@admin_bp.route('/deconnexion')
def admin_deconnexion():
    return render_template('admin/deconnexion/admin-deconnexion.html')


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
    c.execute("SELECT isAdmin FROM TOKEN NATURAL JOIN COMPTE WHERE token = ?", token)
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
            c.execute("DELETE FROM COMPTE WHERE idCompte = ?", idCompte)
            conn.commit()
            conn.close()
            return jsonify({'message': 'Le compte a bien été supprimé'}), 200



@admin_bp.route('/deleteTrajet/<string:token>/<int:idTrajet>', methods=['POST'])
def deleteTrajet(token, idTrajet):
    #On verifie que le token est admin
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT isAdmin FROM TOKEN NATURAL JOIN COMPTE WHERE token = ?", token)
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
            c.execute("SELECT * FROM TRAJET WHERE idTrajet = ?", idTrajet)
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