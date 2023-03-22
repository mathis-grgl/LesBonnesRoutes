
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
                                        row.append($('<td>').text("Passager" + ', Conducteur : ' + nomConducteur));
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
                            console.log(donne[i]);
                            // ok note à moi même après la salle : utiliser la variable dedans et faire l'affichage après la boucle for
                            // en utilisant dedans et ensuite je refais des tests (maybe rajouter des autres booleens pour savoir si c'est 
                            // un conducteur ou un passager ou aucun des deux)
                            if (element.idCompte === element.idConducteur) {
                                console.log("La personne co est le conduc.");
                                passager = false;
                                dedans = true;
                                conducteur = true;
                            }
                            if (element.idCompte === donne[i].idCompte && element.idCompte !== element.idConducteur) {
                                console.log("c'est un passager.");
                                conducteur = false;
                                passager = true;

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

                        if (dedans && passager && donne.length !== 0) {
                            let ligne = $("<tr>");
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
                        }

                        console.log("dedans : " + dedans);
                        if (!dedans && donne.length !== 0) {
                            //on est rien du tout mais il y a d'autres passagers qu'on peut rejoindre
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
                                    row.append($('<td>').text("Passager" + ', Conducteur : ' + nomConducteur));
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


                        // console.log(tab[0][0]);
                    })
                    .catch(erreur => {
                        console.error(erreur);
                    });

            });


        })
        .catch(error => {
            console.error(error);
        });

    // console.log(tab);
    // console.log(t);


    // fetch(url)
    // .then(reponse => {
    //     if(!reponse.ok){
    //         throw new Error(reponse.statusText);
    //     }
    //     return reponse.json();
    // })
    // .then(data => {
    //     console.log(data);
    //     let table = $('#trajets');
    //     let tbody = $("<tbody>");
    //     for (let i = 0; i < data.length; i++) {

    //         //Affectation des données de chaque trajet
    //         let trajet = data[i];
    //         let date = data[i].dateDepart;
    //         let heure = data[i].heureDepart.replace('h', ':');
    //         console.log(date);
    //         let dateObject = moment(date, 'D MMMM, YYYY');
    //         // let dateObject = moment(date, 'YYYY/MM/DD');

    //         let dateFormatted = dateObject.format('YYYY-MM-DD');
    //         console.log(dateFormatted);

    //         // Trajet crée par l'utilisateur
    //         if (trajet.idCompte == trajet.idConducteur) {
    //             console.log("Le trajet correspond à un trajet que l'utilisateur connecté a crée.")
    //             let ligne = $("<tr>");

    //             ligne.append($('<td>').text(trajet.villeDepart));
    //             ligne.append($('<td>').text(trajet.villeArrivee));
    //             ligne.append($('<td>').text(dateObject.format('DD-MM-YYYY')));
    //             ligne.append($('<td>').text(trajet.heureDepart));
    //             ligne.append($('<td>').text(trajet.nbPlacesRestantes + '/' + trajet.nbPlaces));
    //             ligne.append($('<td>').text(trajet.statusTrajet));
    //             ligne.append($('<td>').text(trajet.prix + '€'));
    //             ligne.append($('<td>').text(trajet.precisionRdv));
    //             ligne.append($('<td>').text(trajet.commentaires));
    //             ligne.append($('<td>').text("Conducteur"));
    //             ligne.append(
    //                 $('<td>').attr('id', trajet.idTrajet)
    //                     .append(
    //                         $('<div>').addClass('div-container')
    //                             .append(
    //                                 $('<button>').addClass('confirm-btn').attr('id', trajet.idTrajet)
    //                                     .html("<i class='fas fa-check'></i>"),
    //                                 $('<button>').addClass('details-btn').attr('id', trajet.idTrajet)
    //                                     .html("<i class='fas fa-users'></i>"),
    //                                 $('<button>').addClass('edit-btn').attr('id', trajet.idTrajet)
    //                                     .html("<i class='fas fa-edit'></i>"),
    //                                 $('<button>').addClass('delete-btn').attr('id', trajet.idTrajet)
    //                                     .html("<i class='fas fa-trash'></i>")



    //                             )
    //                     )
    //             );
    //             if (differenceMS > (24 * 60 * 60 * 1000)) {
    //                 // Il y a plus de 24 heures d'écart entre les deux dates
    //                 console.log("Il y a plus de 24 heures d'écart entre la date d'aujourd'hui et l'autre date.");


    //             } else {
    //                 // Il n'y a pas plus de 24 heures d'écart entre les deux dates
    //                 $('.delete-btn#' + trajet.idTrajet).remove();
    //             }

    //             tbody.append(ligne);


    //         } else {
    //             console.log("Le trajet correspond à un trajet que l'utilisateur connecté participe.")

    //             // Récupération du nom du conducteur
    //             let nomConducteur = "";
    //             fetch(getCompteURL + trajet.idConducteur)
    //                 .then(reponse => {
    //                     if (!reponse.ok) {
    //                         throw new Error('Network response was not ok');
    //                     }
    //                     return reponse.json();
    //                 })
    //                 .then(data => {
    //                     nomConducteur = data.nomCompte;
    //                     console.log(nomConducteur);
    //                     let row = $("<tr>");
    //                     row.append($('<td>').text(trajet.villeDepart));
    //                     row.append($('<td>').text(trajet.villeArrivee));
    //                     row.append($('<td>').text(dateObject.format('DD-MM-YYYY')));
    //                     row.append($('<td>').text(trajet.heureDepart));
    //                     row.append($('<td>').text(trajet.nbPlacesRestantes + '/' + trajet.nbPlaces));
    //                     row.append($('<td>').text(trajet.statusTrajet));
    //                     row.append($('<td>').text(trajet.prix + '€'));
    //                     row.append($('<td>').text(trajet.precisionRdv));
    //                     row.append($('<td>').text(trajet.commentaires));
    //                     row.append($('<td>').text("Passager" + ', Conducteur : ' + nomConducteur));
    //                     row.append(
    //                         $('<td>').append(
    //                             $('<div>').addClass('div-container')
    //                                 .append(

    //                                     $('<button>').addClass('cancel-btn').attr('id', trajet.idTrajet)
    //                                         .html("<i class='fas fa-times'></i>")
    //                                 )
    //                         )
    //                     );


    //                     tbody.append(row);

    //                 });
    //         }





    //     }

    //     table.append(tbody);
    // })
    // .catch(error => {
    //     console.error(error);
    // });

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