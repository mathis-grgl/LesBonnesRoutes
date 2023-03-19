const token = getCookieToken();
const url = '/ami/getGroupes/' + token;
console.log(url);

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
    card.append(cardBody);

    container.append(card);

}