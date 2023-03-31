const token = getCookieToken();
const url = '/trajet/historiqueTrajetsCompte/' + token;


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
            }
            table.append(tbody);
        })
        .catch(error => {
            console.error(error);
        })

}


$(document).on('click', '.signup-btn', function () {
    let id = $(this).attr('id');
    console.log("on a cliqué pour noter le conducteur ou les passagers du trajet d'id : " + id);
    // faire ici le code pour rediriger vers la page ou soit directement ouvrir une petite fenêtre avec les passagers ou le conducteur
    // pour ensuite attribuer une note donc voir comment bien faire ça






    // let u = new URL(window.location.href);
    // u.searchParams.delete("id");
    // let url = new URL(window.location.href);
    // console.log(url);
    // url.pathname = '/trajet';
    // url.searchParams.set("id", id);
    // window.location.href = url.href;



});