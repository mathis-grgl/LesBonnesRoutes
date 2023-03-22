let url = null;
let id = null;

$(document).ready(function () {
    // Récupération du token admin
    token = getCookieToken();

    // Si le token est null, on redirige vers la page de connexion
    if (token == null) {
        window.location.href = "../../../login_signup";
    }

    else {

        // get last character of url
        let urlLink = window.location.href;
        id = urlLink.charAt(urlLink.length - 1);


        // Si l'id de l'utilisateur est null, on affiche une alerte et on redirige vers la page de gestion des comptes
        if (!id.match(/^[0-9]+$/)) {
            alert("Veuillez sélectionner un trajet");
            window.location.href = "../../search-route";
        }
    }

    url = '/admin/modifTrajet/' + token + '/' + id;

    // Menu deroulant ville de départ
    const select = document.querySelector("select[name='villeDepart']");

    if (select === null) {
        console.log("select null");
    }
    else {
        fetch('/admin/villes')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erreur : ' + response.status);
                }
            })
            .then(data => {
                console.log(data.length);
                // data contient un tableau avec les noms de toutes les villes
                data.forEach(res => {
                    const city = document.createElement('option');
                    city.value = res;
                    city.innerText = res;
                    select.appendChild(city);
                });
                // faire quelque chose avec les données
            })
            .catch(error => {
                console.error('Erreur : ' + error.message);
            });
    }

    // Menu deroulant ville d'arrivée
    const select1 = document.querySelector("select[name='villeArrivee']");

    if (select1 === null) {
        console.log("select null");
    }
    else {
        fetch('/admin/villes')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erreur : ' + response.status);
                }
            })
            .then(data => {
                // data contient un tableau avec les noms de toutes les villes
                data.forEach(res => {
                    const city = document.createElement('option');
                    city.value = res;
                    city.innerText = res;
                    select1.appendChild(city);
                });
                // faire quelque chose avec les données
            })
            .catch(error => {
                console.error('Erreur : ' + error.message);
            });
    }

    fetch('/admin/trajets/' + token + '/' + id)
        .then(response => {
            if (!response.ok) {
                alert('Le trajet n\'existe pas');
                window.location.href = "../../search-route";
                throw new Error('Erreur : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.idTrajet == id) {
                $('#city_start').val(data.villeDepart);
                $('#city_end').val(data.villeArrivee);
                if(data.heureDepart.length < 5) data.heureDepart = "0" + data.heureDepart;
                console.log('heure : ' + data.heureDepart.replace('h', ':'))
                $('#heure-depart').val(data.heureDepart.replace('h', ':'));
                console.log('nbPlaces : ' + data.nbPlacesRestantes);
                console.log('prix : ' + data.prix);

                $('#nb-places').val(data.nbPlacesRestantes);
                $('#prix-place').val(data.prix);
                $('#commentaires').val(data.commentaires);
                $('#precision').val(data.precisionRdv);

                let date = data.dateDepart;
                console.log(date);
                let dateObject = moment(date, 'D MMMM, YYYY');

                let dateFormatted = dateObject.format('YYYY-MM-DD');
                console.log(dateFormatted);

                $('#date-depart').val(dateFormatted);
            }
        })
        .catch(error => {
            console.error('Erreur : ' + error.message);
        });
});


$('#editTrajet').submit(function (event) {
    event.preventDefault();

    let valide = true;
    console.log("on a cliqué sur modif trajet.");
    let heure = $('#heure-depart').val();
    let date = $('#date-depart').val();
    let dateObject = moment(date, 'YYYY-MM-DD');


    let today = new Date();
    let todayms = today.getTime();
    let dateString = date + "T" + heure + ":00Z";
    console.log(dateString);

    let autreDate = new Date(dateString);
    console.log(autreDate);
    let autreDateMS = autreDate.getTime();


    let differenceMS = autreDateMS - todayms;

    let dateFormatted;
    if (differenceMS > (24 * 60 * 60 * 1000)) {
        // Il y a plus de 24 heures d'écart entre les deux dates
        console.log("Il y a plus de 24 heures d'écart entre la date d'aujourd'hui et l'autre date.");
        dateFormatted = dateObject.format('D MMMM, YYYY');

    } else {
        // Il n'y a pas plus de 24 heures d'écart entre les deux dates
        valide = false;
        $('#date-depart').css('border', '2px solid red');
        $('#1').empty();
        $('#1').append($('<b>').text("La date doit être dans plus de 24h."));
    }

    let nbPlacesRestantes = $('#nb-places').val();
    let prix = $('#prix-place').val();
    let commentaires = $('#commentaires').val();
    let precision = $('#precision').val();
    let vd = $('#city_start').val();
    let va = $('#city_end').val();

    if (nbPlacesRestantes <= 0) {
        valide = false;
        $('#nb-places').css('border', '2px solid red');
        $('#2').empty();
        $('#2').append($('<b>').text("Vous devez rentrer un nombre de places positif."));


    }

    if (prix < 0) {
        valide = false;
        $('#prix-place').css('border', '2px solid red');
        $('#3').empty();
        $('#3').append($('<b>').text("Vous devez rentrer un prix positif."));
    }


    if (valide) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'heureDepart': heure,
                'dateDepart': dateFormatted,
                'nbPlaces': nbPlacesRestantes,
                'prix': prix,
                'commentaires': commentaires,
                'precisionRdv': precision,
                'villeDepart': vd,
                'villeArrivee': va
            })
        })
            .then(reponse => {
                if (reponse.ok) {
                    window.location.href = '/admin/search-route';
                } else {
                    throw new Error('Network response was not ok');
                }

            }).catch(error => {
                console.error(error);
            });

    } else {
        alert("Il y a un problème avec le formulaire.")
    }
})
