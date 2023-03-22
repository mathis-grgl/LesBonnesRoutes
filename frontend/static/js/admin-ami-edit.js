let url = null;
let id = null;
let token = null;

// Récupération du token admin
token = getCookieToken();

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

const membersNames = [];

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

    //On vérifie que le créateur ne puisse pas se supprimer lui même
    if (data.idCompte != data.idCreateur) {
        const deleteBtn = $('<button>')
            .addClass('delete-btn').attr('id', data.idCompte)
            .text('Supprimer');
        card.append(deleteBtn);
    }

    container.append(card);
}

function charger_groupe() {
    url = '/admin/getGroupes/' + token;
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("network issue");
            }
            return reponse.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (i+1 == id) {
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
    const membersContainer = $('#members-container');
    fetch(getMembres)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(reponse.statusText);
            }
            return reponse.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                displayMembres(data[i], membersContainer);
                membersNames.push(data[i].nomCompte);
            }
        })
        .catch(error => {
            console.error(error);
        })
    charger_users();
}

function charger_users() {
    
    url = '/admin/users';
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) { throw new Error("network wasnt ok"); }
            return reponse.json();
        })
        .then(data => {
            const $select = $('#select-users');
            const addedNames = []; // tableau pour stocker les noms des personnes déjà ajoutées
            $.each(data, function (index, user) {
                const prenomUser = user.nomCompte;
                console.log(membersNames);
                if (!addedNames.includes(prenomUser) && prenomUser !== "ADMIN" && idUserco !== user.idCompte && !membersNames.includes(prenomUser)) {
                    $select.append('<option value="' + user.idCompte + '">' + user.nomCompte + " " + user.prenomCompte + '</option>');
                    addedNames.push(prenomUser); // ajouter le nom à la liste des noms déjà ajoutés
                }
            });
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
    if (window.confirm("Etes-vous sûr de vouloir supprimer cet utilisateur du groupe d'amis ? ")) {
        fetch(del, { method: 'DELETE' })
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

$('#ajouter_amis').submit(function (event) {
    event.preventDefault(); // pour empêcher la soumission normale du formulaire

    const selectedValues = $('#select-users').val();

    let idAmi = parseInt(selectedValues[0]);
    let url = '/admin/addMember/' + token + '/' + idGroupe + '/' + idAmi;

    fetch(url, { method: 'POST' })
        .then(reponse => {
            if (!reponse.ok) { throw new Error(reponse.statusText); }
            else { location.reload(); }
            return reponse.json();
        })
        .catch(error => {
            console.error(error);
        });
});