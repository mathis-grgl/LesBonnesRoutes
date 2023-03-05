// Fonction pour créer un cookie avec un token
function createCookie(token) {
  document.cookie = `myToken=${token}; path=/; max-age=3600;`;
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