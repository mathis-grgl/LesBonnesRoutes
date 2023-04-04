// car.worker.js

import { OBJLoader } from 'https://unpkg.com/three@0.149/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.149/examples/jsm/loaders/MTLLoader.js';

onmessage = function(event) {
    console.log("Voiture : " + event.data);
    if (event.data === 'loadCar') {
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
                    // envoyer l'objet chargé à la page principale
                    self.postMessage({
                        type: 'carLoaded',
                        data: { obj: objet }
                    });
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
    }
};