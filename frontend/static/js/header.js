//Gérer affichage des boutons dans le menu
const connection = document.querySelector("li[name='connection']");
const deconnection = document.querySelector("li[name='deconnection']");
const profil = document.querySelector("li[name='profil']");
const rechercherTrajet = document.querySelector("li[name='mes_offres']");
const groupes = document.querySelector("li[name='groupes']");
const notifCount = document.querySelector("div[name='notif-content']");
let dropdown = document.querySelector(".content");
const tokenH = getCookieToken();

if (tokenH === null){
  connection.style = "display: block;";
  deconnection.style = "display: none;";
  profil.style = "display: none";
  rechercherTrajet.style = "display: none";
  groupes.style = "display: none";
} else {
  connection.style = "display: none";
}

const iconWrapper = document.querySelector('.icon-wrapper');
iconWrapper.addEventListener('click', function() {
  iconWrapper.classList.toggle('active');
});


//Récuperation des notifs et affichage
fetch('compte/getNotifs/' + tokenH)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(async data => {
  console.log("Data : ");
  data.forEach(obj => console.log(obj));

  // créer et ajouter chaque élément notify_item
  data.forEach(async res => {

    let notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notify_item', 'dropdown');

    notificationDiv.innerHTML = `<img id='${res.idNotif}' class='imgCroix' src='/static/images/croix.png'></img>`;
    notificationDiv.innerHTML += `<a href='#' class='btnAfficher btn-success'>Afficher</a>`;
    notificationDiv.querySelector('img').onclick = () => {
      deleteNotif(res.idNotification);
    }
    notificationDiv.querySelector('.btnAfficher').onclick = () => {
      openPopupNotif();
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
      await getGroupe()
      .then(res1 => {
        type = `<p>${res.typeNotif} : ${res1}</p>`;
      })
      .catch(error => {
          console.error('Problème dans le fetch', error);
      });
    }

    infoDiv.innerHTML = type + `<p>${res.messageNotification}</p>`;
    dropdown.appendChild(notificationDiv);
});
  dropdown.innerHTML +=
  "<div classe='notify_item dropdown'" +
    `<a href='#' class='btn-danger btnSupprAll notify_item'>Tout supprimer</a>` +
  "</div>"
  dropdown.querySelector('.btnSupprAll').onclick = () => {
    deleteAllNotif();
  }
  // mettre à jour le compteur de notifications
  notifCount.setAttribute('data-number', data.length);
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});


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
  fetch(`compte/suppNotif/${tokenH}/${id}`, {
    method: 'POST',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    return response.json();
  })
  .then(data => {
    console.log("Data : " + data);
  })
  .catch(error => {
    console.error('Erreur : ', error);
  });
}

function deleteAllNotif(){
  fetch(`compte/suppAllNotif/${tokenH}`, {
    method: 'POST',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    return response.json();
  })
  .then(data => {
    console.log("Data : " + data);
  })
  .catch(error => {
    console.error('Erreur : ', error);
  });
}