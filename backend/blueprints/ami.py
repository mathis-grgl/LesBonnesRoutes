URI_DATABASE = '../database.db'
from datetime import datetime, timedelta
import json
from flask import Blueprint, jsonify, render_template, request
import sqlite3
from backend.notifManager import *


ami_bp = Blueprint('ami', __name__)


@ami_bp.route("/groupes")
def groupes():
    return render_template("mes_groupes/mes-groupes.html")

@ami_bp.route('/creer_groupe_damis')
def creer_groupe():
    return render_template('mes_groupes/creer_groupes_damis.html')

@ami_bp.route('/modifier_groupe', methods=['POST', 'GET'])
def modifier_groupe():
    return render_template('editGroupe/editGroupe.html')

@ami_bp.route('/ajouter_amis', methods=['POST', 'GET'])
def ajouter_ami():
    return render_template('ajouterAmis/ajouterAmis.html')


@ami_bp.route('/voir_membres', methods=['POST', 'GET'])
def voir_membres():
    return render_template('groupMembers/groupMembers.html')

@ami_bp.route('/trajets_prives', methods=['POST', 'GET'])
def voir_trajets_prives():
    return render_template('trajetPrives/trajetPrives.html')


#Créer un groupe d'ami
@ami_bp.route('/createGroupe/<string:token>', methods=['POST'])
def createGroupe(token):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    data = request.get_json()
    nomGroupe = data.get('nomGroupe')
    print(nomGroupe)

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
@ami_bp.route('/addMember/<string:token>/<int:idGroupe>/<int:idAmi>', methods=['GET'])
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

    #On envoie une notif à l'ami en question
    sendNotifAmi(idCompte, idAmi, idGroupe, "Vous avez été ajouté au groupe !")

    return jsonify({'message': 'L\'ami a bien été ajouté au groupe.'}), 200


#Supprimer un membre du groupe d'amis
@ami_bp.route('/removeMember/<string:token>/<int:idGroupe>/<int:idAmi>', methods=['GET'])
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

    #On envoie une notif à l'utilisateur
    sendNotifAmi(idCompte, idAmi, idGroupe, "Vous avez été supprimé du groupe")

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


    #On peut supprimer le groupe et ses trajets
    sendNotifDeleteGroupe(idCompte, idGroupe) #On envoie une notif avant de supprimer
    c.execute("DELETE FROM GROUPE WHERE idGroupe = ?", (idGroupe,))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Le groupe a bien été supprimé.'}), 200


@ami_bp.route('/modifNom/<string:token>/<int:idGroupe>', methods=['POST'])
def modifNom(token, idGroupe):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    
    idCompte = compte[0]
    data = request.get_json()
    nouveauNom = data.get('nomGroupe')

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

    #On envoie une notif aux membres
    sendNotifGroupe(idCompte, idGroupe, "Le nom du groupe a été modifié !")
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
    c.execute("""SELECT DISTINCT COMPTE.idCompte,COMPTE.nomCompte, COMPTE.prenomCompte, COMPTE.email, COMPTE.photo, GROUPE.idCreateur FROM COMPTE 
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
            'email': row[3],
            'photo': row[4],
            'idCreateur' : row[5]
        }
        results.append(row_dict)

    conn.close()
    return jsonify(results), 200


@ami_bp.route('/getGroupes/<string:token>', methods=['GET'])
def getGroupes(token):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    
    idCompte = compte[0]

    #On peut récupérer les groupes
    c.execute("SELECT GROUPE.idGroupe, GROUPE.nomGroupe, GROUPE.nbPersonnes, COMPTE.nomCompte, COMPTE.prenomCompte, COMPTE.idCompte FROM AMI_GROUPE JOIN GROUPE ON AMI_GROUPE.idGroupe = GROUPE.idGroupe JOIN COMPTE ON GROUPE.idCreateur = COMPTE.idCompte WHERE AMI_GROUPE.idCompte = ?", (idCompte,))
    res = c.fetchall()
    groupes = []
    
    for groupe in res:
        groupes.append({'idGroupe' : groupe[0], 'nomGroupe' : groupe[1], 'nbPersonnes' : groupe[2], 'createur' : groupe[3] + " " + groupe[4], 'idCreateur' : groupe[5]})

    conn.close()

    return jsonify(groupes), 200


@ami_bp.route('/getTrajetsGroupe/<string:token>/<int:idGroupe>', methods=['GET'])
def getTrajetsGroupe(token, idGroupe):
    #On verifie le token
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT COMPTE.idCompte FROM COMPTE inner join TOKEN on COMPTE.idCompte = TOKEN.idCompte WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré.'}), 401
    
    idCompte = compte[0]

    #On vérifie que l'utilisateur fait parti du groupe et que le groupe existe donc
    c.execute("SELECT nomCompte FROM COMPTE INNER JOIN AMI_GROUPE ON COMPTE.idCompte = AMI_GROUPE.idCompte WHERE AMI_GROUPE.idGroupe = ? AND COMPTE.idCompte = ?", (idGroupe, idCompte))
    participe = c.fetchone()
    c.execute("SELECT * FROM GROUPE WHERE idCreateur = ? AND idGroupe = ?", (idCompte, idGroupe))
    createur = c.fetchone()
    if not participe and not createur:
        conn.close()
        return jsonify({'message': 'L\'utilisateur ne fait pas parti de ce groupe'}), 403
        
    
    #On peut récup les trajets du groupe
    query = """
            SELECT DISTINCT TRAJET.*
            FROM TRAJET_PRIVE INNER JOIN TRAJET ON TRAJET_PRIVE.idTrajet = TRAJET.idTrajet
            WHERE (TRAJET_PRIVE.idGroupe = ?) AND TRAJET.statusTrajet!='termine'
        """

    c.execute(query, (idGroupe,))
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
        trajet['idCompte'] = idCompte

        trajets.append(trajet)

    conn.close()

    # Retour de la réponse avec code 200
    return jsonify(trajets), 200