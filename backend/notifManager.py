URI_DATABASE = '../database.db'
import sqlite3


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

    # On insère dans NOTIFICATION
    c.execute("INSERT INTO NOTIFICATION(idCompteEnvoyeur, messageNotification) VALUES (?, ?)", (idCompteEnv, message))
    conn.commit()  # Obligatoire pour les clés étrangères

    # On recupere l'id de cette notification
    c.execute("SELECT last_insert_rowid() FROM NOTIFICATION")
    idNotif = c.fetchone()[0]

    c.execute("INSERT INTO NOTIF_TRAJET VALUES (?, ?)", (idNotif, idTrajet))

    # On insère dans NOTIF_TRAJET pour chaque passager
    c.execute("SELECT idCompte FROM TRAJET_EN_COURS_PASSAGER WHERE idTrajet=?", (idTrajet,))
    passagers = c.fetchall()
    for p in passagers:
        # On insère dans NOTIF_RECUE
        c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (p[0], idNotif))

    conn.commit()
    conn.close()




def sendNotifGroupe(idCompteEnv, idGroupe, message):
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

    # On insère dans NOTIF_GROUPE pour chaque membre du groupe
    c.execute("SELECT idCompte FROM AMI_GROUPE WHERE idGroupe=?", (idGroupe,))
    membres = c.fetchall()
    for m in membres:
        # On insère dans NOTIF_RECUE
        c.execute("INSERT INTO NOTIF_RECUE VALUES (?, ?)", (m[0], idNotif))

    conn.commit()
    conn.close()





#sendNotifTrajet(1, 2, 1, "message pour le trajet ...")
#sendNotifGroupe(1, 1, "message pour le groupe !")
#sendNotifTrajetPassagers(1, 2, "le trajet a été modifié")
