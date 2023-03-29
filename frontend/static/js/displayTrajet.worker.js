// Le code à exécuter dans le worker
function processTrajet(trajet, keys) {
    // Récupère la valeur associée à la clé "villeDepart"
    const villeDepart = trajet[keys.indexOf("villeDepart")];
    const villeArrivee = trajet[keys.indexOf("villeArrivee")];
    const nbPlacesRestantes = trajet[keys.indexOf("nbPlacesRestantes")];

    return new Promise(async (resolve, reject) => {
      const coordsDep = await getCoordinates(villeDepart);
      const coordsArr = await getCoordinates(villeArrivee);
      const coords = getMiddleCoordinates(coordsDep, coordsArr);
      const distance = getDistance(coordsDep.latitude, coordsDep.longitude, coordsArr.latitude, coordsArr.longitude);
      const zoom = getZoomLevel(distance);
      
      const trajetElement = `
        <a href="/trajet?id=${trajet[keys.indexOf("idTrajet")]}" class="room" style="position: relative;">
          <div class="img-wrap" style="position: relative;">
            <img src="https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=480&height=480&center=lonlat:${coords.longitude},${coords.latitude}&zoom=${zoom}&marker=lonlat:-${coords.longitude},${coords.latitude};color:%23ff0000;size:medium&apiKey=28ed3d4ce3664398aa6e2f080d227bbc" alt="Free website template" class="img-fluid mb-3">
            ${nbPlacesRestantes == 0 ? '<img src="static/images/sold_out.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;">' : ''}
          </div>
          <div class="p-3 text-center room-info">
            <h2>${villeDepart} - ${villeArrivee}</h2>
            <span class="text-uppercase letter-spacing-1">${trajet.prix}€ -</span> 
            <span style='color: ${nbPlacesRestantes == 0 ? "#FF0000" : "#4BC35B"}' class="text-uppercase letter-spacing-1">${nbPlacesRestantes == 0 ? "Plus de places" : nbPlacesRestantes + " places restantes"}</span><br>
            ${trajet[keys.indexOf("typeTrajet")] === "prive" ? `<span style='color: #4E5BFF;' class="text-uppercase letter-spacing-1">Groupe : ${trajet[keys.indexOf("nomGroupe")]}</span>` : ""}
          </div>
        </a>
      `;
      
      resolve(trajetElement);
    });
  }
  
// Écoute les messages provenant du script principal
onmessage = async function(event) {
    // Traite chaque trajet et renvoie les résultats au script principal
    const results = [];
    const result = await processTrajet(Object.values(event.data), Object.keys(event.data));
    results.push(result);
    postMessage(results);
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
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=c70c1b717c8f4c54a32bc4a891c5695f`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
  
      /*const dataPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject('Timeout'), 2000); // Timeout après 5 secondes
      });
  
      const [response, _] = await Promise.race([responsePromise, dataPromise]);*/ //Sécurité retirée pour l'instant
  
      const data = await response.json();
      const latitude = data.results[0].geometry.lat;
      const longitude = data.results[0].geometry.lng;
      return { latitude, longitude };
    } catch (error) {
      console.error('Erreur : ' + error.message);
      return { latitude: 48.692054, longitude: 6.184417 }; // Si pas de réponse on renvoi les coordonnées de Nancy
    }
  }
  
  
  
  
  function getMiddleCoordinates(coords1, coords2) {
    const { latitude: lat1, longitude: lon1 } = coords1;
    const { latitude: lat2, longitude: lon2 } = coords2;
  
    if (lat1 === null || lat2 === null || lon1 === null || lon2 === null) {
      return null;
    }
  
    const latMiddle = (Number(lat1) + Number(lat2)) / 2;
    const lonMiddle = (Number(lon1) + Number(lon2)) / 2;
    return { latitude: latMiddle, longitude: lonMiddle };
  }