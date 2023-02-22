BEGIN;

DROP TABLE IF EXISTS COMPTE;
DROP TABLE IF EXISTS TOKEN;
DROP TABLE IF EXISTS PASSAGER;
DROP TABLE IF EXISTS CONDUCTEUR;
DROP TABLE IF EXISTS VILLE;
DROP TABLE IF EXISTS TRAJET;
DROP TABLE IF EXISTS TRAJET_EN_COURS_PASSAGER;
DROP TABLE IF EXISTS DEMANDE_TRAJET_EN_COURS;
DROP TABLE IF EXISTS HISTORIQUE_TRAJET;
DROP TABLE IF EXISTS TRAJET_PUBLIC;
DROP TABLE IF EXISTS GROUPE;
DROP TABLE IF EXISTS AMI_GROUPE;
DROP TABLE IF EXISTS TRAJET_PRIVE;
DROP TABLE IF EXISTS VILLE_TRAVERSEE;
DROP TABLE IF EXISTS RECHERCHE_EN_ATTENTE;
DROP TABLE IF EXISTS NOTE;
DROP TABLE IF EXISTS NOTIFICATION;
DROP TABLE IF EXISTS NOTIF_TRAJET;
DROP TABLE IF EXISTS NOTIF_GROUPE;
DROP TABLE IF EXISTS NOTIF_RECUE;

DROP TRIGGER IF EXISTS TRIGGER_PASSAGER;
DROP TRIGGER IF EXISTS TRIGGER_CONDUCTEUR;
DROP TRIGGER IF EXISTS TRIGGER_TYPE_COMPTE;


CREATE TABLE IF NOT EXISTS COMPTE(
	idCompte INTEGER PRIMARY KEY AUTOINCREMENT,
	nomCompte TEXT NOT NULL,
	prenomCompte TEXT NOT NULL,
	email TEXT NOT NULL,
	genre TEXT NOT NULL,
	voiture INTEGER NOT NULL,
	telephone INTEGER NOT NULL,
	mdp TEXT NOT NULL,
	notificationMail INTEGER NOT NULL,
	typeCompte TEXT NOT NULL,
	noteCompte INTEGER NULL
);


CREATE TABLE IF NOT EXISTS TOKEN(
    idCompte INTEGER,
    auth_token BLOB NOT NULL,
    expiration TEXT NOT NULL,
    FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte)
);


CREATE TABLE IF NOT EXISTS PASSAGER(
	idCompte INTEGER,
	FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte)
);


CREATE TABLE IF NOT EXISTS CONDUCTEUR(
	idCompte INTEGER,
	FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte)
);

CREATE TRIGGER IF NOT EXISTS TRIGGER_TYPE_COMPTE BEFORE INSERT ON COMPTE
WHEN NEW.typeCompte != 'client' AND NEW.typeCompte != 'admin'
BEGIN
	/*print error*/
	SELECT RAISE(FAIL, 'erreur : le type du compte ne peut pas etre different de client ou admin');
END;

CREATE TRIGGER IF NOT EXISTS TRIGGER_PASSAGER AFTER INSERT ON COMPTE
WHEN NEW.typeCompte == 'client'
BEGIN
	INSERT INTO PASSAGER VALUES(NEW.idCompte);
END;

CREATE TRIGGER IF NOT EXISTS TRIGGER_CONDUCTEUR AFTER INSERT ON COMPTE
WHEN NEW.voiture = 1 AND NEW.typeCompte == 'client'
BEGIN
	INSERT INTO CONDUCTEUR VALUES(NEW.idCompte);
END;


CREATE TABLE IF NOT EXISTS VILLE(
	idVille INTEGER PRIMARY KEY AUTOINCREMENT,
	nomVille TEXT NOT NULL,
	codePostal TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS TRAJET(
idTrajet INTEGER PRIMARY KEY AUTOINCREMENT,
idConducteur INTEGER,
heureDepart TEXT NOT NULL,
dateDepart TEXT NOT NULL,
nbPlaces INTEGER NOT NULL,
prix INTEGER NOT NULL,
nbPlacesRestantes INTEGER NOT NULL,
statusTrajet TEXT NOT NULL,
commentaires TEXT NULL,
precisionRdv TEXT NULL,
villeDepart INTEGER,
villeArrivee INTEGER,
FOREIGN KEY(idConducteur) REFERENCES COMPTE(idCompte),
FOREIGN KEY(villeDepart) REFERENCES VILLE(idVille),
FOREIGN KEY(villeArrivee) REFERENCES VILLE(idVille)
);

CREATE TRIGGER IF NOT EXISTS TRIGGER_IS_CONDUCTEUR BEFORE INSERT ON TRAJET
BEGIN
	SELECT
      CASE
		WHEN (SELECT idCompte FROM CONDUCTEUR WHERE idCompte= NEW.idConducteur) ISNULL THEN
   	  		RAISE (ABORT, 'Erreur : Le conducteur ne possede pas de voiture')
       	END;
	
END;




CREATE TABLE IF NOT EXISTS TRAJET_EN_COURS_PASSAGER(
	idCompte INTEGER,
	idTrajet INTEGER,
	PRIMARY KEY(idCompte, idTrajet),
	FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte)
);

