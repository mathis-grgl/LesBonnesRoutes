

// /getDemandesTrajet/<string:token>/<int:idTrajet>

// token de l'user connecté
let token = getCookieToken();
const params = new URLSearchParams(window.location.search);

// id du trajet sélectionné 
let id = parseInt(params.get('id'));
console.log(typeof id + ' : ' + id);

let urlDemande = '/trajet/getDemandesTrajet/' + token + '/' + id;

// /getPassagers/<string:token>/<int:idTrajet>'
let urlParticpants = '/trajet/getPassagers/' + token + '/' + id;

console.log(urlParticpants);
$(document).ready(function () {
    fetch(urlDemande)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("Network issue");
            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);

            let container = $("#demandes-container");
            // Remove previous participants
            container.empty();
            if (typeof data !== 'undefined') {




                for (let i = 0; i < data.length; i++) {
                    displayUserDemande(data[i], container);
                    // let card = $("<div>").addClass("card").data("participant", data);

                    // let cardBody = $("<div>").addClass("card-body");

                    // let cardTitle = $("<h5>").addClass("card-title").text(data[i].nomCompte + ' ' + data[i].prenomCompte);

                    // let cardText = $("<p>").addClass("card-text").text('Cet utilisateur veut ' + data[i].nbPlaces);

                    // let cardNote = $("<p>").addClass("card-text").text('Cet utilisateur a une note de ' + data[i].noteCompte + ' étoiles.');

                    // let acceptBtn = $("<button>")
                    //     .addClass("btn btn-success btn-valid")
                    //     .html('<i class="fa fa-check"></i>');

                    // let rejectBtn = $("<button>")
                    //     .addClass("btn btn-danger btn-refuse")
                    //     .html('<i class="fa fa-times"></i>');

                    // // let removeBtn = $("<button>")
                    // //     .addClass("btn btn-warning btn-remove")
                    // //     .html('<i class="fa fa-trash"></i>');

                    // cardBody.append(cardTitle, cardText,cardNote, acceptBtn, rejectBtn);
                    // card.append(cardBody);

                    // container.append(card);

                }
            } else {
                container.append($("<h5>").addClass("card-title").text("Il n'y a pas de demandes."));

            }

        })
        .catch(error => {
            console.error(error);
        });

    // faire un autre fetch quand juliette l'aura fait pour afficher les utilisateurs qui participent à ce trajet

    fetch(urlParticpants)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('network wasnt ok');
            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);

            let container = $("#participants-container");
            // Remove previous participants
            container.empty();
            if (typeof data !== undefined) {
                for (let i = 0; i < data.length; i++) {
                    displayParticipants(data[i], container)

                }
                // location.reload();
            }

        })


    // Display the participants and participation requests
    // displayParticipants(participants);
    // displayDemandes(demandes);


    // /acceptInTrajet/<string:token>/<int:idCompte>/<int:idTrajet>/<int:nbPlaces>/<string:accept>


    // Add event listeners for the participation request buttons
    $(document).on("click", ".btn-valid", function () {
        // Handle accept button click
        let participant = $(this).closest(".card").data("participant");
        console.log(`On accepte le participant dont l'id est : ${participant.idCompte}`);

        let nbPlaces = participant.nbPlaces;
        console.log('Le nombre de places : ' + nbPlaces);


        let url = '/trajet/acceptInTrajet/' + token + '/' + participant.idCompte + '/' + id + '/' + participant.nbPlaces + '/oui';

        console.log(url);

        fetch(url)
            .then(reponse => {
                if (!reponse.ok) {
                    throw new Error('network issue');
                }
                return reponse.json();
            })
            .then(data => {
                // code qui dit qu'on l'a accepté donc maintenant il se retrouve dans la liste des personnes participant au trajet
                // donc maybe refaire un fetch sur les demandes et passagers et display en fonction
                let container = $("#demandes-container");
                // Remove previous participants
                container.empty();
                // code qui dit qu'on l'a accepté donc maintenant il se retrouve dans la liste des personnes participant au trajet
                // donc maybe refaire un fetch sur les demandes et passagers et display en fonction
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    displayUserDemande(data[i], container);
                    // displayParticipants(data[i], container);
                }
                location.reload();
            })
            .catch(error => {
                console.error(error);
            });

    });

    $(document).on("click", ".btn-refuse", function () {
        // Handle reject button click
        let participant = $(this).closest(".card").data("participant");
        console.log(`On refuse le participant dont l'id est : ${participant.idCompte}`);

        let nbPlaces = participant.nbPlaces;
        console.log('Le nombre de places : ' + nbPlaces);


        let url = '/trajet/acceptInTrajet/' + token + '/' + participant.idCompte + '/' + id + '/' + participant.nbPlaces + '/non';

        console.log(url);

        fetch(url)
            .then(reponse => {
                if (!reponse.ok) {
                    throw new Error('network issue');
                }
                return reponse.json();
            })
            .then(data => {
                let container = $("#demandes-container");
                // Remove previous participants
                container.empty();
                // code qui dit qu'on l'a accepté donc maintenant il se retrouve dans la liste des personnes participant au trajet
                // donc maybe refaire un fetch sur les demandes et passagers et display en fonction
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    displayUserDemande(data[i], container);

                }
                location.reload();
            })
            .catch(error => {
                console.error(error);
            });
    });



    // 
    // Add event listener for the remove participant button
    $(document).on("click", ".btn-remove", function () {
        // Handle remove participant button click
        const participant = $(this).closest(".card").data("participant");
        console.log(`On vire le passager dont l'id est : ${participant.idCompte}`);
        console.log("Voici son prénom : " + participant.nomCompte + ' ' + participant.prenomCompte);

        // /deletePassager/<string:token>/<int:idComptePassager>, <int:idTrajet>'

        let url = '/trajet/deletePassager/' + token + '/' + participant.idCompte + '/' + id;
        console.log(url);
        fetch(url)
            .then(reponse => {
                if (!reponse.ok) {
                    throw new Error('network issue');
                }
                return reponse.json();
            })
            .then(data => {
                let container = $("#participants-container");
                // Remove previous participants
                container.empty();
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    displayParticipants(data[i], container);


                }
                location.reload();
            })
            .catch(error => {
                console.error(error);
            });
    });
});


