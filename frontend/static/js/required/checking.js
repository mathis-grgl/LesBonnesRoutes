window.onload = function() {
    const auth_token = getCookieToken()
    if(auth_token) {
      fetch('/compte/checkToken/' + auth_token)
        .then(reponse => {
            console.log(reponse);
            if (reponse.status === 404) {
                deleteCookie(auth_token)
                window.location.href = "/";
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
};