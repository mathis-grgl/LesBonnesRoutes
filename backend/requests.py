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



def demandeTrajet(token, idTrajet, nbPlaces):
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return 1#jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On verifie que le compte ne participe pas deja au trajet ou n'a pas deja une demande en cours
        c.execute("SELECT * FROM TRAJET_EN_COURS_PASSAGER NATURAL JOIN TRAJET WHERE TRAJET_EN_COURS_PASSAGER.idCompte = ? OR TRAJET.idConducteur = ?", (idCompte, idCompte))
        particpe = c.fetchone()
        c.execute("SELECT * FROM DEMANDE_TRAJET_EN_COURS WHERE idCompte = ?", (idCompte,))
        demande = c.fetchone()
        if particpe or demande:
            conn.close()
            return 2#jsonify({'message': 'Requête refusée : vous êtes déjà un participant du trajet'}), 403
        else:
            #On verifie le nombre de places restantes
            c.execute("SELECT nbPlacesRestantes FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
            nbPlacesRestantes = c.fetchone()[0]
            if nbPlaces > nbPlacesRestantes:
                conn.close()
                return 3#jsonify({'message': 'Requête refusée : le nombre de places demandées est supérieure au nb disponible'}), 403
            else:
                c.execute("INSERT INTO DEMANDE_TRAJET_EN_COURS VALUES (?, ?, ?, ?)", (idCompte, idTrajet, nbPlaces, 'en cours'))
                conn.commit()
                conn.close()
                return 'OK'#jsonify({'message': 'La demande a bien été prise en compte.'}), 200

print(demandeTrajet('9f36ad8ef1718c3c2258025e06e7eb2d', 3, 2))