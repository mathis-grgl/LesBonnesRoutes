BEGIN;

INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('DURAND', 'Olivier', 'olivier@mail.com', 'homme', 1, 0606060606, 'mdpOlivier', 0);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('FRANCOIS', 'Marie', 'marie@mail.com', 'femme', 1, 0606060606, 'mdpMarie', 0);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('LEGRAND', 'Paul', 'paul@mail.com', 'homme', 0, 0606060606, 'mdpPaul', 1);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('PIERRE', 'Harry', 'harry@mail.com', 'autre', 1, 0606060606, 'mdpHarry', 1);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('DIDIER', 'Sophie', 'sophie@mail.com', 'femme', 0, 0606060606, 'mdpSophie', 1);

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

UPDATE TRAJET SET nbPlacesRestantes = 0 WHERE idTrajet = 1; /* Test trajet complet */

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

INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote, note) VALUES (4, 4, 1, 4);
INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote, note) VALUES (4, 2, 4, 3);
INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote, note) VALUES (5, 3, 5, 5);
INSERT INTO NOTE(idTrajet, idCompteNotant, idCompteNote, note) VALUES (5, 5, 4, 1);

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