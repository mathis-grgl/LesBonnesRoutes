let token = getCookieToken();
const urlParams = new URLSearchParams(window.location.search);
const lastChar = parseInt(urlParams.get('id'));
// const test = window.location.href;
// const lastChar = parseInt(test.charAt(test.length - 1));
console.log(lastChar);

const url = '/ami/getGroupes/' + token;

function charger_groupe() {
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("network issue");
            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (data[i].idGroupe == lastChar) {
                    console.log("on est ici");
                    $('#group-name').val(data[i].nomGroupe);
                }

            }

        })
        .catch(error => {
            console.error(error);
        });
}


$('#modifier_groupe').submit(function (event) {
    event.preventDefault(); // pour empêcher la soumission normale du formulaire

    let nomGroupe = $('#group-name').val();
    console.log(nomGroupe);

    // Récupérer toutes les valeurs sélectionnées dans le select
    const urlmodif = '/ami/modifNom/' + token + '/' + lastChar;
    console.log(urlmodif);
    console.log(urlmodif);
    fetch(urlmodif, {
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
                alert("network issue");

            }
        })
        .catch(error => {
            console.error(error);
        });
});