const token = getCookieToken();
const url = '/ami/getGroupes/' + token;
console.log(url);

const infoCompte = '/compte/getInfoCompte/' + token;
let id;

fetch(infoCompte)
    .then(reponse => {
        if (!reponse.ok) {
            throw new Error("network pas ok");
        }
        return reponse.json();
    })
    .then(data => {
        console.log(data);
        id = data.idCompte;
        console.log(id);

    })
    .catch(error => {
        console.error(error);
    });

function charger_groupes() {
    console.log("test");
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("network wasnt ok");
            }

            return reponse.json();
        })
        .then(data => {
            console.log(data);
            let container = $("#groupes-container");
            // Remove previous participants
            container.empty();
            for (let i = 0; i < data.length; i++) {
                displayGroupes(data[i], container);

            }


        })
        .catch(error => {
            console.error(error);
        });
}


function displayGroupes(data, container) {
    let card = $("<div>").addClass("card").data("groupe", data);

    let cardBody = $("<div>").addClass("card-body");

    let cardTitle = $("<h5>").addClass("card-title").text(data.nomGroupe);

    let cardText = $("<p>").addClass("card-text").text('Ce groupe contient ' + data.nbPersonnes + ' personnes.');


    let cardDiv = $("<div>").addClass("group-actions");


    if (data.idCreateur == id) {
        console.log("iciciicdghejfhd");
        // ajouter un autre bouton pour afficher les membres du groupe pour ensuite pouvoir les supprimer ou non
        let acceptBtn = $("<button>")
            .addClass("add-members").attr('id', data.idGroupe)
            .html('<i class="fas fa-user-plus"></i>');

        let rejectBtn = $("<button>")
            .addClass("edit-group").attr('id', data.idGroupe)
            .html('<i class="fas fa-edit"></i>');

        let removeBtn = $("<button>")
            .addClass("delete-group").attr('id', data.idGroupe)
            .html('<i class="fas fa-trash"></i>');
            


        cardDiv.append(acceptBtn, rejectBtn, removeBtn);

        cardBody.append(cardTitle, cardText, cardDiv);
    } else {
        console.log("On est pas propriétaire du groupe d'amis.");
        // ajouter un autre bouton pour afficher les membres du groupe 
        let acceptBtn = $("<button>")
            .addClass("add-members").attr('id', data.idGroupe)
            .html('<i class="fas fa-user-plus"></i>');



        cardDiv.append(acceptBtn);

        cardBody.append(cardTitle, cardText, cardDiv);
    }

    card.append(cardBody);

    container.append(card);

}