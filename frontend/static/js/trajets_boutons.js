$(function () {
    console.log("ready!");



});



$(document).on('click', '.edit-btn', function () {

    console.log('Le bouton "Modifier" a été cliqué.');
    let id = $(this).attr('id');
    console.log(id);
    // Récupérer l'URL existante
    let u = new URL(window.location.href);
    u.searchParams.delete("id");

    let url = new URL(window.location.href);

    console.log(url);

    url.pathname = '/trajet/modifier_trajet';
    // Ajouter un paramètre "id" à l'URL
    url.searchParams.set("id", id);


    // console.log(url);
    // window.location.href = url.href;




    // Rediriger vers la nouvelle URL avec le paramètre "id"
    window.location.href = url.href;

    // window.location.href = '/trajet/modifier_trajet' + '/' + id;

});


$(document).on('click', '.delete-btn', function () {

    let token = getCookieToken();
    console.log('token1 : ' + token);
    console.log('Le bouton "Supprimer" a été cliqué.');
    // let id = $(this).attr('id');
    let id = parseInt($(this).attr('id'));
    console.log(typeof id);

    let url = "/trajet/deleteTrajet/" + token + "/" + id;
    fetch('/trajet/trajet/' + id, {
        method: 'POST'
    })
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Network response was not ok');
            }
            return reponse.json();

        })
        .then(data => {

            // Affectation du trajet à la variable trajet
            trajet = data;
            date = trajet.dateDepart;

            // Créer une date à partir de la date de départ du trajet
            let targetDate = new Date(date);

            // Créer une date à partir de maintenant
            let now = new Date();

            // Calcule la différence entre les deux dates
            let diffMs = now.getTime() - targetDate.getTime();

            // Vérifie si le trajet est à plus de 3 heures
            let is24HoursOrMore = diffMs >= 24 * 60 * 60 * 1000;

            // Si le trajet est à plus de 3 heures, on peut le terminer
            if (is24HoursOrMore) {
                if (window.confirm("Etes-vous sûr de vouloir supprimer ce trajet ? ")) {
                    fetch(url)
                        .then(reponse => {
                            if (!reponse.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return reponse.json();

                        })
                        .then(data => {
                            console.log("On retire le trajet " + id);
                            window.location.href = '/trajet/mes_trajets';

                        })
                        .catch(error => {
                            console.error(error);
                        })
                }
            }else {
                alert("Un trajet ne peut pas être supprimé moins de 24h avant son départ");
            }

        });





});



$(document).on('click', '.details-btn', function () {
    console.log('Le bouton "details" a été cliqué.');
    let id = $(this).attr('id');
    console.log(id);
    let u = new URL(window.location.href);
    u.searchParams.delete("id");

    let url = new URL(window.location.href);

    console.log(url);

    url.pathname = '/trajet/participants';
    // Ajouter un paramètre "id" à l'URL
    url.searchParams.set("id", id);


    // console.log(url);
    // window.location.href = url.href;




    // Rediriger vers la nouvelle URL avec le paramètre "id"
    window.location.href = url.href;
});

$(document).on('click', '.cancel-btn', function () {
    console.log('Le bouton "cancel" a été cliqué.');


    let token = getCookieToken();
    console.log('token1 : ' + token);

    // let id = $(this).attr('id');
    let id = parseInt($(this).attr('id'));




    let url = "/trajet/quitterTrajet/" + token + "/" + id;
    console.log(url);
    if (window.confirm("Etes-vous sûr de vouloir annuler votre participation à ce trajet ? ")) {
        fetch(url)
            .then(reponse => {
                if (!reponse.ok) {
                    throw new Error('Network response was not ok');
                }
                return reponse.json();

            })
            .then(data => {
                console.log("On se retire du trajet " + id);
                window.location.href = '/trajet/mes_trajets';

            })
            .catch(error => {
                console.error(error);
            })
    }
});

$(document).on('click', '.confirm-btn', function () {
    // Récupérer le token de l'utilisateur et l'id du trajet
    let token = getCookieToken();
    let id = $(this).attr('id');

    fetch('/trajet/trajet/' + id, {
        method: 'POST'
    })
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Network response was not ok');
            }
            return reponse.json();

        })
        .then(data => {
            alert("Vous souhaitez confirmez ?");

            // Affectation du trajet à la variable trajet
            trajet = data;
            date = trajet.dateDepart;

            // Créer une date à partir de la date de départ du trajet
            let targetDate = new Date(date);

            // Créer une date à partir de maintenant
            let now = new Date();

            // Calcule la différence entre les deux dates
            let diffMs = now.getTime() - targetDate.getTime();

            // Vérifie si le trajet est à plus de 3 heures
            let is3HoursOrMore = diffMs >= 60 * 60 * 1000;

            // Si le trajet est à plus de 3 heures, on peut le terminer
            if (is3HoursOrMore) {
                fetch('trajet/terminerTrajet/' + token + '/' + id, {
                    method: 'POST'
                })
                    .then(reponse => {
                        if (!reponse.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return reponse.json();

                    })
                    .then(data => {
                        alert("Le trajet a été terminé");
                        window.location.href = '/trajet/mes_trajets';
                    })
            } else {
                alert("Un trajet ne peut pas être annulé moins de 24h avant son départ");
            }

        });
});