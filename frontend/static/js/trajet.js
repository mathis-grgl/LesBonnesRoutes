const nbTrajets = document.getElementById("nbtrajets");
const nbNotes = document.getElementById("nbnotes");
const name = document.getElementById("prenom");
const depart = document.getElementById("depart");
const arrivee = document.getElementById("arrivee");
const heure = document.getElementById("heure");
const places = document.getElementById("places");
const date = document.getElementById("date");
const prix = document.getElementById("prix");
const infoLieu = document.getElementById("infoLieu");
const contraintes = document.getElementById("contraintes");
const lieu = document.getElementById("lieu");

fetch(`/trajet/trajet/${id}`, {
    method: 'POST'
})
.then(response => response.json())
.then(data => {
    //console.log(data);
    depart.innerHTML = data.villeDepart;
    arrivee.innerHTML = data.villeArrivee;
    heure.innerHTML = data.heureDepart;
    places.innerHTML = data.nbPlaces;
    date.innerHTML = data.dateDepart;
    prix.innerHTML = data.prix + prix.innerHTML;
    infoLieu = data.precisionRdv;
    contraintes.innerHTML = data.commentaires;
})
.catch(error => console.error(error));