const token = getCookieToken();

// const infoCompteCo = '/compte/getInfoCompte/'+token;

// let userco = [];

// fetch(infoCompteCo)
// .then(reponse => {
//     if(!reponse.ok){
//         throw new Error("network wasnt ok");
//     }
//     return reponse.json();
// })
// .then(data =>{
//     userco = data;
//     console.log(userco);
// })
// .catch(error =>{
//     console.error(error);
// })

// const url = '/admin/users';

// function charger_users() {

//     fetch(url)
//         .then(reponse => {
//             if (!reponse.ok) {
//                 throw new Error("network wasnt ok");

//             }
//             return reponse.json();
//         })
//         .then(data => {
//             console.log(data);
//             const $select = $('#select-users');
//             $.each(data, function (index, user) {
//                 if (user.nomCompte !== "ADMIN" && userco.nomCompte !== user.nomCompte) {
//                     $select.append('<option value="' + user.nomCompte + " " + user.prenomCompte + '">' + user.nomCompte + " " + user.prenomCompte + '</option>');
//                 }
//             });
//         })
//         .catch(error => {
//             console.error(error);
//         })

// }

$('#creer_groupe').submit(function (event) {
    event.preventDefault(); // pour empêcher la soumission normale du formulaire

    let nomGroupe = $('#group-name').val();
    console.log(nomGroupe);

    // Récupérer toutes les valeurs sélectionnées dans le select
    const url = '/ami/createGroupe/' + token;
    console.log(url);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'nomGroupe': nomGroupe

        })
    })
        .then(reponse => {
            if (reponse.ok) {

                window.location.href = '/ami/groupes';
            } else {
                alert("pb");

            }
        })
        .catch(error => {
            console.error(error);
        });


    // Faire quelque chose avec les valeurs sélectionnées

    // Envoyer les données au serveur, etc.
});
