URI_DATABASE = '../database.db'

from flask import Blueprint, jsonify, request, render_template
from datetime import datetime, timedelta
import sqlite3
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from backend.notifManager import *

trajet_bp = Blueprint('trajet', __name__)


@trajet_bp.route('/modifier_trajet', methods=['POST', 'GET'])
def modifier_trajet():
    return render_template('editTrajet/editTrajet.html')


@trajet_bp.route('/participants',methods=['POST', 'GET'])
def participants():
    return render_template('participants/participants.html')


@trajet_bp.route('/mes_trajets')
def mes_trajets():
    return render_template('mes_trajets/mes_trajets.html')


@trajet_bp.route('/mes_trajets_crees')
def mes_trajets_crees():
    return render_template('mes_trajets/mes_trajets_crees.html')


@trajet_bp.route('/creer_trajet')
def creer_trajet():
    return render_template('mes_trajets/creer_trajet.html')


@trajet_bp.route('/')
def trajet():
    return render_template('trajet/trajet.html')


@trajet_bp.route('/historique_trajets')
def historique():
    return "<h1>Historique des trajets non-implémenté (sprint 4)</h1><br><a href='/'>Retour à l'accueil</a>"


#Voir un trajet
@trajet_bp.route('/trajet/<int:idTrajet>', methods=['POST'])
def getTrajet(idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT * FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
    trajet = c.fetchone()

    if not trajet:
        conn.close()
        return jsonify({'message': 'Trajet non trouvé'}), 404

    else:

        # Récupération des noms de colonnes
        col_names = [desc[0] for desc in c.description]

        # Création d'un dictionnaire contenant les données du trajet
        trajet = {col_names[i]: trajet[i] for i in range(len(col_names))}

        # Conversion de la date de la colonne 'dateDepart'
        dateTrajet = datetime.strptime(trajet['dateDepart'], '%Y%m%d').strftime('%d %B, %Y')
        trajet['dateDepart'] = dateTrajet

        # Conversion de l'idVille en nomVille
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeDepart'],))
        trajet['villeDepart'] = c.fetchone()[0]
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeArrivee'],))
        trajet['villeArrivee'] = c.fetchone()[0]

        # Ajouter le type de trajet en fonction de la table dans laquelle se trouve l'idTrajet
        if idTrajet in [id[0] for id in c.execute("SELECT idTrajet FROM TRAJET_PRIVE")]:
            trajet['typeTrajet'] = 'prive'
            #On recupere le nom du groupe
            trajet['nomGroupe'] = [groupe[0] for groupe in c.execute("SELECT nomGroupe FROM TRAJET_PRIVE NATURAL JOIN GROUPE WHERE idTrajet=?", (idTrajet,))][0]
        elif idTrajet in [id[0] for id in c.execute("SELECT idTrajet FROM TRAJET_PUBLIC")]:
            trajet['typeTrajet'] = 'public'
        else:
            trajet['typeTrajet'] = None

        conn.close()

        return jsonify(trajet)




#Rechercher un trajet
@trajet_bp.route('/recherche/<string:token>', methods=['POST'])
def rechercher(token):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    #On recupere l'id de l'utilisateur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 404

    idCompte = compte[0]

    # Récupérer les données envoyées dans la requête
    data = request.get_json()
    villeDepart = data.get('city-start')
    villeArrivee = data.get('city-end')
    date = data.get('date')
    nbPlaces = data.get('places')
    prixMin = data.get('lower-prices')
    prixMax = data.get('higher-prices')
    
    query = "SELECT * FROM TRAJET WHERE 1=1"

    params = []  # Initialisation de la liste des paramètres de la requête

    if villeDepart:
        #On recupere l'id de la ville
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeDepart,))
        ville = c.fetchone()
        if not ville:
            #Il y a un pbm, la ville n'existe pas
            conn.close()
            return jsonify({'message': 'La ville n\'existe pas'}), 404
        else:
            idVille = ville[0]
            query += " AND villeDepart = ?"
            params.append(idVille)
            print("VilleDepart = ", idVille)

    if villeArrivee:
        #On recupere l'id de la ville
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeArrivee,))
        ville = c.fetchone()
        if not ville:
            #Il y a un pbm, la ville n'existe pas
            conn.close()
            return jsonify({'message': 'La ville n\'existe pas'}), 404
        else:
            idVille = ville[0]
            query += " AND villeArrivee = ?"
            params.append(idVille)
            print("VilleArrivee = ", idVille)

    if date:
        #On reformate la date sous la forme YYYYMMDD
        date_obj = datetime.strptime(date, '%d %B, %Y')
        date = date_obj.strftime('%Y%m%d')
        query += " AND dateDepart = ?"
        params.append(date)

    if nbPlaces:
        query += " AND nbPlaces = ?"
        params.append(nbPlaces)

    if prixMin:
        query += " AND prix >= ?"
        params.append(prixMin)

    if prixMax:
        query += " AND prix <= ?"
        params.append(prixMax)

    # Exécution de la requête avec les paramètres
    c.execute(query, params)

    # Récupération des résultats
    results = c.fetchall()

    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Création d'une liste de dictionnaires contenant les données
    trajets = []
    for row in results:
        trajet = {col_names[i]: row[i] for i in range(len(col_names))}

        # Conversion de la date de la colonne 'dateDepart'
        dateTrajet = datetime.strptime(trajet['dateDepart'], '%Y%m%d').strftime('%d %B, %Y')
        trajet['dateDepart'] = dateTrajet
        trajets.append(trajet)

        # Conversion de l'idVille en nomVille
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeDepart'],))
        trajet['villeDepart'] = c.fetchone()[0]
        c.execute("SELECT nomVille FROM VILLE WHERE idVille = ?", (trajet['villeArrivee'],))
        trajet['villeArrivee'] = c.fetchone()[0]

        # Ajouter le type de trajet en fonction de la table dans laquelle se trouve l'idTrajet
        if row[0] in [id[0] for id in c.execute("SELECT idTrajet FROM TRAJET_PRIVE")]:
            trajet['typeTrajet'] = 'prive'
            #On recupere le nom du groupe
            trajet['nomGroupe'] = [groupe[0] for groupe in c.execute("SELECT nomGroupe FROM TRAJET_PRIVE NATURAL JOIN GROUPE WHERE idTrajet=?", (row[0],))][0]

            #On vérifie que l'utilisateur fasse parti des membres
            c.execute("SELECT * FROM GROUPE INNER JOIN AMI_GROUPE ON GROUPE.idGroupe = AMI_GROUPE.idGroupe WHERE (GROUPE.idCreateur = ? OR AMI_GROUPE.idCompte = ?) AND GROUPE.nomGroupe = ?", (idCompte, idCompte, trajet['nomGroupe']))
            inGroupe = c.fetchone()
            if not inGroupe:
                trajets.pop() #On enleve le trajet de la liste

        elif row[0] in [id[0] for id in c.execute("SELECT idTrajet FROM TRAJET_PUBLIC")]:
            trajet['typeTrajet'] = 'public'
        else:
            trajet['typeTrajet'] = None



    conn.close()
    return jsonify(trajets)



