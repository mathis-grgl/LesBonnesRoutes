const token = getCookieToken();
const createTrajetURL = '/trajet/createTrajet/' + token;

const url = '/ami/getGroupes/' + token;

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
            (data.length);
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

let typeTrajet = "";

$(document).ready(function () {
    $('input[name="amis"]').on('change', function () {
        if ($(this).val() === "oui") {
            typeTrajet = "Prive";
            fetch(url)
            .then(reponse => {
                if(!reponse.ok){
                    throw new Error(reponse.statusText);
                }
                return reponse.json();
            })
            .then(data => {
                console.log(data);
                $('#groupes-amis').empty();
                data.forEach(res => {
                    $('#groupes-amis').append('<option value="' + res.idGroupe + '">' + res.nomGroupe + '</option>');
                })
            })
            .catch(error => {
                console.error(error);
            });
            
            $('#select-amis').show();
        } else {
            typeTrajet = "Public";
            $('#select-amis').hide();
        }
    });
});





$('#forminput').submit(function (event) {
    event.preventDefault();

    let val = parseInt($('#groupes-amis').val());
    console.log(val);

    let valide = true;

    let date = $('#date-depart').val();
    let vd = $('#city_start').val();
    let va = $('#city_end').val();
    let heure = $('#heure-depart').val().replace(':', 'h');
    let nbPlaces = $('#nb-places').val();
    let prix = $('#prix-place').val();
    let commentaires = $('#commentaires').val();
    let precision = $('#precision').val();

    if (nbPlaces < 1) {
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




    let dateObject = moment(date, 'YYYY/MM/DD');
    let dateFormatted = dateObject.format('D MMMM, YYYY');

    let today = new Date();
    let todayms = today.getTime();
    let dateString = date + "T" + $('#heure-depart').val() + ":00Z";

    let autreDate = new Date(dateString);
    let autreDateMS = autreDate.getTime();


    let differenceMS = autreDateMS - todayms;

    if (differenceMS > (24 * 60 * 60 * 1000)) {
        // Il y a plus de 24 heures d'écart entre les deux dates
        console.log("Il y a plus de 24 heures d'écart entre la date d'aujourd'hui et l'autre date.");
    } else {
        // Il n'y a pas plus de 24 heures d'écart entre les deux dates
        valide = false;
        $('#date-depart').css('border', '2px solid red');
        $('#1').empty();
        $('#1').append($('<b>').text("La date doit être dans plus de 24h."));
    }

    if (valide) {

        fetch(createTrajetURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'heureDepart': heure,
                'dateDepart': dateFormatted,
                'nbPlaces': nbPlaces,
                'prix': prix,
                'commentaires': commentaires,
                'precisionRdv': precision,
                'villeDepart': vd,
                'villeArrivee': va,
                'typeTrajet' : typeTrajet,
                'idGroupe' : val

            })
        })
            .then(reponse => {
                if (reponse.ok) {

                    window.location.href = '/trajet/mes_trajets';
                } else {
                    alert("Probleme dans le fetch");

                }

            }).catch(error => {
                console.error(error);
            });

    } else {
        alert('Certains champs sont mal remplis dans le formulaire.');
    }







});