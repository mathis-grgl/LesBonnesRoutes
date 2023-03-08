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

    url.pathname = '/modifier_trajet';
    // Ajouter un paramètre "id" à l'URL
    url.searchParams.set("id", id);
    

    // console.log(url);
    // window.location.href = url.href;

    


    // Rediriger vers la nouvelle URL avec le paramètre "id"
    window.location.href = url.href;

    // window.location.href = '/modifier_trajet' + '/' + id;

});


$(document).on('click', '.delete-btn', function () {

    let token = getCookieToken();
    console.log('token1 : ' + token);
    console.log('Le bouton "Supprimer" a été cliqué.');
    // let id = $(this).attr('id');
    let id = parseInt($(this).attr('id'));
    console.log(typeof id);

    let url = "/trajet/deleteTrajet/" + token + "/" + id;
    console.log(url);
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
                window.location.href = '/mes_trajets';

            })
            .catch(error => {
                console.error(error);
            })
    }
});



$(document).on('click', '.details-btn', function () {
    console.log('Le bouton "details" a été cliqué.');
    let id = $(this).attr('id');
    console.log(id);
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
                window.location.href = '/mes_trajets';

            })
            .catch(error => {
                console.error(error);
            })
    }
});