#Voir la liste des trajets d'un compte avec son token
@trajet_bp.route('/trajetsCompte/<string:token>', methods=['GET'])
def trajetsCompte(token):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()

    if compte:
        #On peut chercher tous ses trajets
        idCompte = compte[0]

        query = """
            SELECT DISTINCT TRAJET.*
            FROM TRAJET
            LEFT JOIN TRAJET_EN_COURS_PASSAGER ON TRAJET.idTrajet = TRAJET_EN_COURS_PASSAGER.idTrajet
            WHERE (TRAJET_EN_COURS_PASSAGER.idCompte = ? OR TRAJET.idConducteur = ?) AND TRAJET.statusTrajet!='termine'
        """

        c.execute(query, (idCompte, idCompte))
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

            # Ajouter le type de trajet en fonction de la table dans laquelle se trouve l'idTrajet
            if row[0] in [id[0] for id in c.execute("SELECT idTrajet FROM TRAJET_PRIVE")]:
                trajet['typeTrajet'] = 'prive'
                #On recupere le nom du groupe
                trajet['nomGroupe'] = [groupe[0] for groupe in c.execute("SELECT nomGroupe FROM TRAJET_PRIVE NATURAL JOIN GROUPE WHERE idTrajet=?", (row[0],))][0]
            elif row[0] in [id[0] for id in c.execute("SELECT idTrajet FROM TRAJET_PUBLIC")]:
                trajet['typeTrajet'] = 'public'
            else:
                trajet['typeTrajet'] = None

            trajets.append(trajet)

        conn.commit()
        conn.close()

        # Retour de la réponse avec code 200
        return jsonify(trajets), 200
    else:
        # Retour de la réponse avec code 401 et un message d'erreur
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401




