import * as THREE from 'three';
import { TWEEN } from 'https://unpkg.com/three@0.149/examples/jsm/libs/tween.module.min.js'
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'https://unpkg.com/three@0.149/examples/jsm/geometries/TextGeometry.js';
import { OBJLoader } from 'https://unpkg.com/three@0.149/examples/jsm/loaders/OBJLoader.js';
import { FontLoader } from 'https://unpkg.com/three@0.149/examples/jsm/loaders/FontLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.149/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.149/examples/jsm/loaders/GLTFLoader.js';

// Setup de tout
const bienvenueHeader = document.querySelector('header[name="bienvenue"]');
const bienvenueBlockquote = document.querySelector('blockquote[name="bienvenue"]');

window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  const bienvenueHeight = bienvenueHeader.offsetHeight;
  
  if (scrollY > bienvenueHeight) {
  } else {
    bienvenueHeader.style.opacity = 1 - (scrollY / bienvenueHeight);
    bienvenueBlockquote.style.opacity = 1 - (scrollY / bienvenueHeight);
  }
});

// Ajout de l'événement onclick au bouton passer
document.getElementById("btn-passer").addEventListener("click", function() {
    crerCookie(event);
});

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.position.x = 0;
camera.position.y = 0.1;
camera.position.z = 1.1;
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(0);
camera.position.setX(0);

renderer.render(scene, camera);


// Lights
/*const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);*/

const ambientLight = new THREE.AmbientLight("#ffffff", 10);
scene.add(ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

//const controls = new OrbitControls(camera, renderer.domElement);


// Background
const fondTexture = new THREE.TextureLoader().load('/static/animation/fond_retro.jpg');
scene.background = fondTexture;

const TEXTURE_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657168/blog/vaporwave-threejs-textures/grid.png";
const DISPLACEMENT_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657200/blog/vaporwave-threejs-textures/displacement.png";

// Textures
const textureLoader = new THREE.TextureLoader();
const gridTexture = textureLoader.load(TEXTURE_PATH);
const terrainTexture = textureLoader.load(DISPLACEMENT_PATH);


// Objects
const geometry = new THREE.PlaneGeometry(1, 2, 24, 24);
const material = new THREE.MeshStandardMaterial({
    map: gridTexture,
    displacementMap: terrainTexture,
    displacementScale: 0.4,
});

var plane = new Array(5);
for (var i = 0; i < 5; i++){ // Ajout de 4 plans
  plane[i] = new THREE.Mesh(geometry, material);
  plane[i].rotation.x = -Math.PI * 0.5;
  plane[i].position.y = 0.0;
  plane[i].position.z = -1.85 * i;
  scene.add(plane[i]);
}



// Voiture
let car;
const loaderMtl = new MTLLoader();
loaderMtl.load('/static/animation/car.mtl', function(materials) {
  materials.preload();
  const loader = new OBJLoader();

  loader.setMaterials(materials);

  loader.load(
    // chemin vers votre fichier .obj
    '/static/animation/car.obj',
    // fonction de rappel appelée lorsque le chargement est terminé
    function ( objet ) {
      // ajoutez l'objet à votre scène
      scene.add( objet );

      // Appliquer un changement d'échelle
      objet.scale.set(0.06, 0.05, 0.05);

      // Modifier la position de l'objet
      objet.position.set(0, 0, -0.3); //x négatif vers <= , y positif vers haut, z positif vers moi
      objet.rotation.y += Math.PI;
      objet.rotation.x += Math.PI/2 + 0.1;

      car = objet;
    },
    
    // fonction de rappel appelée pendant le chargement
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded car' );
    },
    
    // fonction de rappel appelée en cas d'erreur de chargement
    function ( error ) {
      console.log( 'An error happened' );
    }
  );
});

/*const loader = new GLTFLoader();

loader.load(
  // Chemin vers le fichier .gltf
  'car.gltf',
  // Fonction de rappel appelée lorsque le chargement est terminé
  function ( gltf ) {
    // Récupérer la scène de l'objet chargé
    const car = gltf.scene;

    // Ajouter l'objet à votre scène
    scene.add( car );

    // Appliquer un changement d'échelle
    car.scale.set(0.06, 0.05, 0.05);

    // Modifier la position de l'objet
    car.position.set(0, 0, -0.3); // x négatif vers <= , y positif vers haut, z positif vers moi
    /*car.rotation.y += Math.PI;
    car.rotation.x += Math.PI/2 + 0.1;*/
  /*},
  // Fonction de rappel appelée pendant le chargement
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded car' );
  },
  // Fonction de rappel appelée en cas d'erreur de chargement
  function ( error ) {
    console.log( 'An error happened' );
  }
);*/



