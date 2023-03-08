// //Ajouter des événements aux boutons
// $('.edit-btn').on('click', function() {
//     // Code pour la modification du trajet
//     event.preventDefault();
//     console.log('Modifier le trajet');
//   });



//   $('.details-btn').on('click', function() {
//     // Code pour afficher les détails du trajet
//     console.log('Afficher les détails du trajet');
//   });

//   $('.cancel-btn').on('click', function() {
//     // Code pour annuler la participation au trajet
//     console.log('Annuler la participation');
//   });

// /deleteTrajet/<string:token>/<int:idTrajet>'




console.log("coucoucocucuhceiuhfiei");
$(function () {
    console.log("ready!");



});



$(document).on('click', '.edit-btn', function () {

    console.log('Le bouton "Modifier" a été cliqué.');
    let id = $(this).attr('id');
    console.log(id);

});


$(document).on('click', '.delete-btn', function () {
    
    let token = getCookieToken();
    console.log('token1 : ' + token);
    console.log('Le bouton "Supprimer" a été cliqué.');
    // let id = $(this).attr('id');
    let id = parseInt($(this).attr('id'));
    console.log(typeof id);

    let url = "/trajet/deleteTrajet/" + token + "/" + id;
    console.log(url);
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Network response was not ok');
            }
            return reponse.json();

        })
        .then(data => {
            console.log("On retire le trajet " + id);
            window.location.href = '/mes_trajets';

        })
        .catch(error => {
            console.error(error);
        })
});



$(document).on('click', '.details-btn', function () {
    console.log('Le bouton "details" a été cliqué.');
    let id = $(this).attr('id');
    console.log(id);
});

$(document).on('click', '.cancel-btn', function () {
    console.log('Le bouton "cancel" a été cliqué.');
    let id = $(this).attr('id');
    console.log(id);
});