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

    console.log("on a cliqué sur modif trajet.");
    let heure = $('#heure-depart').val();
    let date = $('#date-depart').val();
    let dateObject = moment(date, 'YYYY-MM-DD');

    // let dateObject = moment(date, 'YYYY/MM/DD');
    let dateFormatted = dateObject.format('D MMMM, YYYY');
    let nbPlaces = $('#nb-places').val();
    let prix = $('#prix-place').val();
    let commentaires = $('#commentaires').val();
    let precision = $('#precision').val();
    let vd = $('#city_start').val();
    let va = $('#city_end').val();



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
    // /modifTrajet/<string:token>/<int:idTrajet>'



    // window.location.href = '/mes_trajets';



})