// LBR
const lbrTexture = new THREE.TextureLoader().load('/static/animation/lbr.png');
const lbr = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ map: lbrTexture }));
scene.add(lbr);
lbr.position.z = -5;
lbr.position.x = 6.5;
lbr.position.y = 3.5;
lbr.rotation.x = 0.5;
lbr.rotation.y = 4;


// Texte
const loaderText = new FontLoader();

function loadText(text){
  return new Promise(resolve => {
    let textObj;
    loaderText.load( '/static/animation/font.json', function ( font ) {
      const geometry = new TextGeometry(text , {
        font: font,
        size: 300,
        height: 0,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      } )
      
      const material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.0, transparent: true } );
      textObj = new THREE.Mesh( geometry, material );
      textObj.scale.set(0.0003, 0.0003, 0.0003);// Modifier taille du texte
      textObj.position.set(-10, -10, -10); 
      //textObj.renderOrder = 3; // définit un renderOrder plus élevé pour les écritures
      scene.add( textObj );
      resolve(textObj);
    },

    // fonction de rappel appelée pendant le chargement
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded text' );
    });
  });
}

// Utilisation de la fonction
let texteIntro;
const intro = document.querySelector('section[name="introduction"]').innerText;
loadText(intro).then(obj => {
  texteIntro = obj;
  texteIntro.position.set(-3, 2, -5);
});

let texteProjets;
const projets = document.querySelector('section[name="projets"]').innerText;
loadText(projets).then(obj => {
  texteProjets = obj;
  texteProjets.position.set(0, 2, -9); // Modifier taille du texte
});

let texteProverbe;
const proverbe = document.querySelector('blockquote[name="proverbe"]').innerText;
loadText(proverbe).then(obj => {
  texteProverbe = obj;
  texteProverbe.position.set(-3, 2, -13); // Modifier taille du texte
});

let texteHistoire;
const histoire = document.querySelector('section[name="histoire"]').innerText;
loadText(histoire).then(obj => {
  texteHistoire = obj;
  texteHistoire.position.set(0, 2, -17); // Modifier taille du texte
});

let texteFin;
const fin = document.querySelector('blockquote[name="fin"]').innerText;
loadText(fin).then(obj => {
  texteFin = obj;
  texteFin.position.set(-1, 1, -21); // Modifier taille du texte
});



// Nuages
let cloudParticles = [];
let loaderCloud = new THREE.TextureLoader();
loaderCloud.load("/static/animation/smoke.png", function(texture){
  console.log("Texture smoke chargée");
  let cloudGeo = new THREE.PlaneBufferGeometry(20,20);
  let cloudMaterial = new THREE.MeshLambertMaterial({
    map:texture,
    transparent: true
  });

  for(let p=0; p<50; p++) {
    let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
    cloud.position.set(
      Math.random()*30 - 20,   // position horizontale aléatoire
      Math.random()*-1 + 2,   // hauteur aléatoire entre -1 et 2
      Math.random()*-21 - 7   // position profondeur aléatoire entre -21 et -7
    );
    cloud.rotation.x = 1.16;
    cloud.rotation.y = -0.12;
    cloud.rotation.z = Math.random()*2*Math.PI;
    cloud.material.opacity = 0.02;
    cloudMaterial.depthTest = false;
    cloudMaterial.depthWrite = false;  
    cloudParticles.push(cloud);
    scene.add(cloud);
  }
});



// Verifier si un élement est affiché
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function refreshText(text, previousText, header) {
  // Si c'est le premier texte, on vérifie simplement que le header est invisible
  if (previousText === null && text) {
    if (text && text.position.z > -2.5 && header.style.opacity < 0.1){
      fadeOutText(text);
    } else if (text && text.position.z < -2.5 && header.style.opacity > 0) {
      fadeInText(text);
    } else {
      if (header.style.opacity < 0.1) {
        fadeInText(text);
      } else {
        fadeOutText(text);
    }
    }

  } else if (text && previousText){
    // Sinon, on vérifie que le texte précédent est invisible avant de faire apparaitre le texte actuel
    if (previousText.material.opacity === 0.0 && header.style.opacity < 0.1 && header) {
      if (text.position.z > -2.5){
        fadeOutText(text);
      } else if (text.position.z < -2.5 && text.position.z > -6.4) { // 2eme condition necéssaire pour pas que 1/2 texte s'affiche
        fadeInText(text);
      }
    } else {
      fadeOutText(text);
    }
  }
}

