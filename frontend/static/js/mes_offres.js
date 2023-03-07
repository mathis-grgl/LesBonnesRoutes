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
            // table2.append(tbody2);
            // let nbCompte = data.length;
            //     let table = $('#accountTable');
            //     let tbody = $("<tbody>");
            //     for (let i = 0; i < nbCompte; i++) {
            //       let account = data[i];
            //       console.log(account.nomCompte);
            //       let tr = $("<tr>");
            //       tr.append($('<td>').append($('<img>').attr('src', "static/images/person_" + i + ".jpg").attr('alt', account.nomCompte).attr('width', 64).attr('height', 64)));
            //       tr.append($('<td>').text(account.nomCompte + ' ' + account.prenomCompte));
            //       tr.append($('<td>').text(account.genre));
            //       tr.append($('<td>').append($('<a>').attr('href', 'mailto:' + account.email).text(account.email)));
            //       tr.append($('<td>').text(account.telephone));
            //       tr.append($('<td>').text(account.noteCompte));
            //       tr.append($('<td>').append($('<p>').attr('data-placement', 'top').attr('data-toggle', 'tooltip').attr('title', 'Edit').append($('<button>').addClass('btn btn-primary btn-xs').attr('data-title', 'Edit').attr('data-toggle', 'modal').attr('data-target', '#edit').append($('<span>').addClass('fa fa-pencil')))));
            //       tr.append($('<td>').append($('<p>').attr('data-placement', 'top').attr('data-toggle', 'tooltip').attr('title', 'Delete').append($('<button>').addClass('btn btn-danger btn-xs').attr('data-title', 'Delete').attr('data-toggle', 'modal').attr('data-target', '#delete').append($('<span>').addClass('fa fa-trash')))));
            //       tbody.append(tr);

            //     }
            //     table.append(tbody);


        })
        .catch(error => {
            console.error(error);
        })
}



// // Menu deroulant ville de départ
// const select = document.querySelector("select[name='villeDepart']");

// if (select === null) {
//     console.log("select null");
// }
// else {
//     fetch('/admin/villes')
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error('Erreur : ' + response.status);
//             }
//         })
//         .then(data => {
//             console.log(data.length);
//             // data contient un tableau avec les noms de toutes les villes
//             data.forEach(res => {
//                 const city = document.createElement('option');
//                 city.value = res;
//                 city.innerText = res;
//                 select.appendChild(city);
//             });
//             // faire quelque chose avec les données
//         })
//         .catch(error => {
//             console.error('Erreur : ' + error.message);
//         });
// }

// // Menu deroulant ville d'arrivée
// const select1 = document.querySelector("select[name='villeArrivee']");

// if (select1 === null) {
//     console.log("select null");
// }
// else {
//     fetch('/admin/villes')
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error('Erreur : ' + response.status);
//             }
//         })
//         .then(data => {
//             // data contient un tableau avec les noms de toutes les villes
//             data.forEach(res => {
//                 const city = document.createElement('option');
//                 city.value = res;
//                 city.innerText = res;
//                 select1.appendChild(city);
//             });
//             // faire quelque chose avec les données
//         })
//         .catch(error => {
//             console.error('Erreur : ' + error.message);
//         });
// }




// $('#forminput').submit(function (event) {
//     event.preventDefault();

//     let date = $('#date-depart').val();
//     console.log(date);
//     let vd = $('#city_start').val();
//     console.log(vd);
//     let va = $('#city_end').val();
//     console.log(va);
//     let heure = $('#heure-depart').val().replace(':', 'h');
//     console.log(heure);
//     let nbPlaces = $('#nb-places').val();
//     console.log(nbPlaces);
//     let prix = $('#prix-place').val();
//     console.log(prix);
//     let commentaires = $('#commentaires').val();
//     console.log(commentaires);
//     let precision = $('#precision').val();
//     console.log(precision);


//     let dateParts = date.split('-');
//     let jour = dateParts[0];
//     let annee = dateParts[2];
//     let mois = dateParts[1] - 1;
//     //let dateFormatted = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

//     let dateObject = moment(date, 'YYYY/MM/DD');
//     let dateFormatted = dateObject.format('D MMMM, YYYY');


//     console.log('test : ' + dateFormatted);

//     fetch(createTrajetURL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             'heureDepart': heure,
//             'dateDepart': dateFormatted,
//             'nbPlaces': nbPlaces,
//             'prix': prix,
//             'commentaires': commentaires,
//             'precisionRdv': precision,
//             'villeDepart': vd,
//             'villeArrivee': va
//         })
//     })
//         .then(reponse => {
//             if (reponse.ok) {
//                 alert("Votre trajet a bien été créé.");
//                 window.location.href = '/mes_trajets_crees';
//             } else {
//                 alert("Probleme dans le fetch");

//             }

//         }).catch(error => {
//             console.error(error);
//         });








// });


// Ajouter des événements aux boutons
$('.edit-btn').on('click', function() {
    // Code pour la modification du trajet
    console.log('Modifier le trajet');
  });
  
  $('.delete-btn').on('click', function() {
    // Code pour la suppression du trajet
    console.log('Supprimer le trajet');
  });
  
  $('.details-btn').on('click', function() {
    // Code pour afficher les détails du trajet
    console.log('Afficher les détails du trajet');
  });
  
  $('.cancel-btn').on('click', function() {
    // Code pour annuler la participation au trajet
    console.log('Annuler la participation');
  });
  