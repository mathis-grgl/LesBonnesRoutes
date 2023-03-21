
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
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });

}