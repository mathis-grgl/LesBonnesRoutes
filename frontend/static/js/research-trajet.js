// Afficher les offres du moment
fetch("/admin/trajets/Public")
  .then(response => response.json())
  .then(data => {
    displayTrajet(data);
  })
  .catch(error => {
    console.error('Une erreur est survenue :', error);
  });

// Bouton rechercher
const btnResearch = document.getElementById("btn-research");


// Champs de recherche
const villeDepart = document.querySelector("select[name=city-start]");
const villeArrivee = document.querySelector("select[name=city-end]");
const date = document.querySelector("input[name=date]");
const places = document.querySelector("select[name=places]");
const prixInferieur = document.querySelector("input[name=lower-prices]");
const prixSuperieur = document.querySelector("input[name=higher-prices]");

// Offre du moment
const offres = document.querySelector("div[id=next]");

function displayOffer(event){
    const titreOffre = document.querySelector("[name='title-offer']");
    const descriptionOffres = document.querySelector("[name='description-offer']");

    event.preventDefault(); // Prevent the default behavior of the button click
    /*console.log("Depart : " + villeDepart.value);
    console.log("Arrivée : " + villeArrivee.value);
    console.log("Date : " + date.value);
    console.log("Places : " + places.value);
    console.log("Prix < : " + prixInferieur.value);
    console.log("Prix > : " + prixSuperieur.value);*/
    // Retirer l'attribut 'onclick' du bouton recherche pour eviter bug
    btnResearch.removeAttribute('onclick');

    fetch(`/trajet/recherche/${getCookieToken()}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        'city-start': villeDepart.value,
        'city-end': villeArrivee.value,
        'date': date.value,
        'places': places.value,
        'lower-prices': prixInferieur.value,
        'higher-prices': prixSuperieur.value
        })
    })
    .then(response => {
        if (response.ok) {
        return response.json();
        } else {
          titreOffre.innerHTML = "Aucun trajet correspondant";
        throw new Error('Erreur : ' + response.status);
        }
    })
    .then(async data => {
        if (data.length === 0){
          titreOffre.innerHTML = "Aucun trajet correspondant";
        } else {
          titreOffre.innerHTML = "Trajets correspondants";
          descriptionOffres.innerHTML = "Retrouvez ici les offres de trajets correspondantes.";
        }
        
        await displayTrajet(data);

        //On remet 'onclick' du bouton recherche pour eviter bug
        btnResearch.setAttribute('onclick', 'displayOffer(event)');
    })
    .catch(error => {
        //On remet 'onclick' du bouton recherche pour eviter bug
        btnResearch.setAttribute('onclick', 'displayOffer(event)');
        titreOffre.innerHTML = "Aucun trajet correspondant";
        console.error('Erreur : ' + error.message);
    });
}


async function displayTrajet(trajets) {
  const trajetsContainer = document.getElementById('display');
  trajetsContainer.innerHTML = "";

  const trajetsPrives = trajets.filter(trajet => trajet.typeTrajet === "prive");
  const trajetsPublics = trajets.filter(trajet => trajet.typeTrajet === "public");

  const tousLesTrajets = trajetsPrives;
  tousLesTrajets.push(...trajetsPublics);
  const trajetRow = document.createElement('div');
  trajetRow.classList.add('row');
  const trajetRow1 = document.createElement('div');
  trajetRow1.classList.add('row');

  let trajetsPrivesAdded = false;
  let trajetsPublicsAdded = false;

  for (const trajet of tousLesTrajets) {
    const worker = new Worker('/static/js/displayTrajet.worker.js');

    worker.postMessage(trajet);

    worker.onmessage = function(event) {
      const trajetElement = document.createElement('div');
      trajetElement.classList.add('col-md-6', 'col-lg-4');
      if (trajet.typeTrajet === "prive" && !trajetsPrivesAdded) {
        trajetsContainer.innerHTML = `<h2>Trajets privés</h2>`;
        trajetsContainer.appendChild(trajetRow);
        trajetsPrivesAdded = true;
      } else if (trajet.typeTrajet === "public" && !trajetsPublicsAdded) {
        trajetsContainer.innerHTML += `<h2>Trajets publics</h2>`;
        trajetsContainer.appendChild(trajetRow1);
        trajetsPublicsAdded = true;
      }

      trajetElement.innerHTML = event.data;

      if (trajet.typeTrajet === "prive"){
        trajetRow.appendChild(trajetElement);
        trajetsContainer.appendChild(trajetRow);
      } else if (trajet.typeTrajet === "public"){
        trajetRow1.appendChild(trajetElement);
        trajetsContainer.appendChild(trajetRow1);
      }
    };
  }
}


// Menu deroulant ville de départ
const select = document.querySelector("select[name='city-start']");

if(select === null){
  console.log("select null");
}
else
{
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
const select1 = document.querySelector("select[name='city-end']");

if(select1 === null){
  console.log("select null");
}
else
{
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