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



def createTrajet(token):
    #data = request.get_json()
    heureDepart = '10h30'
    dateDepart = '11 March, 2023'
    nbPlaces = 3
    prix = 13
    commentaires = 'commentaires'
    precisionRdv = 'precisionRdv'
    villeDepart = 'Paris'
    villeArrivee = 'Lyon'

    if not heureDepart or not dateDepart or not nbPlaces or not prix or not villeDepart or not villeArrivee:
        return 'Il manque une ou plusieurs infos'

    #On reformate la date
    dateDepart = datetime.strptime(dateDepart, '%d %B, %Y').strftime('%Y%m%d')

    conn = sqlite3.connect('../database.db')
    c = conn.cursor()

    if True:
        idCompte = 1
        #On recupere les id des villes
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeDepart,))
        ville = c.fetchone()
        if not ville:
            conn.close()
            return 'pbm villeD'
        else:
            villeDepart = ville[0]
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeArrivee,))
        ville = c.fetchone()
        if not ville:
            conn.close()
            return 'Pbm villeA'
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
            print(query)
            print(values)
            conn.commit()
            conn.close()
            return 'OK'
        else:
            conn.close()
            return 'pbm requete vide'

print(createTrajet('9f36ad8ef1718c3c2258025e06e7eb2d'))