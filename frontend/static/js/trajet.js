const nbTrajets = document.getElementById("nbtrajets");
const type = document.getElementById("type");
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

const nbPlacesInput = document.getElementById("nbPlacesInput");
const commentary = document.getElementById("commentary");


// Récuperer infos trajet
fetch(`/trajet/trajet/${id}`, {
    method: 'POST'
})
.then(response => response.json())
.then(data => {
    console.log(data);
    type.innerHTML = data.typeTrajet;
    depart.innerHTML = data.villeDepart;
    arrivee.innerHTML = data.villeArrivee;
    placesRestantes.innerHTML = data.nbPlacesRestantes;
    heure.innerHTML = data.heureDepart;
    places.innerHTML = data.nbPlaces;
    date.innerHTML = data.dateDepart;
    prix.innerHTML = data.prix + prix.innerHTML;
    infoLieu.innerHTML = data.precisionRdv;
    contraintes.innerHTML = data.commentaires;
    nbPlacesInput.max = data.nbPlacesRestantes;
})
.catch(error => console.error(error));

// Récuperer infos comptes
fetch(`/trajet/conducteur/${id}`, {
    method: 'POST'
})
.then(response1 => response1.json())
.then(async data1 => { 
    nameUser.innerHTML = data1.nomCompte + " " + data1.prenomCompte;

    await checkCurrentUser(data1.idCompte).then(result => {
      if (result) {
        document.getElementById("btnAsk").disabled = true;
      }
    });    

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


async function checkCurrentUser(id){
  try {
    const response = await fetch("/compte/getInfoCompte/" + getCookieToken());
    if (!response.ok) {
      throw new Error("Erreur lors de l'appel à la fonction get_users: " + response.statusText);
    }
    const data = await response.json();
    nbTrajets.innerHTML = data.nbtrajets + nbTrajets.innerHTML;
    nbNotes.innerHTML = data.nbnotes + nbNotes.innerHTML;
    return data.idCompte === id;
  } catch (error) {
    console.error(error);
    return false;
  }
}


function openPopup() {
    document.getElementById("popup-container").style.display = "block";
    //document.body.classList.add("flou");
}

function closePopup() {
    document.getElementById("popup-container").style.display = "none";
    //document.body.classList.remove("flou");
}

function askJourney(event){
    event.preventDefault(); // Prevent the default behavior of the button click
  fetch(`/trajet/demandeTrajet/${getCookieToken()}/${id}/${nbPlacesInput.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'commentaire': commentary.value
    })
  })
  .then(response => {
    if (response.ok) {
        document.getElementById('popup').innerHTML = "<p>Le message a bien été envoyé</p><button class='btn btn-success btn-block text-white' onclick='closePopup()'>Fermer</button>";
      return response.json();
    } else {
      document.getElementById('popup').innerHTML = "<p>Le message n'a pas été envoyé</p><button class='btn btn-success btn-block text-white' onclick='closePopup()'>Fermer</button>";
      throw new Error('Erreur : ' + response.status);
    }
  })
  .then(data => {

  })
  .catch(error => {
    console.error('Erreur : ' + error.message);
  });
}