function displayUserDemande(data, container) {
    let card = $("<div>").addClass("card").data("participant", data);

    let cardBody = $("<div>").addClass("card-body");

    let cardTitle = $("<h5>").addClass("card-title").text(data.nomCompte + ' ' + data.prenomCompte);

    let cardText = $("<p>").addClass("card-text").text('Cet utilisateur veut ' + data.nbPlaces + ' places.');

    let text = "";
    if (data.noteCompte == null) {
        text = "Cet utilisateur n'a pas encore de note.";

    } else {
        text = 'Cet utilisateur a une note de ' + data.noteCompte + ' étoiles.';
    }

    let cardNote = $("<p>").addClass("card-text").text(text);

    let acceptBtn = $("<button>")
        .addClass("btn btn-success btn-valid")
        .html('<i class="fa fa-check"></i>');

    let rejectBtn = $("<button>")
        .addClass("btn btn-danger btn-refuse")
        .html('<i class="fa fa-times"></i>');

    // let removeBtn = $("<button>")
    //     .addClass("btn btn-warning btn-remove")
    //     .html('<i class="fa fa-trash"></i>');

    cardBody.append(cardTitle, cardText, cardNote, acceptBtn, rejectBtn);
    card.append(cardBody);

    container.append(card);

    // container.innerHTML += card[0].outerHTML;

}

function displayParticipants(data, container) {
    console.log(data);
    let card = $("<div>").addClass("card").data("participant", data);

    let cardBody = $("<div>").addClass("card-body");

    let cardTitle = $("<h5>").addClass("card-title").text(data.nomCompte + ' ' + data.prenomCompte);

    let cardText = $("<p>").addClass("card-text").text('Cet utilisateur a pris ' + data.nbPlaces + ' places.');

    let text = "";
    if (data.noteCompte == null) {
        text = "Cet utilisateur n'a pas encore de note.";

    } else {
        text = 'Cet utilisateur a une note de ' + data.noteCompte + ' étoiles.';
    }

    let cardNote = $("<p>").addClass("card-text").text(text);



    let removeBtn = $("<button>")
        .addClass("btn btn-warning btn-remove")
        .html('<i class="fa fa-trash"></i>');

    cardBody.append(cardTitle, cardText, cardNote, removeBtn);
    card.append(cardBody);

    container.append(card);
    // container.innerHTML += card[0].outerHTML;

}



















// // Function to display the participants
// function displayParticipants(participants) {
//     const container = $("#participants-container");

//     // Remove previous participants
//     container.empty();

//     // Display new participants
//     participants.forEach(participant => {
//         displayUserCard(participant, container);
//     });
// }

// // Function to display the participation requests
// function displayDemandes(demandes) {
//     const container = $("#demandes-container");

//     // Remove previous participation requests
//     container.empty();

//     // Display new participation requests
//     demandes.forEach(demande => {
//         displayUserCard(demande, container);
//     });
// }

// Example data for testing
// const participants = [
//     { name: 'John Doe', email: 'john.doe@example.com' },
//     { name: 'Jane Doe', email: 'jane.doe@example.com' },
//     { name: 'Jane Doe', email: 'jane.doe@example.com' },
//     { name: 'Jane Doe', email: 'jane.doe@example.com' }
// ];

// const demandes = [
//     { name: 'Bob Smith', email: 'bob.smith@example.com' },
//     { name: 'Alice Jones', email: 'alice.jones@example.com' }
// ];

// Display the participants and participation requests
//   displayParticipants(participants);
//   displayDemandes(demandes);

// function displayAll() {
//     displayParticipants(participants);
//     displayDemandes(demandes);

// }



// Function to display a user card
// function displayUserCard(user, container) {
//     const card = $("<div>").addClass("card").data("participant", user);

//     const cardBody = $("<div>").addClass("card-body");

//     const cardTitle = $("<h5>").addClass("card-title").text(user.name);

//     const cardText = $("<p>").addClass("card-text").text(user.email);

//     const acceptBtn = $("<button>")
//         .addClass("btn btn-success btn-valid")
//         .html('<i class="fa fa-check"></i>');

//     const rejectBtn = $("<button>")
//         .addClass("btn btn-danger btn-refuse")
//         .html('<i class="fa fa-times"></i>');

//     const removeBtn = $("<button>")
//         .addClass("btn btn-warning btn-remove")
//         .html('<i class="fa fa-trash"></i>');

//     cardBody.append(cardTitle, cardText, acceptBtn, rejectBtn, removeBtn);
//     card.append(cardBody);

//     container.append(card);
// }
