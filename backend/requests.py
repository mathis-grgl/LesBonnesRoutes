import sqlite3

def createCompte(nomCompte: str, prenomCompte: str, email: str, genre: str, voiture: int, telephone: int, mdp: str, notificationMail: int, typeCompte: str, nomPhoto = 0):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()

    if(nomPhoto == 0):
        values = (nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte)
        sql = "INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte) VALUES ('%s', '%s', '%s', '%s', %u, %u, '%s', %u, '%s');" % values
        cursor.executescript(sql)
    else:
        #TO DO : CHANGE NAME OF PHOTO TO nomPhotoIdCompte
        values = (nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte, nomPhoto)
        sql = "INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte, nomPhoto) VALUES ('%s', '%s', '%s', '%s', %u, %u, '%s', %u, '%s', '%s');" % values
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
    sql = "SELECT MAX(idTrajet) FROM TRAJET"
    idTrajet = cursor.execute(sql).fetchone()[0]

    sql = "INSERT INTO TRAJET_PUBLIC VALUES (%u)" % idTrajet

    cursor.executescript(sql)

    cursor.close()


def newNote(idTrajet: int, idCompteNotant: int, idCompteNote: int, note: int):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()

    values = (idTrajet, idCompteNotant, idCompteNote, note)
    sql = "INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote, note) VALUES (%u, %u, %u ,%u);" % values

    cursor.executescript(sql)

    cursor.close()



def modifNote(idNote: int, note: int):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()

    sql = "UPDATE NOTE SET note = %u WHERE idNote = %u" % (note, idNote)

    cursor.executescript(sql)

    cursor.close()



def createGroupe(nomGroupe: str, amis):
    connection = sqlite3.connect("database.db")
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



def addFriendToGroupe(idGroupe: int, idCompte: id):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()

    sql = "INSERT INTO AMI_GROUPE VALUES (%u, %u)" % (idCompte, idGroupe)
    cursor.executescript(sql)

    cursor.close()



def removeFriend(idGroupe: int, idCompte: int):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()

    sql = "DELETE FROM AMI_GROUPE WHERE idGroupe = %u AND idCompte = %u" % (idGroupe, idGroupe)
    cursor.executescript(sql)

    cursor.close()

