//Gérer affichage des boutons dans le menu
const connection = document.querySelector("li[name='connection']");
const deconnection = document.querySelector("li[name='deconnection']");
const profil = document.querySelector("li[name='profil']");
const rechercherTrajet = document.querySelector("li[name='mes_offres']");
const groupes = document.querySelector("li[name='groupes']");
const iconWrapper = document.querySelector('.icon-wrapper');
const admin = document.querySelector("li[name='admin']");
const tokenH = getCookieToken();
let isAdmin = false;

fetch('/users/'+ tokenH + '/isadmin')
    .then(reponse => {
        if (!reponse.ok) {  throw new Error(reponse.statusText); }
        return reponse.json();
    })
    .then(data => {
        if (data.isAdmin === true) {
            isAdmin = true;
        }
    })
    .catch(error => {
        console.error(error);
    })

if (tokenH === null){
  connection.style = "display: block;";
  deconnection.style = "display: none;";
  profil.style = "display: none";
  rechercherTrajet.style = "display: none";
  groupes.style = "display: none";
  iconWrapper.style = "display: none;";
  admin.style = "display: none;";
} else {
  connection.style = "display: none";
  if (isAdmin) admin.style = "display: block;";
  else admin.style = "display: none;";
}