@trajet_bp.route('/createTrajet/<string:token>', methods=['POST', 'GET'])
def createTrajet(token):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()

    data = request.get_json()
    heureDepart = data.get('heureDepart')
    dateDepart = data.get('dateDepart')
    nbPlaces = data.get('nbPlaces')
    prix = data.get('prix')
    commentaires = data.get('commentaires')
    precisionRdv = data.get('precisionRdv')
    villeDepart = data.get('villeDepart')
    villeArrivee = data.get('villeArrivee')
    typeTrajet = data.get('typeTrajet')

    if not heureDepart or not dateDepart or not nbPlaces or not prix or not villeDepart or not villeArrivee:
        conn.close()
        return jsonify({'message': 'Il manque une ou plusieurs infos'}), 401
        

    #On reformate la date
    dateDepart = datetime.strptime(dateDepart, '%d %B, %Y').strftime('%Y%m%d')

    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On recupere les id des villes
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeDepart,))
        ville = c.fetchone()
        if not ville:
            conn.close()
            return jsonify({'message': 'VilleDepart inexistante'}), 404
        else:
            villeDepart = ville[0]
        c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeArrivee,))
        ville = c.fetchone()
        if not ville:
            conn.close()
            return jsonify({'message': 'VilleArrivee inexistante'}), 404
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

            #On vérifie si le trajet est prive
            if typeTrajet:
                #On recupere l'id de ce trajet (donc le plus grand) puis insertion dans la table
                sql = "SELECT MAX(idTrajet) FROM TRAJET"
                idTrajet = c.execute(sql).fetchone()[0]

                if typeTrajet == 'Prive':
                    print("test")
                    idGroupe = data.get('idGroupe')
                    c.execute("INSERT INTO TRAJET_PRIVE VALUES (?, ?)", (idTrajet, idGroupe))
                    conn.commit()
                    

                    #On envoie une notif au groupe
                    sendNotifGroupe(idCompte, idGroupe, "Un nouveau trajet privé est disponible pour le groupe !")

                else:
                    c.execute("INSERT INTO TRAJET_PUBLIC VALUES (?)", (idTrajet,))

                    #On envoie une notif si on trouve une recherche en attente correspondant au critères
                    #....................

            
            conn.commit()
            conn.close()
            return jsonify({'message': 'Le trajet a bien été créé.'}), 200
        else:
            conn.close()
            return jsonify({'message': 'Probleme au niveau de la requête'}), 401



