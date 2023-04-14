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
          descriptionOffres.innerHTML = "Voulez vous recevoir une notification dès qu'un trajet est disponible ?" +
            `<div>` +
              `<input type="radio" name="attente" value="oui" oninput="rechercheEnAttente('oui')"> Oui&nbsp;&nbsp;&nbsp;&nbsp;` +
              `<input type="radio" name="attente" value="non" checked> Non` +
            "</div>";
        } else {
          titreOffre.innerHTML = "Trajets correspondants";
          descriptionOffres.innerHTML = "Retrouvez ici les offres de trajets correspondantes.";
        }
        
        await displayTrajet(data);

        // Attendre 2 seconde avant de réactiver le bouton
        setTimeout(() => {
          btnResearch.setAttribute('onclick', 'displayOffer(event)');
        }, 2000);
    })
    .catch(error => {
        //On remet 'onclick' du bouton recherche pour eviter bug
        btnResearch.setAttribute('onclick', 'displayOffer(event)');
        titreOffre.innerHTML = "Aucun trajet correspondant";
        console.error('Erreur : ' + error.message);
    });
}

function rechercheEnAttente(reponse){
  const descriptionOffres = document.querySelector("[name='description-offer']");
  if (reponse === "oui"){
    fetch(`/trajet/rechercheEnAttente/${getCookieToken()}`, {
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
        throw new Error('Erreur : ' + response.status);
      }
  })
  .then(data => {
    if (!descriptionOffres.innerHTML.includes("Paramètre enregistré")) {
      descriptionOffres.innerHTML += "Paramètre enregistré";
    }    
    document.querySelector("input[value='oui']").checked = true;
  })
  .catch(error => {
      console.error('Erreur : ' + error.message);
  });
  }
}


async function displayTrajet(trajets) {
  console.log("Clic rechercher");
  const trajetsContainer = document.getElementById('display');
  trajetsContainer.innerHTML = "";

  const trajetsPrives = trajets.filter(trajet => trajet.typeTrajet === "prive");
  const trajetsPublics = trajets.filter(trajet => trajet.typeTrajet === "public");

  const tousLesTrajets = trajetsPrives;
  tousLesTrajets.push(...trajetsPublics);

  let trajetsPrivesAdded = false;
  let trajetsPublicsAdded = false;

  let lastPrivateRow = null;
let lastPublicRow = null;

for (const trajet of tousLesTrajets) {
    const worker = new Worker('/static/js/displayTrajet.worker.js');

    worker.postMessage(trajet);

    worker.onmessage = function(event) {
        const trajetElement = document.createElement('div');
        trajetElement.classList.add('col-md-6', 'col-lg-4');
        trajetElement.innerHTML = event.data;

        if (trajet.typeTrajet === "prive") {
            if (!lastPrivateRow) {
                trajetsContainer.innerHTML += `<h2>Trajets privés</h2>`;
                lastPrivateRow = document.createElement('div');
                lastPrivateRow.classList.add('row');
                trajetsContainer.appendChild(lastPrivateRow);
            }
            lastPrivateRow.appendChild(trajetElement);
        } else if (trajet.typeTrajet === "public") {
            if (!lastPublicRow) {
                trajetsContainer.innerHTML += `<h2>Trajets publics</h2>`;
                lastPublicRow = document.createElement('div');
                lastPublicRow.classList.add('row');
                trajetsContainer.appendChild(lastPublicRow);
            }
            lastPublicRow.appendChild(trajetElement);
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