URI_DATABASE = '../database.db'
from flask import Blueprint, jsonify, render_template, request
import sqlite3

ami_bp = Blueprint('ami', __name__)



#Créer un groupe d'ami
@ami_bp.route('/createGroupe/<string:token>/<string:nomGoupe>', methods=['POST'])
def createGroupe(token, nomGroupe):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    
    idCompte = compte[0]
    #On vérifie que le nom du groupe n'est pas déjà pris
    c.execute("SELECT idGroupe FROM GROUPE WHERE nomGroupe = ?", (nomGroupe,))
    res = c.fetchone()
    if res:
        conn.close()
        return jsonify({'message': 'Nom de groupe déjà pris.'}), 400

    #On peut créer le groupe
    c.execute("INSERT INTO GROUPE(idCompte, nomGroupe, nbPersonnes) VALUES (?, ?, 1)", (idCompte, nomGroupe))
    conn.commit()
    return jsonify({'message': 'Le groupe a bien été créé.'}), 200

