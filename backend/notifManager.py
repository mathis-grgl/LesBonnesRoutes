URI_DATABASE = '../database.db'
import sqlite3
from datetime import datetime, timedelta


def sendNotifTrajet(idCompteEnv, idCompteRcv, idTrajet, message):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    #On insère dans NOTIFICATION
    c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompteEnv, message))
    conn.commit()  #Obligatoire pour les clés étrangères

    #On recupere l'id de cette notification
    c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
    idNotif = c.fetchone()[0]

    #On insère dans NOTIF_TRAJET
    c.execute("INSERT INTO NOTIF_TRAJET VALUES (?, ?)", (idNotif, idTrajet))

    #On insère dans NOTIF_RECUE
    c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (idCompteRcv, idNotif))

    conn.commit()
    conn.close()



def sendNotifTrajetPassagers(idCompteEnv, idTrajet, message):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    # On insère dans NOTIFICATION, NOTIF_TRAJET et NOTIF_RECUE pour chaque passager
    c.execute("SELECT idCompte FROM TRAJET_EN_COURS_PASSAGER WHERE idTrajet=?", (idTrajet,))
    passagers = c.fetchall()
    for p in passagers:
        # On insère dans NOTIFICATION
        c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompteEnv, message))
        conn.commit()  # Obligatoire pour les clés étrangères

        # On recupere l'id de cette notification
        c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
        idNotif = c.fetchone()[0]

        c.execute("INSERT INTO NOTIF_TRAJET VALUES (?, ?)", (idNotif, idTrajet))
        # On insère dans NOTIF_RECUE
        c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (p[0], idNotif))

    conn.commit()
    conn.close()




def sendNotifGroupe(idCompteEnv, idGroupe, message):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    # On insère dans NOTIFICATION, NOTIF_GROUPE, NOTIF_RECUE pour chaque membre du groupe
    c.execute("SELECT idCompte FROM AMI_GROUPE WHERE idGroupe=?", (idGroupe,))
    membres = c.fetchall()
    for m in membres:
        #On insère dans NOTIFICATION
        c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompteEnv, message))
        conn.commit()  #Obligatoire pour les clés étrangères

        #On recupere l'id de cette notification
        c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
        idNotif = c.fetchone()[0]

        #On insère dans NOTIF_TRAJET
        c.execute("INSERT INTO NOTIF_GROUPE VALUES (?, ?)", (idNotif, idGroupe))
        # On insère dans NOTIF_RECUE
        c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (m[0], idNotif))

    conn.commit()
    conn.close()


def sendNotifAmi(idCompteEnv, idCompteAmi, idGroupe, message):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    #On insère dans NOTIFICATION
    c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompteEnv, message))
    conn.commit()  #Obligatoire pour les clés étrangères

    #On recupere l'id de cette notification
    c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
    idNotif = c.fetchone()[0]

    #On insère dans NOTIF_TRAJET
    c.execute("INSERT INTO NOTIF_GROUPE VALUES (?, ?)", (idNotif, idGroupe))

    #On insère dans NOTIF_RECUE
    c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (idCompteAmi, idNotif))

    conn.commit()
    conn.close()


