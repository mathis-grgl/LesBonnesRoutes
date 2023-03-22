function changerMdp() {
    var password = document.getElementById("password").value;
    const queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var token = urlParams.get('id');

    fetch('/compte/modifMdp/' + token + "/" + password, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.ok && response.status == 200) {
        alert("Mot de passe modifié avec succès !");
        window.location.href = "/login_signup";
      } else {
        throw new Error('Something went wrong');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}