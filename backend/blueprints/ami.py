URI_DATABASE = '../database.db'
import json
from flask import Blueprint, jsonify, render_template, request
import sqlite3

ami_bp = Blueprint('ami', __name__)


@ami_bp.route("/groupes")
def groupes():
    return render_template("mes_groupes/mes-groupes.html")


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
    c.execute("INSERT INTO GROUPE(idCreateur, nomGroupe, nbPersonnes) VALUES (?, ?, 1)", (idCompte, nomGroupe))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Le groupe a bien été créé.'}), 200



#Ajouter un membre au groupe d'amis
@ami_bp.route('/addMember/<string:token>/<int:idGroupe>/<int:idAmi>', methods=['POST'])
def addMember(token, idGroupe, idAmi):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    
    idCompte = compte[0]

    #On vérifie que le compte est bien le créateur du groupe
    c.execute("SELECT * FROM GROUPE WHERE idCreateur = ? AND idGroupe = ?", (idCompte, idGroupe))
    createur = c.fetchone()
    if not createur:
        conn.close()
        return jsonify({'message': 'Seul le createur du groupe peut modifier le groupe'}), 403
    
    #On vérifie que l'ami existe bien
    c.execute("SELECT nomCompte FROM COMPTE WHERE idCompte = ?", (idAmi,))
    ami = c.fetchone()
    if not ami:
        conn.close()
        return jsonify({'message': 'L\'ami spécifié n\'existe pas'}), 404

    #On vérifie que l'ami ne fait pas déjà parti du groupe
    c.execute("SELECT nomCompte FROM COMPTE INNER JOIN AMI_GROUPE ON COMPTE.idCompte = AMI_GROUPE.idCompte WHERE AMI_GROUPE.idGroupe = ? AND COMPTE.idCompte = ?", (idGroupe, idAmi))
    participe = c.fetchone()
    if participe:
        conn.close()
        return jsonify({'message': 'Cet ami fait déjà parti de ce groupe'}), 403

    #On peut ajouter l'ami
    c.execute("INSERT INTO AMI_GROUPE VALUES (?, ?)", (idAmi, idGroupe))
    conn.commit()
    conn.close()
    return jsonify({'message': 'L\'ami a bien été ajouté au groupe.'}), 200


#Supprimer un membre du groupe d'amis
@ami_bp.route('/removeMember/<string:token>/<int:idGroupe>/<int:idAmi>', methods=['POST'])
def removeMember(token, idGroupe, idAmi):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    
    idCompte = compte[0]

    #On vérifie que le createur ne veut pas se supprimer lui-même
    if idCompte == idAmi:
        conn.close()
        return jsonify({'message': 'Le créateur du groupe ne peut pas se supprimer lui-même.'}), 403

    #On vérifie que le compte est bien le créateur du groupe
    c.execute("SELECT * FROM GROUPE WHERE idCreateur = ? AND idGroupe = ?", (idCompte, idGroupe))
    createur = c.fetchone()
    if not createur:
        conn.close()
        return jsonify({'message': 'Seul le createur du groupe peut modifier le groupe'}), 403
    
    #On vérifie que l'ami existe bien
    c.execute("SELECT nomCompte FROM COMPTE WHERE idCompte = ?", (idAmi,))
    ami = c.fetchone()
    if not ami:
        conn.close()
        return jsonify({'message': 'L\'ami spécifié n\'existe pas'}), 404

    #On vérifie que l'ami fait bien parti du groupe
    c.execute("SELECT nomCompte FROM COMPTE INNER JOIN AMI_GROUPE ON COMPTE.idCompte = AMI_GROUPE.idCompte WHERE AMI_GROUPE.idGroupe = ? AND COMPTE.idCompte = ?", (idGroupe, idAmi))
    participe = c.fetchone()
    if not participe:
        conn.close()
        return jsonify({'message': 'Cet ami ne fait pas parti de ce groupe'}), 403

    #On peut supprimer l'ami
    c.execute("DELETE FROM AMI_GROUPE WHERE idGroupe = ? AND idCompte = ?", (idGroupe, idAmi))
    conn.commit()
    conn.close()
    return jsonify({'message': 'L\'ami a bien été supprimé du groupe.'}), 200


@ami_bp.route('/supprimerGroupe/<string:token>/<int:idGroupe>', methods=['GET'])
def supprimerGroupe(token, idGroupe):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    
    idCompte = compte[0]

    #On vérifie que le compte est bien le créateur du groupe
    c.execute("SELECT * FROM GROUPE WHERE idCreateur = ? AND idGroupe = ?", (idCompte, idGroupe))
    createur = c.fetchone()
    if not createur:
        conn.close()
        return jsonify({'message': 'Seul le createur du groupe peut modifier le groupe'}), 403

    #On peut supprimer le groupe
    c.execute("DELETE FROM GROUPE WHERE idGroupe = ?", (idGroupe,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Le groupe a bien été supprimé.'}), 200


@ami_bp.route('/modifNom/<string:token>/<int:idGroupe>/<string:nouveauNom>', methods=['GET'])
def modifNom(token, idGroupe, nouveauNom):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    
    idCompte = compte[0]

    #On vérifie que le compte est bien le créateur du groupe
    c.execute("SELECT * FROM GROUPE WHERE idCreateur = ? AND idGroupe = ?", (idCompte, idGroupe))
    createur = c.fetchone()
    if not createur:
        conn.close()
        return jsonify({'message': 'Seul le createur du groupe peut modifier le groupe'}), 403

    #On vérifie que le nom n'est pas déjà pris
    c.execute("SELECT idGroupe FROM GROUPE WHERE nomGroupe = ? AND idGroupe != ?", (nouveauNom, idGroupe))
    res = c.fetchone()
    if res:
        conn.close()
        return jsonify({'message': 'Nom de groupe déjà pris.'}), 400

    #On peut modifier le nom du groupe
    c.execute("UPDATE GROUPE SET nomGroupe = ? WHERE idGroupe = ?", (nouveauNom, idGroupe))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Le nom du groupe a bien été modifié.'}), 200



@ami_bp.route('/getMembers/<int:idGroupe>', methods=['GET'])
def getMembers(idGroupe):
    #On vérifie que le groupe existe bien
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT * FROM GROUPE WHERE idGroupe = ?", (idGroupe,))
    groupe = c.fetchone()
    if not groupe:
        conn.close()
        return jsonify({'message': 'Groupe inexistant'}), 404

    #On peut récupérer les membres
    c.execute("""SELECT DISTINCT COMPTE.* FROM COMPTE 
                INNER JOIN AMI_GROUPE ON COMPTE.idCompte = AMI_GROUPE.idCompte 
                INNER JOIN GROUPE ON AMI_GROUPE.idGroupe = GROUPE.idGroupe
                WHERE GROUPE.idGroupe = ? """, (idGroupe,))
    
    results = []
    for row in c.fetchall():
        # Convertir chaque ligne en un dictionnaire
        row_dict = {
            'idCompte': row[0],
            'nomCompte': row[1],
            'prenomCompte': row[2],
            'email': row[3]
        }
        results.append(row_dict)

    conn.close()
    return jsonify(results), 200