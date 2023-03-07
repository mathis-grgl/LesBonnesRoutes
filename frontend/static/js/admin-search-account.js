tokenAdmin = getCookieToken();

$(document).ready(function () {
    var table = getAccountTable();
    $("[data-toggle=tooltip]").tooltip();

    // Ajout des utilisateurs depuis la BDD
    fetch('/admin/users')
    .then(reponse => {
      if (!reponse.ok) {
        throw new Error('Network response was not ok');
      }
      return reponse.json();
    })
    .then(data => {
      let nbCompte = data.length;
      let user = [];
      for (let i = 0; i < nbCompte; i++) {
        let account = data[i];
        
        // Création d'une nouvelle ligne
        let tr = document.createElement("tr");

        // Ajout du nom d'utilisateur
        let tdNom = document.createElement("td");
        tdNom.textContent = account.nomCompte + ' ' + account.prenomCompte;
        tr.appendChild(tdNom);

        // Ajout du genre
        let tdGenre = document.createElement("td");
        tdGenre.textContent = account.genre;
        tr.appendChild(tdGenre);

        // Ajout de la photo
        let tdImg = document.createElement("td");
        let img = document.createElement("img");
        img.src = "/static/images/person_" + i + ".jpg";
        img.alt = account.nomCompte;
        img.width = 64;
        img.height = 64;
        tdImg.appendChild(img);
        tr.appendChild(tdImg);

        // Ajout de l'e-mail
        let tdEmail = document.createElement("td");
        let aEmail = document.createElement("a");
        aEmail.classList.add("emailLink");
        aEmail.href = 'mailto:' + account.email;
        aEmail.textContent = account.email;
        tdEmail.appendChild(aEmail);
        tr.appendChild(tdEmail);

        // Ajout du numéro de téléphone
        let tdTelephone = document.createElement("td");
        tdTelephone.textContent = "(+33) " + account.telephone;
        tr.appendChild(tdTelephone);

        // Ajout de la note
        let tdNote = document.createElement("td");
        if (account.noteCompte != null) {
          tdNote.innerHTML = `
            <div class="rating">
              <div class="stars" style="width:` + 100*account.noteCompte/5.0 +`%">
                <span></span>
              </div>
              <span class="rating-value">` + account.noteCompte + " / 5" + `</span>
            </div>
          `;
        } else {
          tdNote.innerHTML = "N/A";
          // tdNote.innerHTML = `
          //   <div class="rating">
          //     <div class="stars" style="width:0%">
          //       <span></span>
          //     </div>
          //     <span class="rating-value">N/A</span>
          //   </div>
          // `;
        }
        tr.appendChild(tdNote);

        // Ajout du bouton modifier
        let tdEdit = document.createElement("td");
        let pEdit = document.createElement("p");
        pEdit.setAttribute("data-placement", "top");
        pEdit.setAttribute("data-toggle", "tooltip");
        pEdit.setAttribute("title", "Edit");

        //Création du bouton modifier
        let btnEdit = document.createElement("a");
        btnEdit.classList.add("btn", "btn-primary", "btn-xs");
        btnEdit.onclick = () => {
          location.href = "/admin/account/edit/" + account.idCompte;
        }
        btnEdit.setAttribute("href", "/admin/account/edit/" + account.idCompte);
        btnEdit.setAttribute("data-title", "Edit");
        btnEdit.setAttribute("data-toggle", "modal");
        btnEdit.setAttribute("data-target", "#edit");

        //Logo du bouton modifier
        let spanEdit = document.createElement("span");
        spanEdit.classList.add("fa", "fa-pencil");

        //Imbrication des éléments pour le bouton modifier
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

        //Création du bouton supprimer
        let btnDelete = document.createElement("a");
        btnDelete.classList.add("btn", "btn-danger", "btn-xs");
        btnDelete.onclick = () => {
          location.href = "/admin/account/delete/" + account.idCompte;
        }
        btnDelete.setAttribute("onclick", "onDeleteAccount(" + account.idCompte+")");
        btnDelete.setAttribute("data-title", "Delete");
        btnDelete.setAttribute("data-toggle", "modal");
        btnDelete.setAttribute("data-target", "#delete");

        //Logo du bouton supprimer
        let spanDelete = document.createElement("span");
        spanDelete.classList.add("fa", "fa-trash", "white_button");

        //Imbrication des éléments pour le bouton supprimer
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

function onDeleteAccount(id) {
  if (confirm("Voulez-vous vraiment supprimer ce compte ?")) {
    fetch('/admin/deleteCompte/'+ tokenAdmin + '/' + id, {
      method: 'DELETE'
    }).then(response => {
      if (response.ok) {
        location.reload();
      } else {
        alert("Une erreur est survenue lors de la suppression du compte.");
      }
    });
  }
}