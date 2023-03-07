const nbTrajets = document.getElementById("nbtrajets");
const nbNotes = document.getElementById("nbnotes");
const nameUser = document.getElementById("prenom");
const depart = document.getElementById("depart");
const arrivee = document.getElementById("arrivee");
const placesRestantes = document.getElementById("placesRestantes");
const heure = document.getElementById("heure");
const places = document.getElementById("places");
const date = document.getElementById("date");
const prix = document.getElementById("prix");
const infoLieu = document.getElementById("infoLieu");
const contraintes = document.getElementById("contraintes");
const lieu = document.getElementById("lieu");


// Récuperer infos trajet
fetch(`/trajet/trajet/${id}`, {
    method: 'POST'
})
.then(response => response.json())
.then(data => {
    console.log(data);
    depart.innerHTML = data.villeDepart;
    arrivee.innerHTML = data.villeArrivee;
    placesRestantes.innerHTML = data.nbPlacesRestantes;
    heure.innerHTML = data.heureDepart;
    places.innerHTML = data.nbPlaces;
    date.innerHTML = data.dateDepart;
    prix.innerHTML = data.prix + prix.innerHTML;
    infoLieu.innerHTML = data.precisionRdv;
    contraintes.innerHTML = data.commentaires;
})
.catch(error => console.error(error));

// Récuperer infos comptes
fetch(`/trajet/conducteur/${id}`, {
    method: 'POST'
})
.then(response1 => response1.json())
.then(data1 => {
    //console.log(data);
    /*nbTrajets.innerHTML = data1.nbtrajets + nbTrajets.innerHTML;
    nbNotes.innerHTML = data1.nbnotes + nbNotes.innerHTML;*/
    nameUser.innerHTML = data1.nomCompte + " " + data1.prenomCompte;

    switch(data1.noteCompte){
        case 1:
            document.getElementById("rating-star-1").style = "opacity: 100;";

        case 2:
            document.getElementById("rating-star-2").style = "opacity: 100;";

        case 3:
            document.getElementById("rating-star-3").style = "opacity: 100;";

        case 4:
            document.getElementById("rating-star-4").style = "opacity: 100;";

        case 5:
            document.getElementById("rating-star-5").style = "opacity: 100;";
            break;
    }
})
.catch(error1 => console.error(error1));

function openPopup() {
    document.getElementById("popup-container").style.display = "block";
    //document.body.classList.add("flou");
}

function closePopup() {
    document.getElementById("popup-container").style.display = "none";
    //document.body.classList.remove("flou");
}