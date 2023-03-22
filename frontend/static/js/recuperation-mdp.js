function checkValue(val) {
    var variable = document.querySelector("input[name=" + val + "]");
    var regex;
    var bool = false;

    if(val === "email")
    {
        regex = /.+@.+\.[A-Za-z]{2,}/;
        if (!regex.test(variable.value)){
            variable.style.setProperty("border", "1px solid #ff0000");
        } else {
            variable.style.setProperty("border", "1px solid #000000");
            bool = true;
        }
    }

    return bool;
}

function sendEmail(val) {
    if (checkValue(val)) {
        fetch('/mail/modifMdp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.querySelector("input[name=email]").value
            })
        })
        .then(response => {
            if (response.status === 200) {
                alert("Email envoyé");
            } else {
                alert("Erreur lors de l'envoi de l'email");
            }

            window.close();
        }).catch(error => {
            console.log(error);
        });
    }
}