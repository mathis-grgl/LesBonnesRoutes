// Fonction pour créer un cookie avec un token
function createTemporaryCookie(token) {
  document.cookie = "token=" + token + "; max-age=0";
}

function createInfiniteCookie(token) {
  // Cookie valide 1 an
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  const expirationString = expirationDate.toUTCString();
  document.cookie = "token=" + token + "; expires=" + expirationString + "; path=/";
}

// Fonction pour récupérer le token depuis le cookie
function getCookieToken() {
  const cookieString = decodeURIComponent(document.cookie);
  const cookieArray = cookieString.split("; ");
  for (let cookie of cookieArray) {
    if (cookie.indexOf("token=") === 0) {
      return cookie.substring("token=".length, cookie.length);
    }
  }
  return null;
}

// Fonction pour supprimer le cookie avec un token donné
function deleteCookie(token) {
  document.cookie = `token=${token}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}