function fadeInText(text) {
  // Augmenter l'opacité progressivement pour rendre le texte visible
  if (text.material.opacity < 1.0) {
    text.material.opacity += 0.01; // Augmenter l'opacité de 0.01 à chaque frame
  }
  if (text.material.opacity > 1.0) {
    text.material.opacity = 1.0; // Si l'opacité atteint 1, arrêter l'animation
  }
}

function fadeOutText(text) {
  // Réduire l'opacité progressivement pour rendre le texte invisible
  if (text.material.opacity > 0.0) {
    text.material.opacity -= 0.01; // Réduire l'opacité de 0.01 à chaque frame
  }
  if (text.material.opacity < 0.0) {
    text.material.opacity = 0.0; // Si l'opacité atteint 0, cacher le texte
  }
}


function transitionFin() {
  /*// Ajoute une lumière blanche au centre de la scène
  let light = new THREE.PointLight(0xffffff, 2, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  // Anime la lumière en la déplaçant vers les bords de la scène
  let tween = new TWEEN.Tween(light.position)
    .to({x: -200, y: 0, z: 200}, 2000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  // Attends 3 secondes avant de rediriger vers la nouvelle page HTML
  setTimeout(function() {
    window.location.href = "contact.html";
  }, 3000);*/
}





// Scroll Animation
let lastScrollTop = 0;
let tmp = false;

function moveCamera() {
  const scrollTop = document.body.getBoundingClientRect().top;

  // Déterminer la direction du scroll
  const direction = scrollTop > lastScrollTop ? 1 : -1;

  // Mettre à jour la dernière position
  lastScrollTop = scrollTop;

  //if (car) car.rotation.y += 0.01 * direction;

  // Sol
  for (var i = 0; i < 5; i++){
    plane[i].position.z -= direction * 0.003;
  }

  //Nuages
  if (cloudParticles){
    cloudParticles.forEach(p => {
      p.position.z -= direction * 0.01;
    });
  }

  // Textes
  if (texteIntro) texteIntro.position.z -= direction * 0.01;
  if (texteProjets) texteProjets.position.z -= direction * 0.01;
  if (texteProverbe) texteProverbe.position.z -= direction * 0.01;
  if (texteHistoire) texteHistoire.position.z -= direction * 0.01;
  if (texteFin) texteFin.position.z -= direction * 0.01;

  refreshText(texteIntro, null, bienvenueHeader);
  refreshText(texteProjets, texteIntro, bienvenueHeader);
  refreshText(texteProverbe, texteProjets, bienvenueHeader);
  refreshText(texteHistoire, texteProverbe, bienvenueHeader);
  refreshText(texteFin, texteHistoire, bienvenueHeader);
}

document.body.onscroll = moveCamera;
moveCamera();


function animate() {
  requestAnimationFrame(animate);
  //controls.update();
  // Faites tourner le cube lbr
  lbr.rotation.y += 0.01;

  if (texteFin){
    if (texteFin.position.z > - 1){
      if (car){
        car.position.z -= 0.003;

        //Sol
        for (var i = 0; i < 5; i++){
          plane[i].position.z += 0.003;
        }
        
        //Transition
        if (car.position.z < -1.5){
          //transitionFin();

          // Lance l'animation et la transition vers la nouvelle page HTML après 5 secondes
          //setTimeout(() => {
            crerCookie();
          //}, 5000);
        }
      }
    }
  }

  renderer.render(scene, camera);
}

function crerCookie(event){
  event.preventDefault();

  // Vérification de l'existence du cookie
  if (document.cookie.indexOf("premier") < 0) {
    // Cookie valide 5 jours
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const expirationString = expirationDate.toUTCString();
    document.cookie = "premier=non" + "; expires=" + expirationString + "; path=/";

    window.location.href = "/";
  }
}

animate();