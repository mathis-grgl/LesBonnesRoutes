
fetch('/trajets')
  .then(response => response.json())
  .then(data => {
    const trajets = data;
    const trajetsContainer = document.getElementById('row');
    trajets.forEach(async trajet => {
      const coordsDep = await getCoordinates(trajet.villeDepart);
      const coordsArr = await getCoordinates(trajet.villeArrivee);
      const trajetElement = document.createElement('div');
      trajetElement.classList.add('col-md-6', 'col-lg-4');
      trajetElement.innerHTML = `
        <a href="#" class="room">
          <figure class="img-wrap">
            <img src="https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=480&height=480&center=lonlat:${coordsDep.longitude},${coordsDep.latitude}&zoom=8.468&marker=lonlat:-${coordsArr.longitude},${coordsArr.latitude};color:%23ff0000;size:medium&apiKey=28ed3d4ce3664398aa6e2f080d227bbc" alt="Free website template" class="img-fluid mb-3">
          </figure>
          <div class="p-3 text-center room-info">
            <h2>${trajet.villeDepart} - ${trajet.villeArrivee}</h2>
            <span class="text-uppercase letter-spacing-1">${trajet.prix}€ / par trajet</span>
          </div>
        </a>
      `;
      trajetsContainer.appendChild(trajetElement);
    });
  })
  .catch(error => {
    console.error('Une erreur est survenue :', error);
  });

async function getCoordinates(city) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1&polygon_svg=1`);
  const data = await response.json();
  const latitude = data[0].lat;
  const longitude = data[0].lon;
  console.log("Coordonnées : " + latitude + "  " + longitude);
  return { latitude, longitude };
}
 
//<img src="https://www.openstreetmap.org/export/staticmap?bbox=${coordsDep.latitude},${coordsDep.longitude},${coordsArr.latitude},${coordsArr.longitude}&width=480&height=320&layer=mapnik&markers=color:blue|label:A|${coordsDep.latitude},${coordsDep.longitude}&markers=color:green|label:B|${coordsArr.latitude},${coordsArr.longitude}&path=color:0x0000ff|weight:5|${coordsDep.latitude},${coordsDep.longitude};${coordsArr.latitude},${coordsArr.longitude}" alt="Free website template" class="img-fluid mb-3">


function showSection(event) {
    event.preventDefault(); // Prevent the default behavior of the button click
    var section = document.getElementById("slidersSection");
    if (section.hasAttribute("hidden")) {
        section.removeAttribute("hidden");
    } else {
        section.setAttribute("hidden", "");
    }
}

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}
    
function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector('#toSlider');
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');
fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);