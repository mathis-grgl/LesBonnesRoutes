const token = getCookieToken();
console.log(token);
const url = 'trajet/trajetsCompte/' + token;
console.log(url);


function charger_trajets(){
    console.log("On est appelé.")
    fetch(url)
    .then(reponse => {
        if (!reponse.ok) {
            throw new Error('Network response was not ok');
          }
          return reponse.json();
    })
    .then(data => {
        console.log(data);

    })
    .catch(error => {
        console.error(error);
    })
}