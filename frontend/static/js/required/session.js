// Fonction pour créer un cookie avec un token
function createTemporaryCookie(token) {
  // Cookie valide jusqu'à la fermeture du navigateur
  document.cookie = `myToken=${token}; path=/; max-age=0;`;
}

function createInfiniteCookie(token) {
  // Cookie valide 1 an
  const maxAge = 365 * 24 * 60 * 60;
  document.cookie = `myToken=${token}; path=/; max-age=${maxAge};`;
}

// Fonction pour récupérer le token depuis le cookie
function getCookieToken() {
  const cookieString = decodeURIComponent(document.cookie);
  const cookieArray = cookieString.split("; ");
  for (let cookie of cookieArray) {
    if (cookie.indexOf("myToken=") === 0) {
      return cookie.substring("myToken=".length, cookie.length);
    }
  }
  return null;
}

// Fonction pour supprimer le cookie avec un token donné
function deleteCookie(token) {
  document.cookie = `myToken=${token}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}


//Gérer affichage des boutons dans le menu
const connection = document.querySelector("li[name='connection']");
const deconnection = document.querySelector("li[name='deconnection']");
const profil = document.querySelector("li[name='profil']");

if (getCookieToken() === null){
  connection.style = "display: block;";
  deconnection.style = "display: none;";
  profil.style = "display: none";
} else {
  connection.style = "display: none";
}