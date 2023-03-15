const token = getCookieToken();
const url = 'trajet/trajetsCompte/' + token;
const createTrajetURL = 'trajet/createTrajet/' + token;
const getCompteURL = 'compte/getNomCompte/';

function charger_trajets() {
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Network response was not ok');
            }
            return reponse.json();
        })
        .then(data => {

            // Récupération du nombre de trajets
            let nbTrajets = data.length;

            let table = $('#trajets');
            let tbody = $("<tbody>");

            for (let i = 0; i < nbTrajets; i++) {

                //Affectation des données de chaque trajet
                let trajet = data[i];

                //console.log(trajet.idCompte);
                //console.log(trajet.idConducteur);

                // Trajet crée par l'utilisateur
                if (trajet.idCompte == trajet.idConducteur) {
                    console.log("Le trajet correspond à un trajet que l'utilisateur connecté a crée.")
                    let ligne = $("<tr>");
                    ligne.append($('<td>').text(trajet.villeDepart));
                    ligne.append($('<td>').text(trajet.villeArrivee));
                    ligne.append($('<td>').text(trajet.dateDepart));
                    ligne.append($('<td>').text(trajet.heureDepart));
                    ligne.append($('<td>').text(trajet.nbPlacesRestantes + '/' + trajet.nbPlaces));
                    ligne.append($('<td>').text(trajet.statusTrajet));
                    ligne.append($('<td>').text(trajet.prix + '€'));
                    ligne.append($('<td>').text(trajet.precisionRdv));
                    ligne.append($('<td>').text(trajet.commentaires));
                    ligne.append($('<td>').text("Conducteur"));
                    ligne.append(
                        $('<td>').attr('id', trajet.idTrajet)
                            .append(
                                $('<div>').addClass('div-container')
                                    .append(
                                        $('<button>').addClass('confirm-btn').attr('id', trajet.idTrajet)
                                            .html("<i class='fas fa-check'></i>"),
                                        $('<button>').addClass('details-btn').attr('id', trajet.idTrajet)
                                            .html("<i class='fas fa-users'></i>"),
                                        $('<button>').addClass('edit-btn').attr('id', trajet.idTrajet)
                                            .html("<i class='fas fa-edit'></i>"),
                                        $('<button>').addClass('delete-btn').attr('id', trajet.idTrajet)
                                            .html("<i class='fas fa-trash'></i>")



                                    )
                            )
                    );

                    tbody.append(ligne);


                } else {
                    console.log("Le trajet correspond à un trajet que l'utilisateur connecté participe.")

                    // Récupération du nom du conducteur
                    let nomConducteur = "";
                    fetch(getCompteURL + trajet.idConducteur)
                        .then(reponse => {
                            if (!reponse.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return reponse.json();
                        })
                        .then(data => {
                            nomConducteur = data.nomCompte;
                            console.log(nomConducteur);
                            let row = $("<tr>");
                            row.append($('<td>').text(trajet.villeDepart));
                            row.append($('<td>').text(trajet.villeArrivee));
                            row.append($('<td>').text(trajet.dateDepart));
                            row.append($('<td>').text(trajet.heureDepart));
                            row.append($('<td>').text(trajet.nbPlacesRestantes + '/' + trajet.nbPlaces));
                            row.append($('<td>').text(trajet.statusTrajet));
                            row.append($('<td>').text(trajet.prix + '€'));
                            row.append($('<td>').text(trajet.precisionRdv));
                            row.append($('<td>').text(trajet.commentaires));
                            row.append($('<td>').text("Passager" + ', Conducteur : ' + nomConducteur));
                            row.append(
                                $('<td>').append(
                                    $('<div>').addClass('div-container')
                                        .append(

                                            $('<button>').addClass('cancel-btn').attr('id', trajet.idTrajet)
                                                .html("<i class='fas fa-times'></i>")
                                        )
                                )
                            );


                            tbody.append(row);

                        });
                }





            }

            table.append(tbody);
        })
        .catch(error => {
            console.error(error);
        });
}


