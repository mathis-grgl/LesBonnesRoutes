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


    let dateParts = date.split('-');
    let jour = dateParts[0];
    let annee = dateParts[2];
    let mois = dateParts[1] - 1;
    //let dateFormatted = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

    let dateObject = moment(date, 'YYYY/MM/DD');
    let dateFormatted = dateObject.format('D MMMM, YYYY');


    console.log('test : ' + dateFormatted);

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
                alert("Votre trajet a bien été créé.");
                window.location.href = '/mes_trajets';
            } else {
                alert("Probleme dans le fetch");

            }

        }).catch(error => {
            console.error(error);
        });








});