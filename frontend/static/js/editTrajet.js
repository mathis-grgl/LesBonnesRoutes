let token = getCookieToken();

// '/modifTrajet/<string:token>/<int:idTrajet>'
const test = window.location.href;
const lastChar = parseInt(test.charAt(test.length - 1));
console.log(lastChar);


const url = '/trajet/modifTrajet/' + token + '/' + lastChar;

const urlInfo = '/trajet/trajetsCompte/' + token;

console.log(url);

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


function chargerInfosTrajets() {
    console.log("On s'apprête à modifier les informations du trajet.");

    fetch(urlInfo)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Network response was not ok');
            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (data[i].idTrajet == lastChar) {
                    console.log('on est ici.');
                    $('#city_start').val(data[i].villeDepart);
                    $('#city_end').val(data[i].villeArrivee);
                    console.log('heure : ' + data[i].heureDepart.replace('h', ':'))
                    $('#heure-depart').val(data[i].heureDepart.replace('h', ':'));
                    console.log('nbPlaces : ' + data[i].nbPlaces);
                    console.log('prix : ' + data[i].prix);

                    $('#nb-places').val(data[i].nbPlaces);
                    $('#prix-place').val(data[i].prix);
                    $('#commentaires').val(data[i].commentaires);
                    $('#precision').val(data[i].precisionRdv);

                    let date = data[i].dateDepart;
                    console.log(date);
                    let dateObject = moment(date, 'D MMMM, YYYY');
                    // let dateObject = moment(date, 'YYYY/MM/DD');

                    let dateFormatted = dateObject.format('YYYY-MM-DD');
                    console.log(dateFormatted);

                    $('#date-depart').val(dateFormatted);


                }
            }
        })
        .catch(error => {
            console.error(error);
        });


}


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


    // let dateObject = moment(date, 'YYYY/MM/DD');

    let nbPlaces = $('#nb-places').val();
    let prix = $('#prix-place').val();
    let commentaires = $('#commentaires').val();
    let precision = $('#precision').val();
    let vd = $('#city_start').val();
    let va = $('#city_end').val();

    if (nbPlaces < 0) {
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
                'nbPlaces': nbPlaces,
                'prix': prix,
                'commentaires': commentaires,
                'precisionRdv': precision,
                'villeDepart': vd,
                'villeArrivee': va
            })
        })
            .then(reponse => {
                if (reponse.ok) {

                    window.location.href = '/mes_trajets';
                } else {
                    throw new Error('Network response was not ok');

                }

            }).catch(error => {
                console.error(error);
            });

    }else{
        alert("Il y a un problème avec le formulaire.")
    }

    // /modifTrajet/<string:token>/<int:idTrajet>'



    // window.location.href = '/mes_trajets';



})
