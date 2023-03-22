
let token = getCookieToken();

const urlParams = new URLSearchParams(window.location.search);
const idGroupe = parseInt(urlParams.get('id'));
console.log(idGroupe);

let url = '/ami/getTrajetsGroupe/' + token + '/' + idGroupe;
const getCompteURL = '/compte/getNomCompte/';

let getPassagers = '/admin/getPassagers/' + token + '/';




function charger_trajetsPrives() {
    console.log("teststststtsts");

    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(reponse.statusText);
            }
            return reponse.json();
        })
        .then(data => {
            // console.log(data);
            let table = $('#trajets');
            let tbody = $("<tbody>");
            console.log(data);
            data.forEach(element => {
                let dateObject = moment(element.dateDepart, 'D MMMM, YYYY');
                let dateFormatted = dateObject.format("DD-MM-YYYY");
                fetch(getPassagers + element.idTrajet)
                    .then(rep => {
                        if (!rep.ok) {
                            throw new Error(rep.statusText);


                        }
                        return rep.json();
                    })
                    .then(donne => {
                        // tab.push(donne);
                        // console.log(donne);
                        // t.push(donne);
                        let dedans = true;
                        let conducteur = true;
                        let passager = false;
                        if (donne.length === 0) {
                            console.log(element.idCompte);
                            console.log(element.idConducteur);
                            console.log(element.idTrajet);


                            if (element.idCompte === element.idConducteur) {
                                console.log("dit moi que tu viens la");
                                let ligne = $("<tr>");
                                // on est conducteur et il n'y a pas de passager
                                ligne.append($('<td>').text(element.villeDepart));
                                ligne.append($('<td>').text(element.villeArrivee));
                                ligne.append($('<td>').text(dateFormatted));
                                ligne.append($('<td>').text(element.heureDepart));
                                ligne.append($('<td>').text(element.nbPlacesRestantes + '/' + element.nbPlaces));
                                ligne.append($('<td>').text(element.statusTrajet));
                                ligne.append($('<td>').text(element.prix + '€'));
                                ligne.append($('<td>').text(element.precisionRdv));
                                ligne.append($('<td>').text(element.commentaires));
                                ligne.append($('<td>').text("Conducteur"));
                                ligne.append(
                                    $('<td>').append(
                                        $('<div>').addClass('div-container')
                                            .append(
                                                $('<button>').addClass('actions-btn').attr('id', element.idTrajet)
                                                    .html("Actions pour le trajet")
                                            )
                                    )
                                );
                                tbody.append(ligne)

                            } else {
                                // on n'est pas conducteur et c'est un trajet sans passager
                                console.log("pas dedans.")
                                let nomConducteur = "";
                                fetch(getCompteURL + element.idConducteur)
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
                                        row.append($('<td>').text(element.villeDepart));
                                        row.append($('<td>').text(element.villeArrivee));
                                        row.append($('<td>').text(dateFormatted));
                                        row.append($('<td>').text(element.heureDepart));
                                        row.append($('<td>').text(element.nbPlacesRestantes + '/' + element.nbPlaces));
                                        row.append($('<td>').text(element.statusTrajet));
                                        row.append($('<td>').text(element.prix + '€'));
                                        row.append($('<td>').text(element.precisionRdv));
                                        row.append($('<td>').text(element.commentaires));
                                        row.append($('<td>').text("Ni Passager ni Conducteur"));
                                        row.append(
                                            $('<td>').append(
                                                $('<div>').addClass('div-container')
                                                    .append(
                                                        $('<button>').addClass('signup-btn').attr('id', element.idTrajet)
                                                            .html("Demander à participer")
                                                    )
                                            )
                                        );



                                        tbody.append(row);

                                    })
                                    .catch(errpr => {
                                        console.error(errpr);
                                    });
                            }

                            dedans = false;
                        }
                        for (let i = 0; i < donne.length; i++) {
                            console.log("test element idcompte et donne idcompte " + element.idCompte + ' |||| ' + donne[i].idCompte);
                            // ok note à moi même après la salle : utiliser la variable dedans et faire l'affichage après la boucle for
                            // en utilisant dedans et ensuite je refais des tests (maybe rajouter des autres booleens pour savoir si c'est 
                            // un conducteur ou un passager ou aucun des deux)
                            if (element.idCompte === element.idConducteur) {
                                console.log("La personne co est le conduc.");
                                passager = false;
                                dedans = true;
                                conducteur = true;
                                break;
                            }
                            if (element.idCompte === donne[i].idCompte && element.idCompte !== element.idConducteur) {
                                console.log("c'est un passager.");
                                conducteur = false;
                                passager = true;
                                dedans = true;
                                break;

                            }
                            if (element.idCompte !== donne[i].idCompte && element.idCompte !== element.idConducteur) {
                                dedans = false;
                                passager = false;
                                conducteur = false;
                                console.log("ce n'est ni le conducteur ni un passager");

                            }
                        }

                        if (conducteur && !passager && donne.length !== 0) {
                            let ligne = $("<tr>");
                            console.log("on affiche les infos du conduct");

                            // on est conducteur et il y a des passagers
                            ligne.append($('<td>').text(element.villeDepart));
                            ligne.append($('<td>').text(element.villeArrivee));
                            ligne.append($('<td>').text(dateFormatted));
                            ligne.append($('<td>').text(element.heureDepart));
                            ligne.append($('<td>').text(element.nbPlacesRestantes + '/' + element.nbPlaces));
                            ligne.append($('<td>').text(element.statusTrajet));
                            ligne.append($('<td>').text(element.prix + '€'));
                            ligne.append($('<td>').text(element.precisionRdv));
                            ligne.append($('<td>').text(element.commentaires));
                            ligne.append($('<td>').text("Conducteur"));
                            ligne.append(
                                $('<td>').append(
                                    $('<div>').addClass('div-container')
                                        .append(
                                            $('<button>').addClass('actions-btn').attr('id', element.idTrajet)
                                                .html("Actions pour le trajet")
                                        )
                                )
                            );
                            tbody.append(ligne)
                        }

                        if (dedans && passager && donne.length !== 0 && !conducteur) {
                            let ligne = $("<tr>");
                            console.log("on affiche les infos du passager");
                            let nomConducteur = "";
                            fetch(getCompteURL + element.idConducteur)
                                .then(reponse => {
                                    if (!reponse.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return reponse.json();
                                })
                                .then(data => {
                                    nomConducteur = data.nomCompte;
                                    console.log("le nom du conduc : " + nomConducteur);
                                    // on est passager
                                    ligne.append($('<td>').text(element.villeDepart));
                                    ligne.append($('<td>').text(element.villeArrivee));
                                    ligne.append($('<td>').text(dateFormatted));
                                    ligne.append($('<td>').text(element.heureDepart));
                                    ligne.append($('<td>').text(element.nbPlacesRestantes + '/' + element.nbPlaces));
                                    ligne.append($('<td>').text(element.statusTrajet));
                                    ligne.append($('<td>').text(element.prix + '€'));
                                    ligne.append($('<td>').text(element.precisionRdv));
                                    ligne.append($('<td>').text(element.commentaires));
                                    ligne.append($('<td>').text("Passager" + ', Conducteur : ' + nomConducteur));
                                    ligne.append(
                                        $('<td>').append(
                                            $('<div>').addClass('div-container')
                                                .append(
                                                    $('<button>').addClass('actions-btn').attr('id', element.idTrajet)
                                                        .html("Actions pour le trajet")
                                                )
                                        )
                                    );
                                    tbody.append(ligne)




                                })
                                .catch(errpr => {
                                    console.error(errpr);
                                });


                        }

                        console.log("dedans : " + dedans);
                        if (!dedans && donne.length !== 0) {
                            //on est rien du tout mais il y a d'autres passagers qu'on peut rejoindre
                            console.log("on est rien du tout");

                            let nomConducteur = "";
                            fetch(getCompteURL + element.idConducteur)
                                .then(reponse => {
                                    if (!reponse.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return reponse.json();
                                })
                                .then(data => {
                                    nomConducteur = data.nomCompte;
                                    console.log("le nom du conduc : " + nomConducteur);
                                    let row = $("<tr>");
                                    row.append($('<td>').text(element.villeDepart));
                                    row.append($('<td>').text(element.villeArrivee));
                                    row.append($('<td>').text(dateFormatted));
                                    row.append($('<td>').text(element.heureDepart));
                                    row.append($('<td>').text(element.nbPlacesRestantes + '/' + element.nbPlaces));
                                    row.append($('<td>').text(element.statusTrajet));
                                    row.append($('<td>').text(element.prix + '€'));
                                    row.append($('<td>').text(element.precisionRdv));
                                    row.append($('<td>').text(element.commentaires));
                                    row.append($('<td>').text("Ni Passager ni Conducteur"));
                                    row.append(
                                        $('<td>').append(
                                            $('<div>').addClass('div-container')
                                                .append(
                                                    $('<button>').addClass('signup-btn').attr('id', element.idTrajet)
                                                        .html("Demander à participer")
                                                )
                                        )
                                    );


                                    tbody.append(row);

                                })
                                .catch(errpr => {
                                    console.error(errpr);
                                });


                        }

                        table.append(tbody);

                    })
                    .catch(erreur => {
                        console.error(erreur);
                    });

            });


        })
        .catch(error => {
            console.error(error);
        });

}


$(document).on('click', '.actions-btn', function () {
    window.location.href = '/trajet/mes_trajets';



});


$(document).on('click', '.signup-btn', function () {
    let id = $(this).attr('id');
    console.log("on a clique sur voir tous les users avec l'id " + id);
    let u = new URL(window.location.href);
    u.searchParams.delete("id");
    let url = new URL(window.location.href);
    console.log(url);
    url.pathname = '/trajet';
    url.searchParams.set("id", id);
    window.location.href = url.href;



});