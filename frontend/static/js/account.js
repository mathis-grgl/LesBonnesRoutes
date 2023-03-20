let token = getCookieToken();
const url = 'compte/getInfoCompte/' + token;
const urlDelete = 'compte/deleteCompte/' + token;

function applyData() {
    if(token == null) {
        location.href = "login_signup";
    } else {   

        // Image de profil par défaut
        var image = document.getElementById("image");
        image.src = "https://www.w3schools.com/howto/img_avatar.png";
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de l'appel à la fonction get_users: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Gérer les données de réponse ici
                let user = data;
                let nom = user.nomCompte;
                let prenom = user.prenomCompte;
                let tel = user.telephone;
                let genre = user.genre;
                let adresse = user.adresse;
                let pays = user.pays;
                let ville = user.ville;
                let codePostal = user.codePostal;
                let email = user.email;
                let voiture = user.voiture;
                let notif = user.notificationMail;
                let nbnotes = user.nbnotes;
                let nbtrajets = user.nbtrajets;
                let photo = user.photo;
                // Cas de la photo
                /*if (photo != null) {
                    fetch(photo)
                    .then(response => response.blob())
                    .then(blob => {
                        document.querySelector("img[id=image]").src = URL.createObjectURL(blob); // Modification à apporter
                    });
                }*/
                if (data.photo != null) {
                    // Convertir la photo encodée en base64 en objet Image
                    const img = new Image();
                    img.src = 'static/images/profils/' + data.photo;
                    // Afficher l'image
                    document.querySelector("img[id=image]").src = img.src;
                }
                let noteCompte = parseInt(user.noteCompte);
                
                // Cas de l'adresse
                $('#adresse').text(adresse + ', ' + ville + ' ' + codePostal + ', ' + pays);

                // Cas du nombre de notes
                document.getElementById("nbnotes").innerHTML = nbnotes + document.getElementById("nbnotes").innerHTML;

                // Cas du nombre de trajets
                document.getElementById("nbtrajets").innerHTML = nbtrajets + document.getElementById("nbtrajets").innerHTML;

                // Cas de la notification et de l'email
                switch (notif) {
                    case 0:
                        notif = "❌📧";
                        break;
                    case 1:
                        notif = "✅📧";
                        break;
                }
                $('#email').text(email + ' ' + notif);

                // Cas du genre et du nom et prénom
                switch(genre){
                    case 'homme':
                        genre = '♂';
                        break;
                    case 'femme':
                        genre = '♀';
                        break;
                    case 'Autre':
                        break;

                }
                $('#prenom').text(nom + ' ' + prenom + ' ' + genre);

                // Cas du téléphone
                $('#telephone').text(tel);
                
                // Cas de la voiture
                switch (voiture) {
                    case 0:
                        $('#voiture').text("Ne possède pas de voiture.");
                        break;
                    case 1:
                        $('#voiture').text("Possède une voiture.");
                        break;
                }

                // Cas de la note
                for (i = 1; i <= noteCompte; ++i) {
                    $('#rating-star-' + i).css('color', '#f8ce0b');
                }
            });

    }  
}        


function onDelete() {
    if (window.confirm("Are you sure you want to delete your account?")) {
        fetch(urlDelete, {
            method: 'DELETE',
          })
        .then(response => {
            if (response.ok) {
                // Suppression du cookie
                deleteCookie(getCookieToken());
                // Redirection vers la page d'accueil
                window.location.href = "/";
                return response.json();
            } else {
                throw new Error('Erreur : ' + response.status);
            }
        })
    }
}

function onModify() {
    location.replace('/modifier');
    history.pushState(null, null, document.URL);
}

