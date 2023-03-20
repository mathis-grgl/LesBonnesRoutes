const token = getCookieToken();

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
            if (reponse.ok){

                window.location.href = '/ami/groupes';
            } else {
                alert("pb");

            }
        })
        .catch(error => {
            console.error(error);
        });
});
