import sqlite3

def createCompte(nomCompte: str, prenomCompte: str, email: str, genre: str, voiture: int, telephone: int, mdp: str, notificationMail: int, typeCompte: str):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()

    values = (nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte)
    sql = "INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte) VALUES ('%s', '%s', '%s', '%s', %u, %u, '%s', %u, '%s');" % values
    cursor.executescript(sql)

    cursor.close()


def createPublicTrajet(idConducteur: int, heureDepart: str, dateDepart: str, prix:int, nbPlaces: int, commentaires: str, precisionRdv: str, villeDepart: str, villeArrivee: str):
    connection = sqlite3.connect("database.db")
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
    sql = "SELECT MAX(idTrajet) from TRAJET"
    idTrajet = cursor.execute(sql).fetchone()[0]

    sql = "INSERT INTO TRAJET_PUBLIC VALUES (%u)" % idTrajet

    cursor.executescript(sql)

    cursor.close()



connection = sqlite3.connect("database.db")

cursor = connection.cursor()

script = open("backend/db.sql")

cursor.executescript(script.read())

cursor.close()