const token = getCookieToken();
const url = '/trajet/trajetsCompte/' + token;
const createTrajetURL = '/trajet/createTrajet/' + token;
const getCompteURL = '/compte/getNomCompte/';
const infoCompte = '/compte/getInfoCompte/' + token;

function charger_trajets() {

    fetch(infoCompte)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(reponse);
            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);
            let voiture = data.voiture;
            if (voiture == 0) {
                $('#creer').remove();
            }
        })
        .catch(error => {
            console.error(error);
        })
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Network response was not ok');
            }
            return reponse.json();
        })
        .then(data => {

            // Récupération du nombre de trajets
            console.log(data);
            let nbTrajets = data.length;

            let table = $('#trajets');
            let tbody = $("<tbody>");

            for (let i = 0; i < nbTrajets; i++) {

                //Affectation des données de chaque trajet
                let trajet = data[i];
                let date = data[i].dateDepart;
                let heure = data[i].heureDepart.replace('h', ':');
                console.log(date);
                let dateObject = moment(date, 'D MMMM, YYYY');
                // let dateObject = moment(date, 'YYYY/MM/DD');

                let dateFormatted = dateObject.format('YYYY-MM-DD');
                console.log(dateFormatted);
                let today = new Date();
                let todayms = today.getTime();
                let dateString = dateFormatted + "T" + heure + ":00Z";
                console.log(dateString);

                let autreDate = new Date(dateString);
                console.log(autreDate);
                let autreDateMS = autreDate.getTime();


                let differenceMS = autreDateMS - todayms;




                //console.log(trajet.idCompte);
                //console.log(trajet.idConducteur);

                // Trajet crée par l'utilisateur
                if (trajet.idCompte == trajet.idConducteur) {
                    console.log("Le trajet correspond à un trajet que l'utilisateur connecté a crée.")
                    let ligne = $("<tr>");
                    let typeTrajet = (trajet.typeTrajet.charAt(0).toUpperCase() + trajet.typeTrajet.slice(1)).replace('e', 'é');

                    ligne.append($('<td>').text( typeTrajet + " : " + trajet.nomGroupe));
                    ligne.append($('<td>').text(trajet.villeDepart));
                    ligne.append($('<td>').text(trajet.villeArrivee));
                    ligne.append($('<td>').text(dateObject.format('DD-MM-YYYY')));
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
                    if (differenceMS > (24 * 60 * 60 * 1000)) {
                        // Il y a plus de 24 heures d'écart entre les deux dates
                        console.log("Il y a plus de 24 heures d'écart entre la date d'aujourd'hui et l'autre date.");


                    } else {
                        // Il n'y a pas plus de 24 heures d'écart entre les deux dates
                        $('.delete-btn#' + trajet.idTrajet).remove();
                    }

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
                            row.append($('<td>').text(trajet.typeTrajet.charAt(0).toUpperCase() + trajet.typeTrajet.slice(1)));
                            row.append($('<td>').text(trajet.villeDepart));
                            row.append($('<td>').text(trajet.villeArrivee));
                            row.append($('<td>').text(dateObject.format('DD-MM-YYYY')));
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


