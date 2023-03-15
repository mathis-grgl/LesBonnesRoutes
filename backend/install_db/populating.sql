BEGIN;

INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('DURAND', 'Olivier', 'olivier@mail.com', '1 Rue Stanislas', 'NANCY', '54000', 'FRANCE', 'homme', 1, '0606060606', '615357e8aff9d46a43391e3699194287ab9658b01633a791355085cfed0e9013edb84055b0b6d05f49bcc3cc33a8bb8601d87ce8586f5aa06372bd8dd83439b4', 0);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('FRANCOIS', 'Marie', 'marie@mail.com', '12 Rue Saint-Dizier', 'NANCY', '54000', 'FRANCE', 'femme', 1, '0606060606', 'fd074d536f373fd8444a8a8e4732745f6d8b5d53988839976e98a2c8e43fd876cd11e0573beb700ce7c054e54be4485c6c29b9ff7179fb49bed3a5e584a80e30', 0);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('LEGRAND', 'Paul', 'paul@mail.com', '20 Rue des Carmes', 'NANCY', '54000', 'FRANCE', 'homme', 0, '0606060606', '8c47c604132d485ec6854ffc16e332e5c5cd935136fe31a36a097ea67339206705865c9c3c604cc93b723a42ef3ca4301ac15b61a7d9307e4ec1d5e8b18768f9', 1);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('PIERRE', 'Harry', 'harry@mail.com', '11 Rue des Tiercelins', 'NANCY', '54000', 'FRANCE', 'autre', 1, '0606060606', '9a48e3ea78f0d13121afa8ea8b3fbb1efd174b73551b432ffc609d289034e35e4fe7eaac7e4f966e398feae56d84580b3868c289f4a33990f2b27e6577552fec', 1);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('DIDIER', 'Sophie', 'sophie@mail.com', '8 Rue Gustave Simon', 'NANCY', '54000', 'FRANCE', 'femme', 0, '0606060606', 'e22092d3df283b27e15c44947df862c8b244433540dc5c58b0ea45da95602db94fc829d007369ae8708069a3d1c3a1cdebf803c5faa976435cf8309e2dafcaf4', 1);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail, isAdmin)
    VALUES ('ADMIN', 'Admin', 'admin@mail.com', 'admin', 'ADMIN', '54000', 'FRANCE', 'femme', 0, '0606060606', '10da32bb6cc3a0e32ca9a5855009a661970c92253f1ad899bb3d7e934e35d920e0c2999d60c666b9adbe2ad29a3a7ff916d494b76605e81adcd81c036f2ac610', 0, 1);

INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
    VALUES (4, '10h30', '20230414', 5, 7, 3, 'a pourvoir', 'Non fumeur', 'Devant le Leclerc', 30, 27);
INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
    VALUES (1, '14h00', '20230420', 4, 5, 2, 'a pourvoir', NULL, NULL, 23, 41);
INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
    VALUES (1, '18h00', '20230415', 4, 10, 2, 'en cours', NULL, NULL, 27, 35);
INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
   VALUES (4, '12h00', '20230401', 5, 10, 3, 'a pourvoir', 'non fumeur', 'Devant le Leclerc', 30, 27);
INSERT INTO TRAJET(idConducteur, heureDepart, dateDepart, nbPlaces, prix, nbPlacesRestantes, statusTrajet, commentaires, precisionRdv, villeDepart, villeArrivee)
   VALUES (4, '14h00', '20230402', 5, 10, 3, 'a pourvoir', 'non fumeur', 'A cote de l’Eglise', 27, 30);

UPDATE TRAJET SET nbPlacesRestantes = 0 WHERE idTrajet = 1; /* Test trajet complet */

INSERT INTO TRAJET_PUBLIC VALUES (1);
INSERT INTO TRAJET_PUBLIC VALUES (2);
INSERT INTO TRAJET_PUBLIC VALUES (4);
INSERT INTO TRAJET_PUBLIC VALUES (5);

INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(4, 3, 1);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(5, 3, 1);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(2, 2, 1);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(3, 2, 1);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(1, 1, 1);
INSERT INTO TRAJET_EN_COURS_PASSAGER VALUES(5, 1, 1);


INSERT INTO DEMANDE_TRAJET_EN_COURS VALUES (1, 4, 1, 'en cours', NULL);
INSERT INTO DEMANDE_TRAJET_EN_COURS VALUES (2, 4, 2, 'en cours', 'bonjour, je peux participer ?');
INSERT INTO DEMANDE_TRAJET_EN_COURS VALUES (1, 5, 3, 'en cours', NULL);


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


/* Pour les test sur compte */
INSERT INTO TOKEN VALUES (1, '9f36ad8ef1718c3c2258025e06e7eb2d', 'exp');

COMMIT;