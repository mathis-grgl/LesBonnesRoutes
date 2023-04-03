const token = getCookieToken();
const url = '/trajet/historiqueTrajetsCompte/' + token;
const getCompteURL = '/compte/getNomCompte/';
var conducteur = false;
var passagers = null;


function historique() {
    console.log("test");
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(reponse.statusText);
            }
            return reponse.json();
        })
        .then(data => {
            let nbTrajets = data.length;
            let table = $('#historique');
            let tbody = $("<tbody>");
            for (let i = 0; i < nbTrajets; i++) {
                console.log(data[i]);
                let trajet = data[i];
                let date = data[i].dateDepart;
                let dateObject = moment(date, 'D MMMM, YYYY');
                if (trajet.idCompte == trajet.idConducteur) {
                    conducteur = true;
                    let ligne = $("<tr>");
                    let typeTrajet = (trajet.typeTrajet.charAt(0).toUpperCase() + trajet.typeTrajet.slice(1)).replace('e', 'é');
                    console.log(typeTrajet);
                    if (typeTrajet == 'Privé') {
                        ligne.append($('<td>').text(typeTrajet + " : " + trajet.nomGroupe));
                    } else if (typeTrajet == 'Public') {
                        ligne.append($('<td>').text(typeTrajet));
                    }
                    ligne.append($('<td>').text(trajet.villeDepart));
                    ligne.append($('<td>').text(trajet.villeArrivee));
                    ligne.append($('<td>').text(dateObject.format('DD-MM-YYYY')));
                    ligne.append($('<td>').text(trajet.heureDepart));
                    ligne.append($('<td>').text(trajet.prix + '€'));
                    ligne.append($('<td>').text(trajet.precisionRdv));
                    ligne.append($('<td>').text(trajet.commentaires));
                    ligne.append($('<td>').text("Conducteur"));
                    ligne.append(
                        $('<td>').append(
                            $('<div>').addClass('div-container')
                                .append(
                                    $('<button>').addClass('signup-btn').attr('id', trajet.idTrajet)
                                        .html("Noter les passagers")
                                )
                        )
                    );
                    tbody.append(ligne);
                } else {
                    let nomConducteur = "";
                    fetch(getCompteURL + trajet.idConducteur)
                        .then(reponse => {
                            if (!reponse.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return reponse.json();
                        })
                        .then(data => {
                            nomConducteur = data.nomCompte;
                            console.log(nomConducteur);
                            let row = $("<tr>");
                            let typeTrajet = (trajet.typeTrajet.charAt(0).toUpperCase() + trajet.typeTrajet.slice(1)).replace('e', 'é');
                            console.log(typeTrajet);
                            if (typeTrajet == 'Privé') {
                                row.append($('<td>').text(typeTrajet + " : " + trajet.nomGroupe));
                            } else if (typeTrajet == 'Public') {
                                row.append($('<td>').text(typeTrajet));
                            }
                            row.append($('<td>').text(trajet.villeDepart));
                            row.append($('<td>').text(trajet.villeArrivee));
                            row.append($('<td>').text(dateObject.format('DD-MM-YYYY')));
                            row.append($('<td>').text(trajet.heureDepart));
                            row.append($('<td>').text(trajet.prix + '€'));
                            row.append($('<td>').text(trajet.precisionRdv));
                            row.append($('<td>').text(trajet.commentaires));
                            row.append($('<td>').text("Passager" + ', Conducteur : ' + nomConducteur));
                            row.append(
                                $('<td>').append(
                                    $('<div>').addClass('div-container')
                                        .append(
                                            $('<button>').addClass('signup-btn').attr('id', trajet.idTrajet)
                                                .html("Noter le conducteur")
                                        )
                                )
                            );


                            tbody.append(row);
                        });
                }

                getPassagers(data[i].idHistorique, data[i].nomConducteur, data[i].prenomConducteur, data[i].idConducteur);
            }
            table.append(tbody);
        })
        .catch(error => {
            console.error(error);
        })

}

