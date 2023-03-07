const token = getCookieToken();
console.log(token);
const url = 'trajet/trajetsCompte/' + token;
console.log(url);


function charger_trajets(){
    console.log("On est appelé.")
    fetch(url)
    .then(reponse => {
        if (!reponse.ok) {
            throw new Error('Network response was not ok');
          }
          return reponse.json();
    })
    .then(data => {
        console.log(data);
        let nbTrajets = data.length;
        console.log(nbTrajets);
        let table = $('#trajets');
        let tbody = $("<tbody>");
        for (let i = 0; i < nbTrajets; i++){
            let trajet = data[i];
            console.log(trajet);
            let row = $("<tr>");
            row.append($('<td>').text(trajet.villeDepart));
            row.append($('<td>').text(trajet.villeArrivee));
            row.append($('<td>').text(trajet.dateDepart));
            row.append($('<td>').text(trajet.heureDepart));
            row.append($('<td>').text(trajet.nbPlacesRestantes + '/' + trajet.nbPlaces));
            row.append($('<td>').text(trajet.statusTrajet));
            row.append($('<td>').text(trajet.prix + '€' ));
            row.append($('<td>').text(trajet.precisionRdv));
            row.append($('<td>').text(trajet.commentaires));
            tbody.append(row);



            
        }

        table.append(tbody);
        // let nbCompte = data.length;
        //     let table = $('#accountTable');
        //     let tbody = $("<tbody>");
        //     for (let i = 0; i < nbCompte; i++) {
        //       let account = data[i];
        //       console.log(account.nomCompte);
        //       let tr = $("<tr>");
        //       tr.append($('<td>').append($('<img>').attr('src', "static/images/person_" + i + ".jpg").attr('alt', account.nomCompte).attr('width', 64).attr('height', 64)));
        //       tr.append($('<td>').text(account.nomCompte + ' ' + account.prenomCompte));
        //       tr.append($('<td>').text(account.genre));
        //       tr.append($('<td>').append($('<a>').attr('href', 'mailto:' + account.email).text(account.email)));
        //       tr.append($('<td>').text(account.telephone));
        //       tr.append($('<td>').text(account.noteCompte));
        //       tr.append($('<td>').append($('<p>').attr('data-placement', 'top').attr('data-toggle', 'tooltip').attr('title', 'Edit').append($('<button>').addClass('btn btn-primary btn-xs').attr('data-title', 'Edit').attr('data-toggle', 'modal').attr('data-target', '#edit').append($('<span>').addClass('fa fa-pencil')))));
        //       tr.append($('<td>').append($('<p>').attr('data-placement', 'top').attr('data-toggle', 'tooltip').attr('title', 'Delete').append($('<button>').addClass('btn btn-danger btn-xs').attr('data-title', 'Delete').attr('data-toggle', 'modal').attr('data-target', '#delete').append($('<span>').addClass('fa fa-trash')))));
        //       tbody.append(tr);

        //     }
        //     table.append(tbody);


    })
    .catch(error => {
        console.error(error);
    })
}