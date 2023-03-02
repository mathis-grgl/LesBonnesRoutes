const logoutButton = document.getElementById('logout-button');




logoutButton.addEventListener('click', (event) => {
  // Gérer la déconnexion de l'utilisateur
  event.preventDefault();

  // Supprime la session utilisateur
  sessionStorage.removeItem('user');

  console.log("On se déconnecte.");

  // Redirige l'utilisateur vers la page de connexion
  location.replace('file:///Users/romain/PPIL/Les-Bonnes-Routes/frontend/deconnexion.html');


});




