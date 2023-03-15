BEGIN;

INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('DURAND', 'Olivier', 'olivier@mail.com', '1 Rue Stanislas', 'NANCY', '54000', 'FRANCE', 'homme', 1, '0606060606', '95e8dcef79ad56c796c894bbf2dcce09c56a44fa648e88a4ce50b4d6e238470f12428f730cc4f16ba59e99e07c51ad716a763ce01f71ff9ec1c7542abd0d6cae', 0);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('FRANCOIS', 'Marie', 'marie@mail.com', '12 Rue Saint-Dizier', 'NANCY', '54000', 'FRANCE', 'femme', 1, '0606060606', '8871fd083693dfdb7a0768bfa2ddb05ecf3a4a5102627611fea48cbf569e4fa238e4f95ffa75edb8a3f9e462d8525aa5d079eb5bdf028654de9da00ffa509d0a', 0);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('LEGRAND', 'Paul', 'paul@mail.com', '20 Rue des Carmes', 'NANCY', '54000', 'FRANCE', 'homme', 0, '0606060606', 'ae35a614392539445a23dde8f72d480d7c068e56a630d4a25d498f516b93c31ee261982586c34dc72c3eeb9f6b335f5de86b8c610f0f2e84955767156fc341b5', 1);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('PIERRE', 'Harry', 'harry@mail.com', '11 Rue des Tiercelins', 'NANCY', '54000', 'FRANCE', 'autre', 1, '0606060606', 'aa4ebc2ab2a8e58e7df248f47c93474f500d96c36d6efb172f8303b3cc514550a525d5388ccfc81f03335f054d3af416774da0596fcae1ca9ac31a88b39ad113', 1);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail)
    VALUES ('DIDIER', 'Sophie', 'sophie@mail.com', '8 Rue Gustave Simon', 'NANCY', '54000', 'FRANCE', 'femme', 0, '0606060606', '93f8556ed792c35de85a6a4036fa4463964f5011e41ab7abb047937163448fc1c15834536008a6ae66a35de2bc7c1f8a2a84ed15b385fcab1ceb50ee7d968c4e', 1);
INSERT INTO COMPTE(nomCompte, prenomCompte, email, adresse, ville, codePostal, pays, genre, voiture, telephone, mdp, notificationMail, isAdmin)
    VALUES ('ADMIN', 'Admin', 'admin@mail.com', 'admin', 'ADMIN', '54000', 'FRANCE', 'femme', 0, '0606060606', '52f81cbcffa9c2fcc51990ea4e579c2f2c15271015df5eb2b8e10ef7ed43e18a9d4c06907549796346f059fa4ac5a3a9c6b29765612c82aa69736814e1e99b7c', 0, 1);

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