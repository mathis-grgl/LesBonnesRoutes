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
        // Retirer l'attribut 'onclick' du bouton recherche pour eviter bug
        btnResearch.removeAttribute('onclick');

        await displayTrajet(data);

        //On remet 'onclick' du bouton recherche pour eviter bug
        btnResearch.setAttribute('onclick', 'displayOffer(event)');
    })
    .catch(error => {
        titreOffre.innerHTML = "Aucun trajet correspondant";
        console.error('Erreur : ' + error.message);
    });
}
/*
function displayTrajet(trajets){
    const trajetsContainer = document.getElementById('row');
    trajetsContainer.innerHTML = ""; // retire le contenu de l'élément
    trajets.forEach(async trajet => {
      if (trajet.nbPlacesRestantes != 0){ // On affiche les trajets si ils ont encore des places
        const coordsDep = await getCoordinates(trajet.villeDepart);
        const coordsArr = await getCoordinates(trajet.villeArrivee);
        const trajetElement = document.createElement('div');
        trajetElement.classList.add('col-md-6', 'col-lg-4');

        let tmp = `<a href="/trajet?id=${trajet.idTrajet}" class="room">`;
        if(trajet.typeTrajet == "prive") tmp += `<div class="p-3 text-center room-info">
          <span class="text-uppercase letter-spacing-1">Groupe : ${trajet.nomGroupe}</span>
          </div>`;
        tmp += `<figure class="img-wrap">
              <img src="https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=480&height=480&center=lonlat:${coordsDep.longitude},${coordsDep.latitude}&zoom=8.468&marker=lonlat:-${coordsArr.longitude},${coordsArr.latitude};color:%23ff0000;size:medium&apiKey=28ed3d4ce3664398aa6e2f080d227bbc" alt="Free website template" class="img-fluid mb-3">
            </figure>
            <div class="p-3 text-center room-info">
              <h2>${trajet.villeDepart} - ${trajet.villeArrivee}</h2>
              <span class="text-uppercase letter-spacing-1">${trajet.prix}€ - ${trajet.nbPlacesRestantes} places restantes</span>
            </div>
          </a>
        `;

        trajetElement.innerHTML = tmp;
        trajetsContainer.appendChild(trajetElement);
      }
    });
}*/

