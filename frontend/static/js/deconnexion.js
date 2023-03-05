function deconnect(event){
  event.preventDefault();

  fetch('/compte/deconnectCompte/' + getCookieToken(),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erreur : ' + response.status);
      }
    })
    .then(data => {
      deleteCookie(getCookieToken());
      console.log("On se déconnecte.");
      location.replace('/deconnexion');
    })
    .catch(error => {
      console.error('Erreur : ' + error.message);
    });
}