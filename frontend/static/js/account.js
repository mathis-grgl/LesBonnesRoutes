
token = "9f36ad8ef1718c3c2258025e06e7eb2d"
const url = 'compte/getInfoCompte/' + token;
const urlDelete = 'compte/deleteCompte/' + token;
function applyData() {
    // La même pour l'image de profil (à enlever si on a la photo)
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
            //let photo = user.photo;
            let noteCompte = parseInt(user.noteCompte);
            
            // Cas de l'adresse
            $('#adresse').text(adresse + ', ' + ville + ' ' + codePostal + ', ' + pays);

            // Cas du nombre de notes (problème)
            $('#nbnotes').text(nbnotes);

            // Cas du nombre de trajets (problème)
            $('#nbtrajets').text(nbtrajets);
            console.log(nbtrajets);

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
                    genre = '♂dede';
                    break;
                case 'femme':
                    genre = '♀';
                    break;
                case 'Autre':
                    break;

            }
            // Cas du genre (problème)
            document.getElementById('genre').innerHTML = ", "+genre;
            console.log(genre);

            // Cas du nom et prénom
            $('#prenom').text(nom + ' ' + prenom);

            // Cas du téléphone
            $('#telephone').text(tel);
            
            // Cas de la voiture
            switch (voiture) {
                case 0:
                    $('#voiture').text("L'utilisateur ne possède pas de voiture.");
                    break;
                case 1:
                    $('#voiture').text("L'utilisateur possède une voiture.");
                    break;
            }

            // Cas de la photo
            //$('#image').attr('src', photo);

            // Cas de la note
            for (i = 1; i <= noteCompte; ++i) {
                $('#rating-star-' + i).css('color', '#f8ce0b');
            }
        });


}




function onDelete() {
    if (window.confirm("Are you sure you want to delete your account?")) {
        fetch(urlDelete, {
            method: 'DELETE',
          })
        .then(response => {
            if (response.ok) {
                // Redirection vers la page d'accueil
                location.replace("/");
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

