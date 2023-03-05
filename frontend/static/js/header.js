//Gérer affichage des boutons dans le menu
const connection = document.querySelector("li[name='connection']");
const deconnection = document.querySelector("li[name='deconnection']");
const profil = document.querySelector("li[name='profil']");

if (getCookieToken() === null && connection !== null && deconnection !== null && profil !== null){
  connection.style = "display: block;";
  deconnection.style = "display: none;";
  profil.style = "display: none";
} else {
  connection.style = "display: none";
}