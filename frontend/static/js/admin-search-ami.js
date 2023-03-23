$(document).ready(function () {
    tokenAdmin = getCookieToken();

    if(getCookieToken() == null){
        location.href = "../../login_signup";
    }
    var table = getAmiTable();
    $("[data-toggle=tooltip]").tooltip();

    // Ajout des trajets depuis la BDD
    fetch('/admin/getGroupes/' + tokenAdmin)
    .then(reponse => {
    if (!reponse.ok) {
        throw new Error('Network response was not ok');
    }
    return reponse.json();
    })
    .then(data => {
    // console.log(data);
    let nbGroupes = data.length;
    for (let i = 0; i < nbGroupes; i++) {
        let groupe = data[i];
        let idGroupe = parseInt(i)+1;
        // console.log(idGroupe);
        // console.log(groupe);
        
        // Création d'une nouvelle ligne
        let tr = document.createElement("tr");

        // Ajout du créateur
        let tdCreateur = document.createElement("td");
        tdCreateur.innerHTML = groupe.nomCreateur;
        tr.appendChild(tdCreateur);

        // Ajout du nom du groupe
        let tdNom = document.createElement("td");
        tdNom.innerHTML = groupe.nomGroupe;
        tr.appendChild(tdNom);

        // Ajout du nombre de membres
        let tdNbMembres = document.createElement("td");
        tdNbMembres.innerHTML = groupe.nbPersonnes;
        tr.appendChild(tdNbMembres);


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
        btnEdit.setAttribute("onclick", "onModifyGroupe(" + i+1 + ")");
        btnEdit.setAttribute("data-title", "Edit");
        btnEdit.setAttribute("data-toggle", "modal");
        btnEdit.setAttribute("data-target", "#edit");

        let spanEdit = document.createElement("span");
        spanEdit.classList.add("fa", "fa-pencil", "white_button");
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
        btnDelete.setAttribute("onclick", "onDeleteGroupe(" + idGroupe + ")");
        btnDelete.setAttribute("data-title", "Delete");
        btnDelete.setAttribute("data-toggle", "modal");
        btnDelete.setAttribute("data-target", "#delete");

        let spanDelete = document.createElement("span");
        spanDelete.classList.add("fa", "fa-trash", "white_button");
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



function onDeleteGroupe(id) {
    if (confirm("Voulez-vous vraiment supprimer ce trajet ?")) {
    fetch('/admin/supprimerGroupe/'+ tokenAdmin + '/' + id, {
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

function onModifyGroupe(id) {
    location.href = "/admin/ami/edit/" + id;
}