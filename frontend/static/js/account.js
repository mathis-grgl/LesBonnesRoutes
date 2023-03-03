

function applyData() {
    console.log("La fonction a été exécutée !");

    fetch('/users')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de l'appel à la fonction get_users: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Gérer les données de réponse ici
            console.log(data);
            let user = data[0];
            let nom = user.nomCompte;
            let prenom = user.prenomCompte;
            let tel = user.telephone;
            let genre = user.genre;
            let email = user.email;
            let mdp = user.mdp;
            let voiture = user.voiture;
            let notif = user.notificationMail;
            console.log(nom + ' ' + prenom);
            $('#prenom').text(nom + ' ' + prenom);
            $('#telephone').text(tel);
            $('#email').text(email);
            
            switch (voiture) {
                case 0:
                    $('#voiture').text("L'utilisateur ne possède pas de voiture.");
                    break;
                case 1:
                    $('#voiture').text("L'utilisateur possède une voiture.");
                    break;


            }


        });
    //requete pour recupérer les données de l'utilisateur
    // prenom + nom + sexe
    // var prenom = document.getElementById("prenom");
    // prenom.innerHTML = "Joseph SCHLESINGER, ♂";

    // // adresse en entiere depuis requete
    var adresse = document.getElementById("adresse");
    adresse.innerHTML = "1 rue de la paix, 75000 Paris";

    // // La même pour le nombre de trajets
    var trajet = document.getElementById("trajets");
    trajet.innerHTML = "3";

    // // La même pour le nombre d'avis
    var avis = document.getElementById("avis");
    avis.innerHTML = "2";

    // // La même pour le numéro de téléphone
    // var telephone = document.getElementById("telephone");
    // telephone.innerHTML = "06 06 06 06 06";

    // // La même pour l'email
    // var email = document.getElementById("email");
    // email.innerHTML = "email@email.fr";

    // // La même pour la voiture
    // var voiture = document.getElementById("voiture");
    // voiture.innerHTML = "Ne possède pas de voiture";

    // // La même pour l'image de profil
    var image = document.getElementById("image");
    image.src = "https://www.w3schools.com/howto/img_avatar.png";

    // // La même pour le nombre d'étoiles
    // // requete pour récuperer le nombre d'étoiles.
    var selected_value = 3;

    for (i = 1; i <= selected_value; ++i) {
        var star = document.getElementById("rating-star-" + i);
        star.style.color = "#f8ce0b";
        console.log("rating-star-" + i + " en jaune");
    }
}




function onDelete() {
    if (window.confirm("Are you sure you want to delete your account?")) {
        //accéder à la base de données.
        //requete pour supprimer le compte.
        //fermer la base de données.
        window.location.href = "/";
    }
}

function onModify() {
    location.replace('/modifier');
}

