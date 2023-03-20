let token = getCookieToken();
const urlParams = new URLSearchParams(window.location.search);
const idGroupe = parseInt(urlParams.get('id'));
console.log(idGroupe);
const infoCompteCo = '/compte/getInfoCompte/' + token;
const getMembres = '/ami/getMembers/' + idGroupe;

console.log(infoCompteCo);
console.log(getMembres);

let idUserco;


fetch(infoCompteCo)
    .then(reponse => {
        if (!reponse.ok) {
            throw new Error(reponse.statusText);
        }

        return reponse.json();
    })
    .then(data => {
        console.log(data);
        idUserco = data.idCompte;
        console.log(idUserco);

    })
    .catch(error => {
        console.error(error);
    })



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


function displayMembres(data, container) {



    let card = $("<div>").addClass("member-card").data("groupe", data);



    let photo = $('<img>').attr('src', data.photo || 'https://via.placeholder.com/150');
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

    if (data.idCreateur == idUserco) {
        if (data.idCompte !== idUserco) {
            const deleteBtn = $('<button>')
                .addClass('delete-btn').attr('id', data.idCompte)
                .text('Supprimer');
            card.append(deleteBtn);

        }


    }


    container.append(card);






}


$(document).on('click', '.delete-btn', function () {

    console.log('Le bouton "delete user" a été cliqué.');
    let id = $(this).attr('id');
    console.log(id);
    let del = '/ami/removeMember/' + token + '/' + idGroupe + '/' + id;
    console.log(del);
    if (window.confirm("Etes-vous sûr de vouloir supprimer cet utilisateur du groupe d'amis ? ")) {
        fetch(del)
            .then(reponse => {
                if (!reponse.ok) {
                    throw new Error('Network response was not ok');
                }
                return reponse.json();

            })
            .then(data => {
                console.log("On retire le trajet " + id);
                location.reload();

            })
            .catch(error => {
                console.error(error);
            })
    }





    // Rediriger vers la nouvelle URL avec le paramètre "id"
    // window.location.href = url.href;


});



// const members = [
//     {
//         id: 1,
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john.doe@example.com',
//         photoUrl: 'https://via.placeholder.com/150'
//     },
//     {
//         id: 2,
//         firstName: 'Jane',
//         lastName: 'Doe',
//         email: 'jane.doe@example.com',
//         photoUrl: null
//     }
// ];

// const membersContainer = document.getElementById('members-container');

// members.forEach(member => {
//     const card = document.createElement('div');
//     card.classList.add('member-card');

//     const photo = document.createElement('img');
//     photo.src = member.photoUrl || 'https://via.placeholder.com/150';
//     card.appendChild(photo);

//     const name = document.createElement('h2');
//     name.textContent = `${member.firstName} ${member.lastName}`;
//     card.appendChild(name);

//     const email = document.createElement('p');
//     email.textContent = member.email;
//     card.appendChild(email);

//     const deleteBtn = document.createElement('button');
//     deleteBtn.classList.add('delete-btn');
//     deleteBtn.textContent = 'Supprimer';
//     deleteBtn.addEventListener('click', () => {
//         // Code pour supprimer le membre du groupe
//         card.remove();
//     });
//     card.appendChild(deleteBtn);

//     membersContainer.appendChild(card);
// });