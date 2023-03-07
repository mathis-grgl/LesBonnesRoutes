import sqlite3
from datetime import datetime

DATABASE_NAME = "database.db"

def create_account(**kwargs):
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    values_name = ("nomCompte", "prenomCompte", "email", "genre", "voiture", "telephone", "mdp", "notificationMail", "typeCompte")
    values = []
    missing_values = []
    for val in values_name:
        try:
            values.append(kwargs[val])
        except KeyError:
            missing_values.append(val)
            
    query = """
        INSERT INTO COMPTE
        (
            nomCompte, 
            prenomCompte, 
            email, 
            genre, 
            voiture, 
            telephone, 
            mdp, 
            notificationMail, 
            typeCompte
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """
    cursor.execute(query, values)
    cursor.close()


def createPublicTrajet(idConducteur: int, heureDepart: str, dateDepart: str, prix:int, nbPlaces: int, commentaires: str, precisionRdv: str, villeDepart: str, villeArrivee: str):
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()

    #On recupere les id des villes
    sql = "SELECT idVille from VILLE WHERE nomVille = '%s'" % villeDepart
    idVilleDepart = cursor.execute(sql).fetchone()[0]

    sql = "SELECT idVille from VILLE WHERE nomVille = '%s'" % villeArrivee
    idVilleArrivee = cursor.execute(sql).fetchone()[0]

    values = (idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlaces, commentaires, precisionRdv, idVilleDepart, idVilleArrivee)
    sql = "INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee) VALUES (%u, '%s', '%s', %u, %u, %u, 'a pourvoir', '%s', '%s', %u, %u)" % values

    cursor.executescript(sql)

    #On recupere l'id de ce trajet (donc le plus grand) pui sinsertion dans la table
    sql = "SELECT MAX(idTrajet) FROM TRAJET"
    idTrajet = cursor.execute(sql).fetchone()[0]

    sql = "INSERT INTO TRAJET_PUBLIC VALUES (%u)" % idTrajet

    cursor.executescript(sql)

    cursor.close()


def newNote(idTrajet: int, idCompteNotant: int, idCompteNote: int, note: int):
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()

    values = (idTrajet, idCompteNotant, idCompteNote, note)
    sql = "INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote, note) VALUES (%u, %u, %u ,%u);" % values

    cursor.executescript(sql)

    cursor.close()


def modifNote(idNote: int, note: int):
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()

    sql = "UPDATE NOTE SET note = %u WHERE idNote = %u" % (note, idNote)

    cursor.executescript(sql)

    cursor.close()


def create_groupe(nomGroupe: str, amis):
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()

    #Creation du groupe avec 0 personnes au debut
    sql = "INSERT INTO GROUPE(nomGroupe, nbPersonnes) VALUES ('%s', 0);" % nomGroupe
    cursor.executescript(sql)

    #On recupere l'id du groupe (donc le dernier attribué)
    sql = "SELECT MAX(idGroupe) FROM GROUPE"
    idGroupe = cursor.execute(sql).fetchone()[0]

    #On ajoute les amis 1 par 1
    for ami in amis:
        sql = "INSERT INTO AMI_GROUPE VALUES (%u, %u)" % (ami, idGroupe)
        cursor.executescript(sql)

    cursor.close()


def addFriendToGroupe(idGroupe: int, idCompte: int):
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()

    sql = "INSERT INTO AMI_GROUPE VALUES (%u, %u)" % (idCompte, idGroupe)
    cursor.executescript(sql)

    cursor.close()


def removeFriend(idGroupe: int, idCompte: int):
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()

    sql = "DELETE FROM AMI_GROUPE WHERE idGroupe = %u AND idCompte = %u" % (idGroupe, idGroupe)
    cursor.executescript(sql)

    cursor.close()

def acceptInTrajet(token, idCompte, idTrajet, nbPlaces, accept):
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return 1#jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        #On vérifie que le compte et le trajet existent bien
        c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", (idCompte,))
        if not c.fetchone():
            conn.close()
            return 2#jsonify({'message': 'Ce compte n\'existe pas'}), 404
        c.execute("SELECT * FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        if not c.fetchone():
            conn.close()
            return 3#jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        
        #On verifie si on accepte ou pas la demande
        if accept == 'oui':
            #On accepte : on insere dans TRAJET_EN_COURS_PASSAGER
            c.execute("INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES (?, ?, ?)", (idCompte, idTrajet, nbPlaces))
            c.execute("DELETE FROM DEMANDE_TRAJET_EN_COURS WHERE idCompte = ? AND idTrajet = ?", (idCompte, idTrajet))
            conn.commit()
            conn.close()
            return 'Ok oui'#jsonify({'message': 'La demande a bien été acceptée.'}), 200
        elif accept == 'non':
            #On n'accepte pas : on supprime la demande
            c.execute("DELETE FROM DEMANDE_TRAJET_EN_COURS WHERE idCompte = ? AND idTrajet = ?", (idCompte, idTrajet))
            conn.commit()
            conn.close()
            return 'Ok non'#jsonify({'message': 'La demande a bien été refusée.'}), 200

#print(acceptInTrajet('9f36ad8ef1718c3c2258025e06e7eb2d', 1, 3, 2, 'non'))


def getConducteur(idTrajet):
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    #On vérifie que le trajet existe
    c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
    trajet = c.fetchone()
    if not trajet:
        conn.close()
        return 1#jsonify({'message': 'Ce trajet n\'existe pas'}), 404
    else:
        idConducteur = trajet[0]
        #On recupere les infos du conducteur
        c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", (idConducteur,))
        compte = c.fetchone()
        #On verifie que le compte existe bien
        if not compte:
            conn.close()
            return 2#jsonify({'message': 'Cet utilisateur n\'existe pas'}), 404
        else:
            #On recupere les noms de colonnes
            col_names = [desc[0] for desc in c.description]
            compte = {col_names[i]: compte[i] for i in range(len(col_names))}
            conn.close()
            return compte#jsonify(compte), 200

print(getConducteur(3))