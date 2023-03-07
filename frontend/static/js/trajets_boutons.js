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

console.log("coucoucocucuhceiuhfiei");
$(function() {
    console.log( "ready!" );
    
});

$(document).on('click', '.edit-btn', function() {
    console.log('Le bouton "Modifier" a été cliqué.');
    
});


$(document).on('click', '.delete-btn', function() {
    console.log('Le bouton "Supprimer" a été cliqué.');
});



$(document).on('click', '.details-btn', function() {
    console.log('Le bouton "details" a été cliqué.');
});

$(document).on('click', '.cancel-btn', function() {
    console.log('Le bouton "cancel" a été cliqué.');
});