async function displayTrajet(trajets) {
  const trajetsContainer = document.getElementById('display');
  trajetsContainer.innerHTML = ""; // retire le contenu de l'élément

  // Séparer les trajets privés et publics
  const trajetsPrives = trajets.filter(trajet => trajet.typeTrajet === "prive");
  const trajetsPublics = trajets.filter(trajet => trajet.typeTrajet === "public");

  // Ajouter tous les trajets publics au tableau de trajets
  const tousLesTrajets = trajetsPrives;

  // Ajouter tous les trajets privés au tableau de trajets
  tousLesTrajets.push(...trajetsPublics);
  const trajetRow = document.createElement('div');
  trajetRow.classList.add('row');
  const trajetRow1 = document.createElement('div');
  trajetRow1.classList.add('row');

  // Afficher tous les trajets dans l'ordre
  let trajetsPrivesAdded = false; // marqueur pour le titre des trajets privés
  let trajetsPublicsAdded = false; // marqueur pour le titre des trajets publics

  for (const trajet of tousLesTrajets) {
    const coordsDep = await getCoordinates(trajet.villeDepart);
    const coordsArr = await getCoordinates(trajet.villeArrivee);
    const coords = await getMiddleCoordinates(trajet.villeDepart, trajet.villeArrivee);
    const distance = getDistance(coordsDep.latitude, coordsDep.longitude, coordsArr.latitude, coordsArr.longitude);
    const zoom = getZoomLevel(distance);
    console.log(trajet.villeDepart + " -> " + trajet.villeArrivee + " = " + distance + " Zoom : " + zoom);
    const trajetElement = document.createElement('div');
    trajetElement.classList.add('col-md-6', 'col-lg-4');
    if (trajet.typeTrajet === "prive" && !trajetsPrivesAdded) { // Ajoute le titre "Trajets privés" avant la première section des trajets privés
      trajetsContainer.innerHTML = `<h2>Trajets privés</h2>`;
      trajetsContainer.appendChild(trajetRow);
      trajetsPrivesAdded = true;
    } else if (trajet.typeTrajet === "public" && !trajetsPublicsAdded) { // Ajoute le titre "Trajets publics" avant la première section des trajets publics
      trajetsContainer.innerHTML += `<h2>Trajets publics</h2>`;
      trajetsContainer.appendChild(trajetRow1);
      trajetsPublicsAdded = true;
    }
    trajetElement.innerHTML = `
      <a href="/trajet?id=${trajet.idTrajet}" class="room" style="position: relative;">
        <div class="img-wrap" style="position: relative;">
          <img src="https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=480&height=480&center=lonlat:${coords.longitude},${coords.latitude}&zoom=${zoom}&marker=lonlat:-${coords.longitude},${coords.latitude};color:%23ff0000;size:medium&apiKey=28ed3d4ce3664398aa6e2f080d227bbc" alt="Free website template" class="img-fluid mb-3">
          ${trajet.nbPlacesRestantes == 0 ? '<img src="static/images/sold_out.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;">' : ''}
        </div>
        <div class="p-3 text-center room-info">
          <h2>${trajet.villeDepart} - ${trajet.villeArrivee}</h2>
          <span class="text-uppercase letter-spacing-1">${trajet.prix}€ -</span> 
          <span style='color: ${trajet.nbPlacesRestantes == 0 ? "#FF0000" : "#4BC35B"}' class="text-uppercase letter-spacing-1">${trajet.nbPlacesRestantes == 0 ? "Plus de places" : trajet.nbPlacesRestantes + " places restantes"}</span><br>
          ${trajet.typeTrajet === "prive" ? `<span style='color: #4E5BFF;' class="text-uppercase letter-spacing-1">Groupe : ${trajet.nomGroupe}</span>` : ""}
        </div>
      </a>
    `;
    if (trajet.typeTrajet === "prive"){
      trajetRow.appendChild(trajetElement);
      trajetsContainer.appendChild(trajetRow);
    } else if (trajet.typeTrajet === "public"){
      trajetRow1.appendChild(trajetElement);
      trajetsContainer.appendChild(trajetRow1);
    }
  }
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // rayon de la terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // distance en km
}


function getZoomLevel(distance) {
  if (distance <= 50) { // 50 km
    return 8.6;
  } else if (distance <= 100) { // 100 km
    return 7.7;
  } else if (distance <= 200) { // 200 km
    return 7.2;
  } else if (distance <= 300) { // 300 km
    return 6.3;
  } else if (distance <= 400) { // 400 km
    return 6.1;
  } else if (distance <= 500) { // 500 km
    return 5.8;
  } else if (distance <= 600) { // 600 km
    return 5.4;
  } else if (distance <= 700) {  // 700 km
    return 5.1;
  } else {
    return 4.9; // 800 km
  }
}


async function getCoordinates(city) {
    try { // Au cas ou l'api ne fonctionne pas
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1&polygon_svg=1`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await response.json();
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      console.log("Coordonnées : " + latitude + "  " + longitude + "  Ville : " + city);
      return { latitude, longitude };
    } catch (error) {
      console.error('Erreur : ' + error.message);
      return { latitude: null, longitude: null };
    }
}


async function getMiddleCoordinates(city1, city2) {
  const { latitude: lat1, longitude: lon1 } = await getCoordinates(city1);
  const { latitude: lat2, longitude: lon2 } = await getCoordinates(city2);

  if (lat1 === null || lat2 === null || lon1 === null || lon2 === null) {
    return null;
  }

  const latMiddle = (Number(lat1) + Number(lat2)) / 2;
  const lonMiddle = (Number(lon1) + Number(lon2)) / 2;
  return { latitude: latMiddle, longitude: lonMiddle };
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