def sendNotifDeleteGroupe(idCompte, idGroupe):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    #On recupere les membres concernés
    c.execute("SELECT idCompte FROM AMI_GROUPE WHERE idGroupe = ?", (idGroupe,))
    members = c.fetchall()

    #On recupere le nom du groupe et le nom du createur
    c.execute("SELECT GROUPE.nomGroupe, COMPTE.nomCompte, COMPTE.prenomCompte FROM GROUPE INNER JOIN COMPTE ON GROUPE.idCreateur = COMPTE.idCompte")
    res = c.fetchone()
    nomGroupe = res[0]
    createur = res[1] + " " + res[2]
    message = "Le groupe " + nomGroupe + " a été supprimé "

    #On verifie s'il y a des des trajets privés en cours 
    c.execute("SELECT TRAJET.idTrajet, TRAJET.villeDepart, TRAJET.villeArrivee FROM TRAJET_PRIVE INNER JOIN TRAJET ON TRAJET_PRIVE.idTrajet = TRAJET.idTrajet WHERE idGroupe = ?", (idGroupe,))
    trajets = c.fetchall()
    for trajet in trajets:
        idTrajet = trajet[0]
        villeDepart = trajet[1]
        villeArrivee = trajet[2]
        # Conversion de l'idVille en nomVille et de la date
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (villeDepart,))
        villeDepart = c.fetchone()[0]
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (villeArrivee,))
        villeArrivee = c.fetchone()[0]
        messageNotif = "Le trajet " + villeDepart + " -> " + villeArrivee + " du groupe " + nomGroupe + " a été supprimé"

        #On récupère les participants de ce trajet
        c.execute("SELECT idCompte FROM TRAJET_EN_COURS_PASSAGER WHERE idTrajet = ?", (idTrajet,))
        users = c.fetchall()
        for user in users:
            idUser = user[0]
            #On insère les notifs
            c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompte, messageNotif))
            c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
            idNotif = c.fetchone()[0]
            c.execute("INSERT INTO NOTIF_RECUE VALUES(?, ?)", (idUser, idNotif))


    #On supprime toutes les notifs en rapport avec ce groupe
    c.execute("SELECT idNotification FROM NOTIF_GROUPE WHERE idGroupe = ?", (idGroupe,))
    notifs = c.fetchall()

    for notif in notifs:
        n = notif[0]
        #Pour chaque notif on supprime de chaque table
        c.execute("DELETE FROM NOTIF_RECUE WHERE idNotification = ?", (n,))
        c.execute("DELETE FROM NOTIF_GROUPE WHERE idNotification = ?", (n,))
        c.execute("DELETE FROM NOTIFICATION WHERE idNotification = ?", (n,))

    #On envoie une notif à chaque membres pour les informer de la suppression du groupe
    for member in members:
        m = member[0]
        c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompte, message))
        #On recupere l'id de cette notification
        c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
        idNotif = c.fetchone()[0]
        c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (m, idNotif))

    conn.commit()
    conn.close()


def sendNotifDeleteTrajet(idCompte, idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    #On recupere les membres concernés
    c.execute("SELECT idCompte FROM TRAJET_EN_COURS_PASSAGER WHERE idTrajet = ?", (idTrajet,))
    passagers = c.fetchall()

    #On recupere la ville de départ/sortie et la date
    c.execute("SELECT villeDepart, villeArrivee, dateDepart FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
    res = c.fetchone()
    villeDepart = res[0]
    villeArrivee = res[1]
    dateDepart = res[2]
    # Conversion de l'idVille en nomVille et de la date
    c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (villeDepart,))
    villeDepart = c.fetchone()[0]
    c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (villeArrivee,))
    villeArrivee = c.fetchone()[0]
    dateDepart = datetime.strptime(dateDepart, '%Y%m%d').strftime('%d %B, %Y')

    message = "Le trajet " + villeDepart + " -> " + villeArrivee + " du " + dateDepart + " a été supprimé"



    #On supprime toutes les notifs en rapport avec ce trajet
    c.execute("SELECT idNotification FROM NOTIF_TRAJET WHERE idTrajet = ?", (idTrajet,))
    notifs = c.fetchall()

    for notif in notifs:
        n = notif[0]
        #Pour chaque notif on supprime de chaque table
        c.execute("DELETE FROM NOTIF_RECUE WHERE idNotification = ?", (n,))
        c.execute("DELETE FROM NOTIF_TRAJET WHERE idNotification = ?", (n,))
        c.execute("DELETE FROM NOTIFICATION WHERE idNotification = ?", (n,))

    #On envoie une notif à chaque membres pour les informer de la suppression du groupe
    for passager in passagers:
        p = passager[0]
        c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompte, message))
        #On recupere l'id de cette notification
        c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
        idNotif = c.fetchone()[0]
        c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (p, idNotif))

    conn.commit()
    conn.close()


def sendNotifDeleteCompte(idCompte):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    #On recupere les trajets de ce compte
    c.execute("SELECT idTrajet FROM TRAJET WHERE idConducteur = ?", (idCompte,))
    trajets = c.fetchall()

    for trajet in trajets:
        idTrajet = trajet[0]
        sendNotifDeleteTrajet(idCompte, idTrajet)

    conn.commit()
    conn.close()


def sendNotifCompte(idCompteEnvoyeur, idCompte, message):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompteEnvoyeur, message))
    #On recupere l'id de cette notification
    c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
    idNotif = c.fetchone()[0]
    c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (idCompte, idNotif))

    conn.commit()
    conn.close()



#sendNotifTrajet(1, 2, 1, "message pour le trajet ...")
#sendNotifGroupe(1, 1, "message pour le groupe !")
#sendNotifTrajetPassagers(1, 2, "le trajet a été modifié")
#sendNotifAmi(1, 2, 1, "Vous avez été ajouté au groupe !")
#sendNotifDeleteTrajet(1, 1)
#sendNotifCompte(1, 2, "j'ai un message")