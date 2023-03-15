const token = getCookieToken();
console.log(token);
const createTrajetURL = 'trajet/createTrajet/' + token;

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




$('#forminput').submit(function (event) {
    event.preventDefault();

    let valide = true;

    let date = $('#date-depart').val();
    console.log(date);
    let vd = $('#city_start').val();
    console.log(vd);
    let va = $('#city_end').val();
    console.log(va);
    let heure = $('#heure-depart').val().replace(':', 'h');
    console.log(heure);
    let nbPlaces = $('#nb-places').val();
    console.log(nbPlaces);
    let prix = $('#prix-place').val();
    console.log(prix);
    let commentaires = $('#commentaires').val();
    console.log(commentaires);
    let precision = $('#precision').val();
    console.log(precision);

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


    let dateParts = date.split('-');
    let jour = dateParts[2];
    let annee = dateParts[2];
    let mois = dateParts[1] - 1;
    //let dateFormatted = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

    let dateObject = moment(date, 'YYYY/MM/DD');
    let dateFormatted = dateObject.format('D MMMM, YYYY');

    let today = new Date();
    let tjour = today.getDate();
    let diff = jour - tjour;
    console.log('voici la diff : ' + diff);
    


    // let diff = date2.getTime() - date1.getTime();

    // Convertir la différence en heures
    

    // Vérifier si la différence est supérieure à 24 heures
    if (diff > 1) {
        console.log('Les deux dates sont espacées d\'au moins 24 heures');
    } else {
        valide = false; 
        console.log('Les deux dates sont espacées de moins de 24 heures');
        $('#date-depart').css('border', '2px solid red');
        $('#1').empty();
        $('#1').append($('<b>').text("La date doit être dans plus de 24h."));
    }



    console.log('test : ' + dateFormatted);

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
                'villeArrivee': va
            })
        })
            .then(reponse => {
                if (reponse.ok) {

                    window.location.href = '/mes_trajets';
                } else {
                    alert("Probleme dans le fetch");

                }

            }).catch(error => {
                console.error(error);
            });

    }else{
        alert('Certains champs sont mal remplis dans le formulaire.');
    }







});