CREATE TABLE IF NOT EXISTS DEMANDE_TRAJET_EN_COURS(
	idCompte INTEGER,
	idTrajet INTEGER,
	status TEXT NOT NULL,
	PRIMARY KEY(idCompte, idTrajet),
	FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte),
	FOREIGN KEY(idTrajet) REFERENCES TRAJET(idTrajet)
);

CREATE TABLE IF NOT EXISTS HISTORIQUE_TRAJET(
	idCompte INTEGER,
	idTrajet INTEGER,
	PRIMARY KEY(idCompte, idTrajet),
	FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte),
	FOREIGN KEY(idTrajet) REFERENCES TRAJET(idTrajet)
);

CREATE TABLE IF NOT EXISTS TRAJET_PUBLIC(
	idTrajet INTEGER PRIMARY KEY,
	FOREIGN KEY(idTrajet) REFERENCES TRAJET(idTrajet)
);

CREATE TABLE IF NOT EXISTS GROUPE(
	idGroupe INTEGER PRIMARY KEY AUTOINCREMENT,
	nomGroupe TEXT NOT NULL,
	nbPersonnes INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS AMI_GROUPE(
	idCompte INTEGER,
	idGroupe INTEGER,
	PRIMARY KEY(idCompte, idGroupe),
	FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte),
	FOREIGN KEY(idGroupe) REFERENCES GROUPE(idGroupe)
);

CREATE TABLE IF NOT EXISTS TRAJET_PRIVE(
	idTrajet INTEGER PRIMARY KEY,
	idGroupe INTEGER,
	FOREIGN KEY(idTrajet) REFERENCES TRAJET(idTrajet),
	FOREIGN KEY(idGroupe) REFERENCES GROUPE(idGroupe)
);

CREATE TABLE IF NOT EXISTS VILLE_TRAVERSEE(
    idTrajet INTEGER,
    idVille INTEGER,
    PRIMARY KEY(idTrajet, idVille),
    FOREIGN KEY(idTrajet) REFERENCES TRAJET(idTrajet),
    FOREIGN KEY(idVille) REFERENCES VILLE(idVille)
);

CREATE TABLE IF NOT EXISTS RECHERCHE_EN_ATTENTE(
	idCompte INTEGER,
	nbPlaces INTEGER NULL,
	prix_max INTEGER NULL,
	villeDebut INTEGER,
	villeFin INTEGER,
	FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte),
	FOREIGN KEY(villeDebut) REFERENCES VILLE(idVille),
	FOREIGN KEY(villeFin) REFERENCES VILLE(idVille) 
);

CREATE TABLE IF NOT EXISTS NOTE(
	idNote INTEGER PRIMARY KEY AUTOINCREMENT,
	idTrajet INTEGER,
	idCompteNotant INTEGER,
	idCompteNote INTEGER,
	note INTEGER NULL,
	FOREIGN KEY(idNote) REFERENCES NOTE(idNote),
	FOREIGN KEY(idTrajet) REFERENCES TRAJET(idTrajet),
	FOREIGN KEY(idCompteNotant) REFERENCES COMPTE(idCompte),
	FOREIGN KEY(idCompteNote) REFERENCES COMPTE(idCompte)
);

CREATE TABLE IF NOT EXISTS NOTIFICATION(
	idNotification INTEGER PRIMARY KEY AUTOINCREMENT,
	idCompteEnvoyeur INTEGER,
    messageNotification TEXT NOT NULL,
    FOREIGN KEY(idCompteEnvoyeur) REFERENCES COMPTE(idCompte)
);

CREATE TABLE IF NOT EXISTS NOTIF_TRAJET(
	idNotification INTEGER PRIMARY KEY,
	idTrajet INTEGER,
	FOREIGN KEY(idNotification) REFERENCES NOTIFICATION(idNotification),
    FOREIGN KEY(idTrajet) REFERENCES TRAJET(idTrajet) 
);

CREATE TABLE IF NOT EXISTS NOTIF_GROUPE(
	idNotification INTEGER PRIMARY KEY,
	idGroupe INTEGER,
	FOREIGN KEY(idNotification) REFERENCES NOTIFICATION(idNotification),
	FOREIGN KEY(idGroupe) REFERENCES GROUPE(idGroupe) 
);

CREATE TABLE IF NOT EXISTS NOTIF_RECUE(
	idCompte INTEGER,
	idNotification INTEGER,
	PRIMARY KEY(idCompte, idNotification),
    FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte),
	FOREIGN KEY(idNotification) REFERENCES NOTIFICATION(idNotification) 
);


INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte, noteCompte)
    VALUES ('DURAND', 'Olivier', 'olivier@mail.com', 'homme', 1, 0606060606, 'mdpOlivier', 0, 'client', 4);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte, noteCompte)
    VALUES ('FRANCOIS', 'Marie', 'marie@mail.com', 'femme', 1, 0606060606, 'mdpMarie', 0, 'client', 5);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte)
    VALUES ('LEGRAND', 'Paul', 'paul@mail.com', 'homme', 0, 0606060606, 'mdpPaul', 1, 'client');
INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte, noteCompte)
    VALUES ('PIERRE', 'Harry', 'harry@mail.com', 'non genre', 1, 0606060606, 'mdpHarry', 1, 'client', 3);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail, typeCompte, noteCompte)
    VALUES ('DIDIER', 'Sophie', 'sophie@mail.com', 'femme', 0, 0606060606, 'mdpSophie', 1, 'client', 5);

INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
    VALUES (4, '10h30', '14/03/2023', 5, 7, 3, 'a pourvoir', 'Non fumeur', 'Devant le Leclerc', 30, 27);
INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
    VALUES (1, '14h00', '20/02/2023', 4, 5, 2, 'a pourvoir', NULL, NULL, 23, 41);
INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
    VALUES (1, '18h00', '15/02/2023', 4, 10, 2, 'en cours', NULL, NULL, 27, 35);
INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
   VALUES (4, '12h00', '01/01/2023', 5, 10, 3, 'termine', 'non fumeur', 'Devant le Leclerc', 30, 27);
INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
   VALUES (4, '14h00', '02/01/2023', 5, 10, 3, 'termine', 'non fumeur', 'A cote de l’Eglise', 27, 30);


INSERT INTO TRAJET_PUBLIC VALUES (1);
INSERT INTO TRAJET_PUBLIC VALUES (2);
INSERT INTO TRAJET_PUBLIC VALUES (4);
INSERT INTO TRAJET_PUBLIC VALUES (5);

INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(4, 3);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(5, 3);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(2, 2);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(3, 2);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(1, 1);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(5, 1);

INSERT INTO GROUPE(nomGroupe, nbPersonnes) VALUES ('Les Vosgiens', 3);

INSERT INTO AMI_GROUPE VALUES(2, 1);
INSERT INTO AMI_GROUPE VALUES(4, 1);
INSERT INTO AMI_GROUPE VALUES(5, 1);

INSERT INTO TRAJET_PRIVE VALUES (3, 1);

INSERT INTO HISTORIQUE_TRAJET VALUES(4, 4);
INSERT INTO HISTORIQUE_TRAJET VALUES(1, 4);
INSERT INTO HISTORIQUE_TRAJET VALUES(2, 4);
INSERT INTO HISTORIQUE_TRAJET VALUES(4, 5);
INSERT INTO HISTORIQUE_TRAJET VALUES(3, 5);
INSERT INTO HISTORIQUE_TRAJET VALUES(5, 5);

INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote) VALUES (4, 4, 1);
INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote) VALUES (4, 2, 4);
INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote) VALUES (5, 3, 5);
INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote) VALUES (5, 5, 4);

INSERT INTO VILLE(nomVille, codePostal) VALUES('Aix-en-Provence', 13100);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Ajaccio', 20000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Amiens', 80000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Angers', 49000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Annecy', 74000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Antibes', 06600);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Arles', 13200);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Arras', 62000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Avignon', 84000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Bayonne', 64100);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Beaune', 21200);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Besançon', 25000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Biarritz', 64200);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Bordeaux', 33000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Brest', 29200);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Caen', 14000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Cannes', 06400);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Chambéry', 73000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Clermont-Ferrand', 63000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Dijon', 21000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Grenoble', 38000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('La Rochelle', 17000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Lille', 59000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Limoges', 87000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Lyon', 69000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Marseille', 13000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Metz', 57000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Montpellier', 34000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Mulhouse', 68100);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Nancy', 54000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Nantes', 44000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Nice', 06000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Nîmes', 30000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Orléans', 45000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Paris', 75000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Pau', 64000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Perpignan', 66000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Poitiers', 86000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Reims', 51100); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Rennes', 35000);
INSERT INTO VILLE(nomVille, codePostal) VALUES('Rouen', 76000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Saint-Étienne', 42000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Saint-Malo', 35400); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Strasbourg', 67000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Toulon', 83000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Toulouse', 31000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Tours', 37000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Troyes', 10000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Valence', 26000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Vannes', 56000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Versailles', 78000); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Vichy', 03200); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Villefranche-sur-Saône', 69400); 
INSERT INTO VILLE(nomVille, codePostal) VALUES('Villeurbanne', 69100);

COMMIT;