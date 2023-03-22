function checkTokenIsValid()
{
    let auth_token = null;

    const cookieString = decodeURIComponent(document.cookie);
    const cookieArray = cookieString.split("; ");
    for (let cookie of cookieArray) {
        if (cookie.indexOf("token=") === 0) {
        auth_token = cookie.substring("token=".length, cookie.length);
        break;
        }
    }

    if(auth_token) {
        console.log("Token valide");
        fetch('/compte/checkToken/' + auth_token)
        .then(reponse => {
            console.log("reponse");
            if (reponse.status === 404) {
                console.log("Token invalide");
                deleteCookie(auth_token);
                document.location.href = "/";
            }
        })
        .catch(error => {
            console.log("reponse");
            console.log(error);
        });
    }
}