function getPassagers(idHistorique, nomConducteur, prenomConducteur, idConducteur){
    fetch(`/trajet/getListeANoter/${getCookieToken()}/${idHistorique}`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Erreur lors de l\'appel à la requete getPassagers');
        }
        return response.json();
    })
    .then(data => {
        if (!conducteur){
            console.log("Résultat requete getPassagers : " + nomConducteur + " " + prenomConducteur);
            // Ajoute le contenu HTML final à l'élément avec l'ID 'notation'*/
            document.getElementById("notation").innerHTML = 
            `<div id="popup-container">` +
                `<div id="popup">` +
                    `<div class="form_control_container__time" id="texte">Noter un conducteur : </div><br>` +
                    `<div class="rating" id="${idConducteur}">` +
                            `<a href="#" onclick="noter(event, 5, ${idConducteur}, ${idHistorique})">★</a>` +
                            `<a href="#" onclick="noter(event, 4, ${idConducteur}, ${idHistorique})">★</a>` +
                            `<a href="#" onclick="noter(event, 3, ${idConducteur}, ${idHistorique})">★</a>` +
                            `<a href="#" onclick="noter(event, 2, ${idConducteur}, ${idHistorique})">★</a>` +
                            `<a href="#" onclick="noter(event, 1, ${idConducteur}, ${idHistorique})">★</a>` +
                            `<div class="infos" name="infos-${idConducteur}"> : ${nomConducteur} ${prenomConducteur}</div>` +
                        "</div>" +
                    `<button class="btn btn-success btn-block text-white" onclick="closePopup()">Fermer</button>` +
                `</div>` +
            `</div>`;
        } else {
            let popUpContainer = "";
            Object.values(data).forEach(element =>{
                //console.log("Résultat requete getPassagers : " + Object.values(element) + " " + Object.keys(element));
                const key = Object.keys(element);
                const value = Object.values(element);

                // Ajoute le contenu HTML final à l'élément avec l'ID 'notation'*/
                popUpContainer +=
                `<div class="rating" id="${value[key.indexOf("idCompte")]}">` +
                    `<a href="#" onclick="noter(event, 5, ${value[key.indexOf("idCompte")]}, ${idHistorique})">★</a>` +
                    `<a href="#" onclick="noter(event, 4, ${value[key.indexOf("idCompte")]}, ${idHistorique})">★</a>` +
                    `<a href="#" onclick="noter(event, 3, ${value[key.indexOf("idCompte")]}, ${idHistorique})">★</a>` +
                    `<a href="#" onclick="noter(event, 2, ${value[key.indexOf("idCompte")]}, ${idHistorique})">★</a>` +
                    `<a href="#" onclick="noter(event, 1, ${value[key.indexOf("idCompte")]}, ${idHistorique})">★</a>` +
                    `<div class="infos" name="infos-${value[key.indexOf("idCompte")]}"> : ${value[key.indexOf("nomCompte")]} ${value[key.indexOf("prenomCompte")]}</div>` +
                "</div>";
            });

            document.getElementById("notation").innerHTML = 
            `<div id="popup-container">` +
                `<div id="popup">` +
                    `<div class="form_control_container__time" id="texte">Noter un conducteur : </div><br>` +
                    popUpContainer +
                    `<button class="btn btn-success btn-block text-white" onclick="closePopup()">Fermer</button>` +
                `</div>` +
            `</div>`;
        }
    })
    .catch(error => {
        console.error('Erreur : ', error);
    });
}


$(document).on('click', '.signup-btn', function () {
    let id = $(this).attr('id');
    console.log("on a cliqué pour noter le conducteur ou les passagers du trajet d'id : " + id);
    document.getElementById("popup-container").style.display = "block";
    if (conducteur){
        document.getElementById("texte").innerText = "Noter des passagers :"
    }


});

function closePopup() {
    document.getElementById("popup-container").style.display = "none";
}

function noter(event, note, idCompte, idHistorique){
    event.preventDefault();

    fetch(`/trajet/noter/${getCookieToken()}/${idHistorique}/${idCompte}/${note}`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Erreur lors de l\'appel à la requete noter');
        }
        return response.json();
    })
    .then(data => {
        console.log("Résultat requete noter : " + Object.values(data));
        if (!document.querySelector("div[name='infos-" + idCompte + "']").innerHTML.includes("✔️")){
            document.querySelector("div[name='infos-" + idCompte + "']").innerHTML += "✔️";
        }
    })
    .catch(error => {
        console.error('Erreur : ', error);
    });
}