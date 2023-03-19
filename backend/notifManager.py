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

    #On insère dans NOTIF_RECUE (grâce à un trigger)

    conn.commit()
    conn.close()





#sendNotifTrajet(1, 2, 1, "message pour le trajet ...")
#sendNotifGroupe(1, 1, "message pour le groupe !")
