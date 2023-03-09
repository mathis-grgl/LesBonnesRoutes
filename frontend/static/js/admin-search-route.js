tokenAdmin = getCookieToken();

function onLoad(){
    if(getCookieToken() == null){
        location.href = "../login_signup";
    }
}


$(document).ready(function () {
    var table = getRouteTable();
    $("[data-toggle=tooltip]").tooltip();

    // Ajout des trajets depuis la BDD
    fetch('/admin/trajets')
    .then(reponse => {
    if (!reponse.ok) {
        throw new Error('Network response was not ok');
    }
    return reponse.json();
    })
    .then(data => {
    // console.log(data);
    let nbTrajet = data.length;
    let user = [];
    for (let i = 0; i < nbTrajet; i++) {
        let route = data[i];
        
        // Création d'une nouvelle ligne
        let tr = document.createElement("tr");

        // Ajout de la ville de départ
        let tdVilleDepart = document.createElement("td");
        tdVilleDepart.textContent = route.villeDepart;
        tr.appendChild(tdVilleDepart);

        // Ajout de la ville d'arrivée
        let tdVilleArrivee = document.createElement("td");
        tdVilleArrivee.textContent = route.villeArrivee;
        tr.appendChild(tdVilleArrivee);

        // Ajout de la date de départ
        let tdDateDepart = document.createElement("td");
        tdDateDepart.textContent = "Le " + route.dateDepart + " à " + route.heureDepart;
        // tdDateDepart.textContent = route.dateDepart;
        tr.appendChild(tdDateDepart);

        // // Ajout de l'heure' de départ
        // let tdHeureDepart = document.createElement("td");
        // tdHeureDepart.textContent = route.heureDepart;
        // tr.appendChild(tdHeureDepart);

        // Ajout du prix
        let tdPrix = document.createElement("td");
        tdPrix.textContent = route.prix + " €";
        tr.appendChild(tdPrix);
        
        // Ajout du nombre de places restantes
        let tdNbPlacesRestantes = document.createElement("td");
        tdNbPlacesRestantes.textContent = route.nbPlacesRestantes;
        tr.appendChild(tdNbPlacesRestantes);

        // Ajout du statut
        let tdStatut = document.createElement("td");
        tdStatut.textContent = route.statusTrajet;
        tr.appendChild(tdStatut);


        //todo: ajouter conducteur



        // Ajout du bouton modifier
        let tdEdit = document.createElement("td");
        let pEdit = document.createElement("p");
        pEdit.setAttribute("data-placement", "top");
        pEdit.setAttribute("data-toggle", "tooltip");
        pEdit.setAttribute("title", "Edit");

        let btnEdit = document.createElement("a");
        btnEdit.classList.add("btn", "btn-primary", "btn-xs");
        // btnEdit.onclick = () => {
        //   location.href = "/admin/route/" + route.idTrajet + "/edit/";
        // }
        btnEdit.setAttribute("onclick", "onModifyRoute(" + route.idTrajet + ")");
        btnEdit.setAttribute("data-title", "Edit");
        btnEdit.setAttribute("data-toggle", "modal");
        btnEdit.setAttribute("data-target", "#edit");

        let spanEdit = document.createElement("span");
        spanEdit.classList.add("fa", "fa-pencil");
        btnEdit.appendChild(spanEdit);
        pEdit.appendChild(btnEdit);
        tdEdit.appendChild(pEdit);
        tr.appendChild(tdEdit);

        // Ajout du bouton supprimer
        let tdDelete = document.createElement("td");
        let pDelete = document.createElement("p");
        pDelete.setAttribute("data-placement", "top");
        pDelete.setAttribute("data-toggle", "tooltip");
        pDelete.setAttribute("title", "Delete");

        let btnDelete = document.createElement("a");
        btnDelete.classList.add("btn", "btn-danger", "btn-xs");
        // btnDelete.onclick = () => {
        //   location.href = "/admin/route/delete/" + route.idTrajet;
        // }
        btnDelete.setAttribute("onclick", "onDeleteRoute(" + route.idTrajet + ")");
        btnDelete.setAttribute("data-title", "Delete");
        btnDelete.setAttribute("data-toggle", "modal");
        btnDelete.setAttribute("data-target", "#delete");

        let spanDelete = document.createElement("span");
        spanDelete.classList.add("fa", "fa-trash");
        btnDelete.appendChild(spanDelete);
        pDelete.appendChild(btnDelete);
        tdDelete.appendChild(pDelete);
        tr.appendChild(tdDelete);

        // Ajout de la ligne complète
        table.row.add(tr).draw(false);
    }
    }).catch(error => {
    console.error(error);
    });
});



function onDeleteRoute(id) {
    if (confirm("Voulez-vous vraiment supprimer ce trajet ?")) {
    fetch('/admin/deleteTrajet/'+ tokenAdmin + '/' + id, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
        location.reload();
        } else {
        alert("Une erreur est survenue lors de la suppression du trajet.");
        console.log(response);
        }
    });
    }
}

function onModifyRoute(id) {
    location.href = "/admin/route/edit/" + id;
}