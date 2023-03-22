const notifCount = document.querySelector("div[name='notif-content']");
let dropdown = document.querySelector(".content");
const bellIcon = document.querySelector('.bell-icon');

//Activier le bouton cloche quand la page est chargée
window.addEventListener('load', function() {
  bellIcon.setAttribute('onclick', 'displayNotif(event)');
});


//Afficher les notifs
window.addEventListener('DOMContentLoaded', function() {
  if (tokenH != null){
    displayNotifs();
  }
});

iconWrapper.addEventListener('click', function() {
  iconWrapper.classList.toggle('active');
});

function displayNotifs(){
    //On adapte l'url selon la page actuelle
    let url = "compte/getNotifs/";
    if(!window.location.pathname.endsWith("index.html")){
      url = "../compte/getNotifs/";
    }

    //Récuperation des notifs et affichage
    fetch(url + tokenH)
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(async data => {
    dropdown.innerHTML = "";
    let childCount = 0;

    // Retirer l'attribut 'onclick' de la cloche pour eviter bug
    bellIcon.removeAttribute('onclick');

    // créer et ajouter chaque élément notify_item
    data.forEach(async res => {

        let notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notify_item', 'dropdown');

        notificationDiv.innerHTML = `<img id='${res.idNotification}' class='imgCroix' src='/static/images/croix.png'></img>`;
        notificationDiv.innerHTML += `<a href='#' class='btnAfficher btn-success'>Afficher</a>`;
        notificationDiv.querySelector('img').onclick = () => {
        deleteNotif(res.idNotification);
        }
        notificationDiv.querySelector('.btnAfficher').onclick = () => {
        openPopupNotif(res.idNotification);
        }

        let imgDiv = document.createElement('div');
        imgDiv.classList.add('notify_img');
        imgDiv.innerHTML = `<img id='image' src='${await getPhoto()}' alt='profile_pic' style='width: 50px;' class='rounded-circle'><p>${res.nomCompte}<br>${res.prenomCompte}</p>`;
        notificationDiv.appendChild(imgDiv);

        let infoDiv = document.createElement('div');
        infoDiv.classList.add('notify_info');
        notificationDiv.appendChild(infoDiv);

        let type = "";

        if (res.typeNotif === "Trajet"){
        await getTrajet(res.idTrajet)
        .then(res1 => {
            type = `<p>${res.typeNotif} : ${res1}</p>`;
        })
        .catch(error => {
            console.error('Problème dans le fetch', error);
        });
        } else if (res.typeNotif === "Groupe"){
          type = `<p>${res.typeNotif} : ${res.nomGroupe}</p>`;
        }

        infoDiv.innerHTML = type + `<p class="notify_message">${res.messageNotification}</p>`;
        dropdown.appendChild(notificationDiv);
    });

    if (data.length === 0){
      dropdown.innerHTML =
        "<div classe='notify_item dropdown'" +
            `<p class='notify_item' style='background-color: white; padding: 10px;'>Aucune notification</p>` +
        "</div>"
    } else {
      dropdown.innerHTML +=
        "<div classe='notify_item dropdown'" +
            `<a href='#' class='btn-danger btnSupprAll notify_item'>Tout supprimer</a>` +
        "</div>"

      dropdown.querySelector('.btnSupprAll').onclick = () => {
        deleteAllNotif();
      }
    }

    //On remet 'onclick' de la cloche pour eviter bug
    bellIcon.setAttribute('onclick', 'displayNotif(event)');

    // mettre à jour le compteur de notifications
    notifCount.setAttribute('data-number', data.length);
    })
    .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    });
}


function displayNotif(event){
  event.preventDefault();
  const notifs = document.querySelectorAll(".notify_item");
  const wrapper = document.querySelector(".icon-wrapper");

  notifs.forEach(notif => {
    if (notif.style.display === "flex"){
      notif.style.display = "none";
    } else {
      notif.style.display = "flex";
    }
  });

  dropdown.classList.toggle("active");
}


