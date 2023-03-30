const token = getCookieToken();
const urlParams = new URLSearchParams(window.location.search);
const idGroupe = parseInt(urlParams.get('id'));
// const test = window.location.href;
// const idGroupe = parseInt(test.charAt(test.length - 1));
console.log(idGroupe);

const infoCompteCo = '/compte/getInfoCompte/' + token;

const getMembres = '/ami/getMembers/' + idGroupe;

// let membres = [];
const membersNames = [];


fetch(getMembres)
    .then(reponse => {
        if (!reponse.ok) {
            throw new Error('network issue');
        }
        return reponse.json();
    })
    .then(data => {
        console.log(data);
        membres = data;
        for (let i = 0; i < membres.length; i++) {
            membersNames.push(membres[i].nomCompte);
        }
        console.log(membersNames);
    })
    .catch(error => {
        console.error(error);
    });

let userco = [];

fetch(infoCompteCo)
    .then(reponse => {
        if (!reponse.ok) {
            throw new Error("network wasnt ok");
        }
        return reponse.json();
    })
    .then(data => {
        userco = data;

    })
    .catch(error => {
        console.error(error);
    })

const url = '/admin/users';

function charger_users() {

    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("network wasnt ok");

            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);
            const $select = $('#select-users');
            $select.append('<option value="' + 0 + '">' + " " + '</option>')
            const addedNames = []; // tableau pour stocker les noms des personnes déjà ajoutées
            $.each(data, function (index, user) {
                const prenomUser = user.nomCompte;
                console.log(prenomUser);

                // console.log(membres.includes(prenomUser));

                if (!addedNames.includes(prenomUser) && prenomUser !== "ADMIN" && userco.nomCompte !== prenomUser && !membersNames.includes(prenomUser)) {
                    $select.append('<option value="' + user.idCompte + '">' + user.nomCompte + " " + user.prenomCompte + '</option>');
                    addedNames.push(prenomUser); // ajouter le nom à la liste des noms déjà ajoutés
                }



            });
        })
        .catch(error => {
            console.error(error);
        })

}

$(document).ready(function() {
    $('#select-users').select2();
 });


$('#ajouter_amis').submit(function (event) {
    event.preventDefault(); // pour empêcher la soumission normale du formulaire

    // const selectedValues = $('#select-users').val();
    const selectedValues = $('#select-users').select2('data');

    // Faire quelque chose avec les valeurs sélectionnées
    console.log('Les valeurs sélectionnées sont : ', selectedValues);
    console.log(selectedValues.length);
    
    let idAmi = parseInt(selectedValues[0].id);
    let url = '/ami/addMember/' + token + '/' + idGroupe + '/' + idAmi;

    // for(let i = 0; i < selectedValues.length; i++){
    //     let idAmi = parseInt(selectedValues[i]);
    //     let url = '/ami/addMember/' + token + '/' + idGroupe ;

    console.log(url);
    fetch(url, {method: 'GET'})
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(reponse.statusText);
            }else{
                window.location.href = '/ami/groupes';
            }
            return reponse.json();
        })
        .catch(error => {
            console.error(error);
        });
    console.log(idAmi);
    // }

    


});



