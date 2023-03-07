const token = getCookieToken();
console.log(token);
const url = 'trajet/trajetsCompte/' + token;
const createTrajetURL = 'trajet/createTrajet/' + token;
console.log(url);
console.log(createTrajetURL);

function charger_trajets() {
    console.log("On est appelé.")
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Network response was not ok');
            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);
            let nbTrajets = data.length;
            console.log(nbTrajets);
            let table = $('#trajets');
            let table2 = $('#trajets_crees')
            let tbody = $("<tbody>");
            let tbody2 = $("<tbody>");
            for (let i = 0; i < nbTrajets; i++) {
                let trajet = data[i];
                console.log(trajet.idCompte);
                console.log(trajet.idConducteur);

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
                        $('<td>').append(
                            $('<div>').addClass('div-container')
                                .append(
                                    $('<button>').addClass('edit-btn')
                                        .html("<i class='fas fa-edit'></i>"),
                                    $('<button>').addClass('delete-btn')
                                        .html("<i class='fas fa-trash'></i>")

                                )
                        )
                    );

                    // ligne.append($('<td>').append($('<div>')).addClass('div-container')
                    // .append($('<button>')).addClass('edit-btn').html("<i class="fas fa-edit"></i>")
                    // )

                    tbody.append(ligne);


                } else {
                    console.log("Le trajet correspond à un trajet que l'utilisateur connecté participe.")
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
                    row.append($('<td>').text("Passager"));
                    row.append(
                        $('<td>').append(
                            $('<div>').addClass('div-container')
                                .append(
                                    $('<button>').addClass('details-btn')
                                        .html("<i class='fas fa-info'></i>"),
                                    $('<button>').addClass('cancel-btn')
                                        .html("<i class='fas fa-times'></i>")

                                )
                        )
                    );

                    tbody.append(row);

                }





            }

            table.append(tbody);
        })
        .catch(error => {
            console.error(error);
        });
}






// Ajouter un écouteur de clic au bouton "Modifier"
// $(document).on('click', '.edit-btn', function() {
//     console.log('Le bouton "Modifier" a été cliqué.');
//   });
  
//   // Ajouter un écouteur de clic au bouton "Supprimer"
//   $(document).on('click', '.delete-btn', function() {
//     console.log('Le bouton "Supprimer" a été cliqué.');
//   });
  







// Ajouter des événements aux boutons
// $('.edit-btn').on('click', function() {
//     // Code pour la modification du trajet
//     event.preventDefault();
//     console.log('Modifier le trajet');
//   });
  
//   $('.delete-btn').on('click', function() {
//     // Code pour la suppression du trajet
//     console.log('Supprimer le trajet');
//   });
  
//   $('.details-btn').on('click', function() {
//     // Code pour afficher les détails du trajet
//     console.log('Afficher les détails du trajet');
//   });
  
//   $('.cancel-btn').on('click', function() {
//     // Code pour annuler la participation au trajet
//     console.log('Annuler la participation');
//   });
  