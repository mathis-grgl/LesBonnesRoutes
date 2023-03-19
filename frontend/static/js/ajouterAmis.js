const token = getCookieToken();
const test = window.location.href;
const lastChar = parseInt(test.charAt(test.length - 1));
console.log(lastChar);

const infoCompteCo = '/compte/getInfoCompte/' + token;

const getMembres = '/ami/getMembers/' + lastChar;

let membres = [];


fetch(getMembres)
    .then(reponse => {
        if (!reponse.ok) {
            throw new Error('network issue');
        }
        return reponse.json();
    })
    .then(data => {
        console.log("voici la liste des membres du groupe : ");
        console.log(data);
        membres = data;
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
        console.log("data");
        console.log(data);

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
            const addedNames = []; // tableau pour stocker les noms des personnes déjà ajoutées

            $.each(data, function (index, user) {
                const prenomUser = user.nomCompte;
                for (let i = 0; i < membres.length; i++) {
                    if (!addedNames.includes(prenomUser) && prenomUser !== "ADMIN" && userco.nomCompte !== prenomUser && membres[i].nomCompte !== prenomUser) {
                        $select.append('<option value="' + user.idCompte + '">' + user.nomCompte + " " + user.prenomCompte + '</option>');
                        addedNames.push(prenomUser); // ajouter le nom à la liste des noms déjà ajoutés
                    }

                }

            });
            // $.each(data, function (index, user) {
            //     let prenomUser = user.nomCompte;
            //     console.log(prenomUser);
            //     for (let i = 0; i < membres.length; i++) {
            //         if (user.nomCompte !== "ADMIN" && userco.nomCompte !== user.nomCompte && membres[i].nomCompte !== prenomUser) {
            //             $select.append('<option value="' + user.idCompte + '">' + user.nomCompte + " " + user.prenomCompte + '</option>');
            //         }

            //     }

            // });
        })
        .catch(error => {
            console.error(error);
        })

}


// $('#ajouter_amis').submit(function (event) {
//     event.preventDefault(); // pour empêcher la soumission normale du formulaire

//     const selectedValues = $('#select-users').val();

//     // Faire quelque chose avec les valeurs sélectionnées
//     console.log('Les valeurs sélectionnées sont : ', selectedValues);
//     console.log(selectedValues.length);
//     // for(let i = 0; i < selectedValues.length; i++){
//     //     let personne = parseInt(selectedValues[i]);
//     //     let url = '/ami/addMember/' + token + '/' + lastChar + '/' + personne;
//     //     // fetch(url)
//     //     // .then(reponse => {
//     //     //     if(!reponse.ok){
//     //     //         throw new Error("network not ok");
//     //     //     }
//     //     //     return reponse.json();
//     //     // })
//     //     // .catch(error => {
//     //     //     console.error(error);
//     //     // });
//     //     console.log(personne);
//     // }

//     window.location.href = '/ami/groupes';


// });



