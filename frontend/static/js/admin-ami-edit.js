let url = null;
let id = null;
let token = null;

// Récupération du token admin
token = getCookieToken();
url = '/admin/getGroupes/' + token;

// Si le token est null, on redirige vers la page de connexion
if (token == null) {
    window.location.href = "../../../login_signup";
} else {
    // get last character of url
    let urlLink = window.location.href;
    id = urlLink.charAt(urlLink.length - 1);

    // Si l'id de l'utilisateur est null, on affiche une alerte et on redirige vers la page de gestion des comptes
    if (!id.match(/^[0-9]+$/)) {
        alert("Veuillez sélectionner un trajet");
        window.location.href = "../../search-route";
    }
}

const idGroupe = id;
const infoCompteCo = '/compte/getInfoCompte/' + token;
const getMembres = '/ami/getMembers/' + idGroupe;
let idUserco;

fetch(infoCompteCo)
    .then(reponse => {
        if (!reponse.ok) { throw new Error(reponse.statusText); }
        return reponse.json();
    })
    .then(data => { idUserco = data.idCompte; })
    .catch(error => { console.error(error); })

function displayMembres(data, container) {

    let card = $("<div>").addClass("member-card").data("groupe", data);

    let photo = data.photo;
    if (photo == null)
        photo = $('<img>').attr('src', 'https://via.placeholder.com/150');
    else
        photo = $('<img>').attr('src', data.photo || 'https://via.placeholder.com/150');
    card.append(photo);

    if (data.idCompte == data.idCreateur) {
        let name = $('<h2>').text(`${data.nomCompte} ${data.prenomCompte} 👑`);
        card.append(name);
    } else {
        let name = $('<h2>').text(`${data.nomCompte} ${data.prenomCompte}`);
        card.append(name);
    }

    let email = $('<p>').text(data.email);
    card.append(email);

    const deleteBtn = $('<button>')
        .addClass('delete-btn').attr('id', data.idCompte)
        .text('Supprimer');
    card.append(deleteBtn);

    container.append(card);
}

function charger_groupe() {
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("network issue");
            }
            return reponse.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (i + 1 == id) {
                    $('#group-name').val(data[i].nomGroupe);
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
    charger_membres();
}

function charger_membres() {
    console.log("affichage des membres.")
    const membersContainer = $('#members-container');
    fetch(getMembres)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(reponse.statusText);
            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                displayMembres(data[i], membersContainer);
            }
        })
        .catch(error => {
            console.error(error);
        })
}

$('#modifier_groupe').submit(function (event) {
    event.preventDefault(); // pour empêcher la soumission normale du formulaire
    let nomGroupe = $('#group-name').val();

    // Récupérer toutes les valeurs sélectionnées dans le select
    const urlmodif = '/admin/modifNom/' + token + '/' + id + '/' + nomGroupe;

    fetch(urlmodif, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'nomGroupe': nomGroupe })
    })
        .then(reponse => {
            if (reponse.ok) { window.location.href = '/admin/search-ami'; }
            else { alert("network issue"); }
        })
        .catch(error => { console.error(error); });
});


$(document).on('click', '.delete-btn', function () {

    let id = $(this).attr('id');
    let del = '/admin/removeMember/' + token + '/' + idGroupe + '/' + id;
    console.log(del);
    if (window.confirm("Etes-vous sûr de vouloir supprimer cet utilisateur du groupe d'amis ? ")) {
        fetch(del , { method: 'DELETE' })
            .then(reponse => {
                if (!reponse.ok) {
                    throw new Error('Network response was not ok');
                }
                return reponse.json();

            })
            .then(data => {
                location.reload();
            })
            .catch(error => {
                console.error(error);
            })
    }
});