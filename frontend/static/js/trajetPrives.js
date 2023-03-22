
let token = getCookieToken();

const urlParams = new URLSearchParams(window.location.search);
const idGroupe = parseInt(urlParams.get('id'));
console.log(idGroupe);

let url = '/ami/getTrajetsGroupe/' + token + '/' + idGroupe;


function charger_trajetsPrives(){
    console.log("teststststtsts");
    fetch(url)
    .then(reponse => {
        if(!reponse.ok){
            throw new Error(reponse.statusText);
        }
        return reponse.json();
    })
    .then(data => {
        let table = $('#trajets');
        let tbody = $("<tbody>");
        for(let i = 0; i < data.length ; i++){
            let trajet = data[i];
            console.log(trajet);

        }
    })
    .catch(error => {
        console.error(error);
    });

}