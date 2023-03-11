// Afficher les offres du moment
fetch('/admin/trajets')
  .then(response => response.json())
  .then(data => {
    displayTrajet(data);
  })
  .catch(error => {
    console.error('Une erreur est survenue :', error);
  });


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

    fetch('/trajet/recherche', {
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
    .then(data => {
        if (data.length === 0){
          titreOffre.innerHTML = "Aucun trajet correspondant";
        } else {
          titreOffre.innerHTML = "Trajets correspondants";
          descriptionOffres.innerHTML = "Retrouvez ici les offres de trajets correspondantes.";
        }
        displayTrajet(data);
    })
    .catch(error => {
        titreOffre.innerHTML = "Aucun trajet correspondant";
        console.error('Erreur : ' + error.message);
    });
}

function displayTrajet(trajets){
    const trajetsContainer = document.getElementById('row');
    trajetsContainer.innerHTML = ""; // retire le contenu de l'élément
    trajets.forEach(async trajet => {
      if (trajet.nbPlacesRestantes != 0){ // On affiche les trajets si ils ont encore des places
        const coordsDep = await getCoordinates(trajet.villeDepart);
        const coordsArr = await getCoordinates(trajet.villeArrivee);
        const trajetElement = document.createElement('div');
        trajetElement.classList.add('col-md-6', 'col-lg-4');
        trajetElement.innerHTML = `
          <a href="/trajet?id=${trajet.idTrajet}" class="room">
            <figure class="img-wrap">
              <img src="https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=480&height=480&center=lonlat:${coordsDep.longitude},${coordsDep.latitude}&zoom=8.468&marker=lonlat:-${coordsArr.longitude},${coordsArr.latitude};color:%23ff0000;size:medium&apiKey=28ed3d4ce3664398aa6e2f080d227bbc" alt="Free website template" class="img-fluid mb-3">
            </figure>
            <div class="p-3 text-center room-info">
              <h2>${trajet.villeDepart} - ${trajet.villeArrivee}</h2>
              <span class="text-uppercase letter-spacing-1">${trajet.prix}€ - ${trajet.nbPlacesRestantes} places restantes</span>
            </div>
          </a>
        `;
        trajetsContainer.appendChild(trajetElement);
      }
    });
}

async function getCoordinates(city) {
    try { // Au cas ou l'api ne fonctionne pas
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1&polygon_svg=1`);
      const data = await response.json();
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      //console.log("Coordonnées : " + latitude + "  " + longitude + "  Ville : " + city);
      return { latitude, longitude };
    } catch (error) {
      console.error('Erreur : ' + error.message);
      return { latitude: null, longitude: null };
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