@trajet_bp.route('/deleteTrajet/<string:token>/<int:idTrajet>', methods=['GET'])
def deleteTrajet(token, idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On vérifie que le client est bien conducteur du trajet et que le trajet existe
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        conducteur = c.fetchone()
        if not conducteur:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            idConducteur = conducteur[0]
            if idCompte != idConducteur:
                conn.close()
                return jsonify({'message': 'Suppression non autorisée : vous n\'êtes pas conducteur de ce trajet'}), 403
            else:
                #On envoie une notification aux passagers
                sendNotifDeleteTrajet(idCompte, idTrajet)
                #sendNotifTrajetPassagers(idCompte, idTrajet, "Le trajet a été annulé")

                c.execute("DELETE FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
                conn.commit()
                conn.close()

                return jsonify({'message': 'Le trajet a bien été supprimé.'}), 200



@trajet_bp.route('/demandeTrajet/<string:token>/<int:idTrajet>/<int:nbPlaces>', methods=['POST'])
def demandeTrajet(token, idTrajet, nbPlaces):
    commentaire = request.get_json().get('commentaire')

    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On verifie que le compte ne participe pas deja au trajet ou n'a pas deja une demande en cours
        c.execute("SELECT * FROM TRAJET_EN_COURS_PASSAGER NATURAL JOIN TRAJET WHERE TRAJET_EN_COURS_PASSAGER.idCompte = ? OR TRAJET.idConducteur = ?", (idCompte, idCompte))
        particpe = c.fetchone()
        c.execute("SELECT * FROM DEMANDE_TRAJET_EN_COURS WHERE idCompte = ? AND idTrajet = ?", (idCompte,idTrajet))
        demande = c.fetchone()
        if particpe or demande:
            conn.close()
            return jsonify({'message': 'Requête refusée : vous êtes déjà un participant du trajet ou avez une demande en cours'}), 403
        else:
            #On verifie le nombre de places restantes
            c.execute("SELECT nbPlacesRestantes FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
            nbPlacesRestantes = c.fetchone()[0]
            if nbPlaces > nbPlacesRestantes:
                conn.close()
                return jsonify({'message': 'Requête refusée : le nombre de places demandées est supérieure au nb disponible'}), 403
            else:
                #On vérifie s'il y a un commentaire
                if not commentaire:
                    c.execute("INSERT INTO DEMANDE_TRAJET_EN_COURS VALUES (?, ?, ?, ?)", (idCompte, idTrajet, nbPlaces, 'en cours'))
                else:
                    c.execute("INSERT INTO DEMANDE_TRAJET_EN_COURS VALUES (?, ?, ?, ?, ?)", (idCompte, idTrajet, nbPlaces, 'en cours', commentaire))

                #On recupere l'id du conducteur pour la suite
                c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
                idConducteur = c.fetchone()[0]

                conn.commit()
                conn.close()

                #On envoie une notif au conducteur
                sendNotifTrajet(idCompte, idConducteur, idTrajet, "Cet utilisateur souhaite participer à l'un de vos trajet")

                return jsonify({'message': 'La demande a bien été prise en compte.'}), 200



@trajet_bp.route('/quitterTrajet/<string:token>/<int:idTrajet>', methods=['GET'])
def quitterTrajet(token, idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On vérifie que l'utilisateur n'est pas le conducteur du trajet
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        trajet = c.fetchone()
        if not trajet:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            idConducteur = trajet[0]
            if idCompte == idConducteur:
                conn.close()
                return jsonify({'message': 'Requête refusée : vous ne pouvez pas quitter un trajet si vous êtes le conducteur'}), 403
            else:
                #On test si l'utilisateur est bien passager du trajet
                c.execute("SELECT * FROM TRAJET_EN_COURS_PASSAGER WHERE idTrajet = ?", (idTrajet,))
                if not c.fetchone():
                    conn.close()
                    return jsonify({'message': 'Requête refusée : vous ne pouvez pas quitter un trajet si vous n\'y participez pas'}), 403
                else:
                    #On peut quitter le trajet
                    c.execute("DELETE FROM TRAJET_EN_COURS_PASSAGER WHERE idTrajet = ? AND idCompte = ?", (idTrajet, idCompte))
                    conn.commit()
                    conn.close()

                    #On envoie une notif au conducteur
                    sendNotifTrajet(idCompte, idConducteur, idTrajet, "Cet utilisateur vient de quitter le trajet")
                    
                    return jsonify({'message': 'La demande d\'annulation de participation a bien été prise en compte.'}), 200



@trajet_bp.route('/conducteur/<int:idTrajet>', methods=['POST'])
def getConducteur(idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On vérifie que le trajet existe
    c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
    trajet = c.fetchone()
    if not trajet:
        conn.close()
        return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
    else:
        idConducteur = trajet[0]
        #On recupere les infos du conducteur
        c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", (idConducteur,))
        compte = c.fetchone()
        #On verifie que le compte existe bien
        if not compte:
            conn.close()
            return jsonify({'message': 'Cet utilisateur n\'existe pas'}), 404
        else:
            #On recupere les noms de colonnes
            col_names = [desc[0] for desc in c.description]
            compte = {col_names[i]: compte[i] for i in range(len(col_names))}
            conn.close()
            return jsonify(compte), 200



@trajet_bp.route('/acceptInTrajet/<string:token>/<int:idCompte>/<int:idTrajet>/<int:nbPlaces>/<string:accept>', methods=['GET'])
def acceptInTrajet(token, idCompte, idTrajet, nbPlaces, accept):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idConducteur = compte[0]
        #On vérifie que le compte et le trajet existent bien
        c.execute("SELECT * FROM COMPTE WHERE idCompte = ?", (idCompte,))
        if not c.fetchone():
            conn.close()
            return jsonify({'message': 'Ce compte n\'existe pas'}), 404
        c.execute("SELECT * FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        if not c.fetchone():
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        
        #On verifie si on accepte ou pas la demande
        if accept == 'oui':
            #On accepte : on insere dans TRAJET_EN_COURS_PASSAGER et on supprime la demande
            c.execute("INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES (?, ?, ?)", (idCompte, idTrajet, nbPlaces))
            c.execute("DELETE FROM DEMANDE_TRAJET_EN_COURS WHERE idCompte = ? AND idTrajet = ?", (idCompte, idTrajet))
            conn.commit()
            conn.close()

            #On envoie une notif au participant
            sendNotifTrajet(idConducteur, idCompte, idTrajet, "Le conducteur vous a accepté dans son trajet !")

            return jsonify({'message': 'La demande a bien été acceptée.'}), 200
        elif accept == 'non':
            #On n'accepte pas : on supprime la demande
            c.execute("DELETE FROM DEMANDE_TRAJET_EN_COURS WHERE idCompte = ? AND idTrajet = ?", (idCompte, idTrajet))
            conn.commit()
            conn.close()

            #On envoie une notif au participant
            sendNotifTrajet(idConducteur, idCompte, idTrajet, "Le conducteur n'a pas accepté votre demande de participation.")
            return jsonify({'message': 'La demande a bien été refusée.'}), 200
        else:
            conn.close()
            return jsonify({'message': 'accept doit être à oui ou non.'}), 403




@trajet_bp.route('/modifTrajet/<string:token>/<int:idTrajet>', methods=['POST'])
def modifTrajet(token, idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On verifie que l'utilisateur est bien le conducteur du trajet et que le trajet existe
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        trajet = c.fetchone()
        if not trajet:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            idConducteur = trajet[0]
            if not idCompte == idConducteur:
                conn.close()
                return jsonify({'message': 'Vous ne pouvez modifier le trajet que si vous êtes conducteur'}), 403
            else:
                #On peut modifier le trajet
                data = request.get_json()
                heureDepart = data.get('heureDepart')
                dateDepart = data.get('dateDepart')
                nbPlaces = data.get('nbPlaces')
                prix = data.get('prix')
                commentaires = data.get('commentaires')
                precisionRdv = data.get('precisionRdv')
                villeDepart = data.get('villeDepart')
                villeArrivee = data.get('villeArrivee')

                #On verifie qu'il ne manque pas de donnees
                if not heureDepart or not dateDepart or not nbPlaces or not prix or not villeDepart or not villeArrivee:
                    conn.close()
                    return jsonify({'message': 'Il manque une ou plusieurs informations'}), 401
                else:
                    #On recupere les id des villes
                    c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeDepart,))
                    ville = c.fetchone()
                    if not ville:
                        conn.close()
                        return jsonify({'message': 'VilleDepart inexistante'}), 404
                    else:
                        villeDepart = ville[0]
                    c.execute("SELECT idVille FROM VILLE WHERE nomVille = ?", (villeArrivee,))
                    ville = c.fetchone()
                    if not ville:
                        conn.close()
                        return jsonify({'message': 'VilleArrivee inexistante'}), 404
                    else:
                        villeArrivee = ville[0]

                    #On reformate la date
                    dateDepart = datetime.strptime(dateDepart, '%d %B, %Y').strftime('%Y%m%d')


                    query = None
                    values = ()
                    if not commentaires:
                        if not precisionRdv:
                            query = "UPDATE TRAJET SET heureDepart = ?, dateDepart = ?, nbPlaces = ?, prix = ?, villeDepart = ?, villeArrivee = ? WHERE idTrajet = ?"
                            values = (heureDepart, dateDepart, nbPlaces, prix, villeDepart, villeArrivee, idTrajet)
                        else:
                            query = "UPDATE TRAJET SET heureDepart = ?, dateDepart = ?, nbPlaces = ?, prix = ?, villeDepart = ?, villeArrivee = ?, precisionRdv = ? WHERE idTrajet = ?"
                            values = (heureDepart, dateDepart, nbPlaces, prix, villeDepart, villeArrivee, precisionRdv, idTrajet)
                    else:
                        if not precisionRdv:
                            query = "UPDATE TRAJET SET heureDepart = ?, dateDepart = ?, nbPlaces = ?, prix = ?, villeDepart = ?, villeArrivee = ?, commentaires = ? WHERE idTrajet = ?"
                            values = (heureDepart, dateDepart, nbPlaces, prix, villeDepart, villeArrivee, commentaires, idTrajet)
                        else:
                            query = "UPDATE TRAJET SET heureDepart = ?, dateDepart = ?, nbPlaces = ?, prix = ?, villeDepart = ?, villeArrivee = ?, commentaires = ?, precisionRdv = ? WHERE idTrajet = ?"
                            values = (heureDepart, dateDepart, nbPlaces, prix, villeDepart, villeArrivee, commentaires, precisionRdv, idTrajet)
                    if query:
                        c.execute(query, values)
                        conn.commit()
                        conn.close()

                        #On envoie une notif à tous les passagers
                        sendNotifTrajetPassagers(idConducteur, idTrajet, "Le trajet a été modifié")

                        return jsonify({'message': 'Le trajet a bien été modifié.'}), 200
                    else:
                        conn.close()
                        return jsonify({'message': 'Probleme au niveau de la requête'}), 401





#Recuperer toutes les demandes en cours pour un trajets
@trajet_bp.route('/getDemandesTrajet/<string:token>/<int:idTrajet>', methods = ['GET'])
def getDemandesTrajet(token, idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On verifie que l'utilisateur est bien le conducteur du trajet et que le trajet existe
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        trajet = c.fetchone()
        if not trajet:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            idConducteur = trajet[0]
            if not idCompte == idConducteur:
                conn.close()
                return jsonify({'message': 'Vous ne pouvez acceder aux demandes que si vous êtes conducteur'}), 403
            else:
                c.execute("SELECT idCompte, nbPlaces, commentaire, nomCompte, prenomCompte, noteCompte FROM DEMANDE_TRAJET_EN_COURS NATURAL JOIN COMPTE WHERE idTrajet = ?", (idTrajet,))
                rows = c.fetchall()
                if not rows:
                    conn.close()
                    return jsonify({'message': 'Aucune demande en cours'}), 204
                else:
                    conn.close()
                    # Récupération des noms de colonnes
                    col_names = [desc[0] for desc in c.description]

                    # Conversion de la date dans chaque ligne de résultat
                    demandes = []
                    for row in rows:
                        demande = {col_names[i]: row[i] for i in range(len(col_names))}
                        demandes.append(demande)
                    return jsonify(demandes), 200






# Valider une fin de trajet
@trajet_bp.route('/terminerTrajet/<string:token>/<int:idTrajet>', methods = ['POST'])
def terminerTrajet(token, idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On verifie que l'utilisateur est bien le conducteur du trajet et que le trajet existe
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        trajet = c.fetchone()
        if not trajet:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            idConducteur = trajet[0]
            if not idCompte == idConducteur:
                conn.close()
                return jsonify({'message': 'Vous ne pouvez valider un trajet que si vous êtes conducteur'}), 403
            else:
                #On envoie une notif aux passagers
                sendNotifTrajetPassagers(idConducteur, idTrajet, "Le trajet a été marqué comme terminé")

                c.execute("UPDATE TRAJET SET statusTrajet = 'termine' WHERE idTrajet = ?", (idTrajet,))
                conn.commit()
                conn.close()
                return jsonify({'message': 'Le trajet a bien été terminé.'}), 200




#Recuperer tous les passagers d'un trajet 
@trajet_bp.route('/getPassagers/<string:token>/<int:idTrajet>', methods = ['GET'])
def getPassagers(token, idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On verifie que l'utilisateur est bien le conducteur du trajet et que le trajet existe
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        trajet = c.fetchone()
        if not trajet:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            idConducteur = trajet[0]
            if not idCompte == idConducteur:
                conn.close()
                return jsonify({'message': 'Vous ne pouvez acceder aux participants que si vous êtes conducteur'}), 403
            else:
                c.execute("SELECT idCompte, nbPlaces, nomCompte, prenomCompte, noteCompte FROM TRAJET_EN_COURS_PASSAGER NATURAL JOIN COMPTE WHERE idTrajet = ?", (idTrajet,))
                rows = c.fetchall()
                if not rows:
                    conn.close()
                    return jsonify({'message': 'Aucun passager pour le moment'}), 204
                else:
                    conn.close()
                    # Récupération des noms de colonnes
                    col_names = [desc[0] for desc in c.description]

                    # Conversion de la date dans chaque ligne de résultat
                    participants = []
                    for row in rows:
                        participant = {col_names[i]: row[i] for i in range(len(col_names))}
                        participants.append(participant)
                    return jsonify(participants), 200



@trajet_bp.route('/deletePassager/<string:token>/<int:idComptePassager>/<int:idTrajet>', methods = ['GET'])
def deletePassager(token, idComptePassager, idTrajet):
    conn = sqlite3.connect(URI_DATABASE)
    c = conn.cursor()
    #On recupere l'id du conducteur
    c.execute("SELECT idCompte FROM TOKEN WHERE auth_token = ?", (token,))
    compte = c.fetchone()
    if not compte:
        conn.close()
        return jsonify({'message': 'Token invalide ou expiré'}), 401
    else:
        idCompte = compte[0]
        #On verifie que l'utilisateur est bien le conducteur du trajet et que le trajet existe
        c.execute("SELECT idConducteur FROM TRAJET WHERE idTrajet = ?", (idTrajet,))
        trajet = c.fetchone()
        if not trajet:
            conn.close()
            return jsonify({'message': 'Ce trajet n\'existe pas'}), 404
        else:
            idConducteur = trajet[0]
            if not idCompte == idConducteur:
                conn.close()
                return jsonify({'message': 'Vous ne pouvez supprimer un passager que si vous êtes conducteur'}), 403
            else:
                #On verifie que le passager participe bien au trajet
                c.execute("SELECT * FROM TRAJET_EN_COURS_PASSAGER WHERE idCompte = ? AND idTrajet = ?", (idComptePassager, idTrajet))
                passager = c.fetchone()
                if not passager:
                    conn.close()
                    return jsonify({'message': 'Cet utilisateur ne participe pas au trajet'}), 404
                else:
                    #On envoie une notif au passager
                    sendNotifTrajet(idConducteur, idComptePassager, idTrajet, "Vous avez été supprimé du trajet")

                    #On peut supprimer la participation
                    c.execute("DELETE FROM TRAJET_EN_COURS_PASSAGER WHERE idCompte = ?", (idComptePassager,))
                    conn.commit()
                    conn.close()
                    return jsonify({'message': 'Le passager a bien été supprimé du trajet'}), 200







# Valider une fin de trajet automatiquement
def valider_automatiquement_trajet():
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()

    c.execute("SELECT * FROM TRAJET WHERE statusTrajet != 'termine'")
    
    rows = c.fetchall()

    conn.commit()
    conn.close()

    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Conversion de la date dans chaque ligne de résultat
    trajets = []
    for row in rows:
        conn = sqlite3.connect('../database.db')
        c = conn.cursor()
        trajet = {col_names[i]: row[i] for i in range(len(col_names))}

        # Conversion de la date de la colonne 'dateDepart'
        dateTrajet = datetime.strptime(trajet['dateDepart'], '%Y%m%d').strftime('%d %B, %Y')
        dateTrajet = datetime.strptime(dateTrajet, '%d %B, %Y')
        print("Vérification des trajets en cours")
        if dateTrajet <= datetime.now() - timedelta(hours=24):
            c.execute("UPDATE TRAJET SET statusTrajet = 'termine' WHERE idTrajet = ?", (trajet['idTrajet'],))
            print("Suppression du trajet numéro " + str(trajet['idTrajet']))
            conn.commit()
        conn.close()

# Lancement du scheduler
scheduler = BackgroundScheduler()

# Ajout d'une tâche
scheduler.add_job(func=valider_automatiquement_trajet, trigger="interval", minutes=60)

# Démarrage du scheduler
scheduler.start()

# Eteint le scheduler quand on quitte l'application
atexit.register(lambda: scheduler.shutdown())