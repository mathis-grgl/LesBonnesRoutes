//Gérer affichage des boutons dans le menu
const connection = document.querySelector("li[name='connection']");
const deconnection = document.querySelector("li[name='deconnection']");
const profil = document.querySelector("li[name='profil']");
const rechercherTrajet = document.querySelector("li[name='mes_offres']");
const groupes = document.querySelector("li[name='groupes']");
const iconWrapper = document.querySelector('.icon-wrapper');
const tokenH = getCookieToken();

if (tokenH === null){
  connection.style = "display: block;";
  deconnection.style = "display: none;";
  profil.style = "display: none";
  rechercherTrajet.style = "display: none";
  groupes.style = "display: none";
  iconWrapper.style = "display: none;";
} else {
  connection.style = "display: none";
}