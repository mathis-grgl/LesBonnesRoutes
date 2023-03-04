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
DROP TRIGGER IF EXISTS MAJ_NOTE_INSERT;
DROP TRIGGER IF EXISTS MAJ_NOTE_UPDATE;
DROP TRIGGER IF EXISTS TRIGGER_IS_CONDUCTEUR;
DROP TRIGGER IF EXISTS TRIGGER_NB_PLACES;
DROP TRIGGER IF EXISTS TRIGGER_NB_PLACES_RESTANTES_INCORRECT;
DROP TRIGGER IF EXISTS TRIGGER_TRAJET_COMPLET;
DROP TRIGGER IF EXISTS ADD_AMI_GROUPE;
DROP TRIGGER IF EXISTS REMOVE_AMI_GROUPE;


CREATE TABLE IF NOT EXISTS COMPTE(
	idCompte INTEGER PRIMARY KEY AUTOINCREMENT,
	nomCompte TEXT NOT NULL,
	prenomCompte TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	adresse TEXT NOT NULL,
	ville TEXT NOT NULL,
	codePostal TEXT NOT NULL,
	pays TEXT NOT NULL,
	genre TEXT NOT NULL,
	voiture INTEGER NOT NULL,
	telephone TEXT NOT NULL,
	mdp TEXT NOT NULL,
	notificationMail INTEGER NOT NULL,
	isAdmin INTEGER DEFAULT FALSE,
	noteCompte REAL NULL,
	photo TEXT NULL
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

CREATE TRIGGER IF NOT EXISTS TRIGGER_PASSAGER AFTER INSERT ON COMPTE
WHEN NEW.isAdmin == FALSE
BEGIN
	INSERT INTO PASSAGER VALUES(NEW.idCompte);
END;

CREATE TRIGGER IF NOT EXISTS TRIGGER_CONDUCTEUR AFTER INSERT ON COMPTE
WHEN NEW.voiture = 1 AND NEW.isAdmin == FALSE
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
		WHEN (SELECT idCompte FROM CONDUCTEUR WHERE idCompte = NEW.idConducteur) ISNULL THEN
   	  		RAISE (ABORT, 'Erreur : Le conducteur ne possede pas de voiture')
       	END;
	
END;

CREATE TRIGGER IF NOT EXISTS TRIGGER_NB_PLACES BEFORE INSERT ON TRAJET
WHEN NEW.nbPlaces < 1
BEGIN 
	SELECT RAISE(ABORT, 'Erreur : Le nombres de places ne peut pas etre < 1');
END;

CREATE TRIGGER IF NOT EXISTS TRIGGER_NB_PLACES_RESTANTES_INCORRECT BEFORE UPDATE ON TRAJET
WHEN NEW.nbPlacesRestantes < 0
BEGIN
	SELECT RAISE(ABORT, 'Erreur : Le nombres de places restantes ne peut pas etre < 0');
END;

CREATE TRIGGER IF NOT EXISTS TRIGGER_TRAJET_COMPLET AFTER UPDATE ON TRAJET
WHEN NEW.nbPlacesRestantes = 0
BEGIN
	UPDATE TRAJET SET statusTrajet = 'Complet' WHERE idTrajet = NEW.idTrajet;
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
	nomGroupe TEXT UNIQUE NOT NULL,
	nbPersonnes INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS AMI_GROUPE(
	idCompte INTEGER,
	idGroupe INTEGER,
	PRIMARY KEY(idCompte, idGroupe),
	FOREIGN KEY(idCompte) REFERENCES COMPTE(idCompte),
	FOREIGN KEY(idGroupe) REFERENCES GROUPE(idGroupe),
	UNIQUE(idCompte, idGroupe)
);

CREATE TRIGGER ADD_AMI_GROUPE AFTER INSERT ON AMI_GROUPE
BEGIN
	UPDATE GROUPE SET nbPersonnes = (SELECT COUNT(*) FROM AMI_GROUPE WHERE idGroupe = NEW.idGroupe)
		WHERE idGroupe = NEW.idGroupe;
END;

CREATE TRIGGER REMOVE_AMI_GROUPE AFTER DELETE ON AMI_GROUPE
BEGIN
	UPDATE GROUPE SET nbPersonnes = (SELECT COUNT(*) FROM AMI_GROUPE WHERE idGroupe = old.idGroupe)
		WHERE idGroupe = old.idGroupe;
END;



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
	FOREIGN KEY(idCompteNote) REFERENCES COMPTE(idCompte),
	CHECK(note >= 0 AND note <=5)
);

CREATE TRIGGER MAJ_NOTE_INSERT AFTER INSERT ON NOTE
BEGIN
	UPDATE COMPTE SET noteCompte = (SELECT AVG(note) FROM NOTE WHERE idCompteNote = NEW.idCompteNote)
	WHERE idCompte = NEW.idCompteNote;
END;

CREATE TRIGGER MAJ_NOTE_UPDATE AFTER UPDATE ON NOTE
BEGIN
	UPDATE COMPTE SET noteCompte = (SELECT AVG(note) FROM NOTE WHERE idCompteNote = NEW.idCompteNote)
	WHERE idCompte = NEW.idCompteNote;
END;

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

COMMIT;