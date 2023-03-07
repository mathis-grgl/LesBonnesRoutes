const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');


// Récupérer les coordonnées des villes
fetch(`/trajet/trajet/${id}`, {
    method: 'POST'
})
.then(response => response.json())
.then(async data => {
    setMap(await getCoordinates(data.villeDepart), await getCoordinates(data.villeArrivee));
})
.catch(error => console.error(error));


function setMap(coord1, coord2){
    // Coordonnées des villes de départ et d'arrivée
    var depart = [coord1.latitude, coord1.longitude];
    var arrivee = [coord2.latitude, coord2.longitude];

    // Création de la carte centrée sur la ville de départ
    var map = L.map('map').setView(depart, 5);
                        
    // Ajout de la couche de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
    }).addTo(map);
                        
    // Création du trajet
    L.Routing.control({
    waypoints: [
        L.latLng(depart),
        L.latLng(arrivee)
    ]
    }).addTo(map);
}

async function getCoordinates(city) {
    try { // Au cas ou l'api ne fonctionne pas
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1&polygon_svg=1`);
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