function getName(){
  fetch('compte/getNotifs/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

async function getTrajet(id){
  // Récuperer infos trajet
  try {
    const response = await fetch(`/trajet/trajet/${id}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.villeDepart + " -> " + data.villeArrivee;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

async function getGroupe(){
  // Récuperer infos trajet
  try {
    const response = await fetch(`/ami/getGroupes/${tokenH}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const nomsGroupes = data.map(groupe => groupe.nomGroupe);
    return nomsGroupes;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

async function getPhoto(){
  try {
    const response = await fetch(`/compte/getInfoCompte/${tokenH}`);
    if (!response.ok) {
      throw new Error("Erreur lors de l'appel à la fonction get_users: " + response.statusText);
    }
    const data = await response.json();
    if (data.photo != null) {
      return '/static/images/profils/' + data.photo;
    } else {
      return "/static/images/person_4.jpg";
    }
  } catch (error) {
    console.error('Erreur : ', error);
    throw error;
  }
}

function deleteNotif(id){
  fetch(`/compte/suppNotif/${tokenH}/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    return response.json();
  })
  .then(data => {
    console.log("Data : " + data);
    closePopupNotif();
    displayNotifs();

    /*if (dropdown.childElementCount === 0){
        dropdown.innerHTML =
        "<div classe='notify_item dropdown'" +
            `<p class='notify_item' style='background-color: white; padding: 10px;'>Aucune notification</p>` +
        "</div>"
    }*/
  })
  .catch(error => {
    console.error('Erreur : ', error);
  });
}

function deleteAllNotif(){
  fetch(`/compte/suppAllNotif/${tokenH}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    return response.json();
  })
  .then(data => {
    console.log("Data : " + data);
    displayNotifs();

    /*dropdown.innerHTML =
    "<div classe='notify_item dropdown'" +
        `<p class='notify_item' style='background-color: white; padding: 10px;'>Aucune notification</p>` +
    "</div>"*/
  })
  .catch(error => {
    console.error('Erreur : ', error);
  });
}

function openPopupNotif(id) {
  document.getElementById("popup-container-notif").style.display = "block";
  const content = document.querySelector("div[id='popup-notif']");

  //Récuperation des notifs et affichage
  fetch('/compte/getNotifs/' + tokenH)
  .then(response => {
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
  })
  .then(async data => {
  data.forEach(obj => console.log(obj));

  // créer et ajouter chaque élément notify_item
  data.forEach(async res => {
    console.log("Notifs : " + id + " : " + res.idNotification);
    if (res.idNotification === id){
        content.innerHTML = 
        `<div class="notify_item" style='display: flex;'>
            <div class="notify_img">
                <img src="${await getPhoto()}" alt="" style='width: 50px;' class='rounded-circle'>
                <p>${res.nomCompte}<br>${res.prenomCompte}</p>
            </div>
            <div class="notify_info">
                ${res.typeNotif === "Trajet" ? `<p>${res.typeNotif} : ${await getTrajet(res.idTrajet)}</p>` :
                res.typeNotif === "Groupe" ? `<p>${res.typeNotif} : ${res.nomGroupe}</p>` : ''}
                <p class="notif-message">${res.messageNotification}</p>
            </div>
        </div>
        <div class="popup-btn">
            <button class="btn btn-success btn-block text-white" style="margin: 10px;" onclick="closePopupNotif()">Fermer</button>
            <button class="btn btn-danger btn-block text-white" style="margin: 10px;" onclick="deleteNotif(${res.idNotification})">Supprimer</button>
        </div>`;
    }  

    // mettre à jour le compteur de notifications
    notifCount.setAttribute('data-number', data.length);
    })
    })
  .catch(error => {
  console.error('There was a problem with the fetch operation:', error);
  });
}

function closePopupNotif() {
  document.getElementById("popup-container-notif").style.display = "none";
}