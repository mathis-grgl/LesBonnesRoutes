let id = null;
let token = null;
let mdp = null;

$(document).ready(function () {
    // Récupération du token admin
    token = getCookieToken();

    // Si le token est null, on redirige vers la page de connexion
    if (token == null) {
        window.location.href = "../../../login_signup";
    } 
    
    else {

        // get last character of url
        let url = window.location.href;
        id = url.substring(url.lastIndexOf('/') + 1);


        // Si l'id de l'utilisateur est null, on affiche une alerte et on redirige vers la page de gestion des comptes
        if (!id.match(/^[0-9]+$/)) {
            alert("Veuillez sélectionner un utilisateur");
            window.location.href = "../../search-account";
        }
    }

    // On récupère les données de l'utilisateur depuis la BDD
    fetch('/admin/users/' + id)
        .then(response => {
            if (!response.ok) {
                alert("L'utilisateur n'existe pas"); //Bug éventuel où l'erreur se produit malgré que l'utilisateur existe
                location.href = "../../search-account";
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            // On récupère les données du compte
            let nom = data.nomCompte;
            let prenom = data.prenomCompte;
            let tel = data.telephone;
            let genre = data.genre;
            let email = data.email;
            mdp = data.mdp;
            let voiture = data.voiture;
            let notif = data.notificationMail;
            let ville = data.ville;
            let pays = data.pays;
            let cp = data.codePostal;
            let adresse = data.adresse;

            // On affiche les données dans le formulaire
            $("#nomUser").html(nom + " " + prenom).css({
                "font-family": "Arial, sans-serif",
                "font-size": "1.2rem",
                "font-weight": "bold",
                "color": "#333",
                "padding": "10px",
                "border": "1px solid #ccc",
                "border-radius": "5px",
                "background-color": "#f7f7f7"
            });
            $('input[name="telephone"]').val(tel);
            $('input[name="nom"]').val(nom);
            $('input[name="prenom"]').val(prenom);
            $('input[name="email"]').val(email);
            $('input[name="ville"]').val(ville);
            $('input[name="pays"]').val(pays);
            $('input[name="codepostal"]').val(cp);
            $('input[name="adresse"]').val(adresse);

            // On coche la bonnes case pour la voiture
            if (voiture == 1) {
                $('#Choice1').prop('checked', true);
            } else if (voiture == 0) {
                $('#Choice2').prop('checked', true);
            }

            // On coche la bonne case pour les notifications
            if (notif == 1) {
                $('#Choice3').prop('checked', true);
            } else if (notif == 0) {
                $('#Choice4').prop('checked', true);
            }

            // On sélectionne le bon genre
            if (genre == "homme") {
                $('#genre').val(1);
            } else if (genre == "femme") {
                $('#genre').val(2);
            } else if (genre == "autre") {
                $('#genre').val(3);
            } else {
                $('#genre').val(0);
            }

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });






    $('#update-form').submit(function (event) {
        event.preventDefault();

        // variable pour vérifier que tout le formulaire est valide, si valide = 0 alors on affiche une alerte pour dire que le formulaire n'est pas bon
        let valide = true;



        // On récupère le numéro de téléphone
        let telephone = $('input[name="telephone"]').val();
        const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
        if (!telephone.match(phoneRegex) && telephone !== "") {
            input.css('border', '2px solid red');
            input.val('');
            input.attr('placeholder', 'Numéro invalide');
            valide = false;
        }
        // Indique si le numéro de téléphone est valide ou non
        console.log("téléphone : " + valide);

        // On récupère le nom de famille
        let nom = $('input[name="nom"]').val();
        const nomRegex = /^[a-zA-Z ]{2,}$/;
        if (!nom.match(nomRegex) && nom !== "") {
            inputnom.css('border', '2px solid red');
            inputnom.val('');
            inputnom.attr('placeholder', 'Nom invalide');
            valide = false;
        }
        // Indique si le nom est valide ou non
        console.log("nom : " + valide);

        // On récupère l'adresse mail
        let email = $('input[name="email"]').val();
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!email.match(emailRegex) && email !== "") {
            inputmail.css('border', '2px solid red');
            inputmail.val('');
            inputmail.attr('placeholder', 'Email invalide');
            valide = false;
        }
        // Indique si l'email est valide ou non
        console.log("email : " + valide);

        // On récupère le prénom
        const prenomRegex = /^([a-zA-Z]{2,}(-[a-zA-Z]{2,})?\s?)+$/;
        let prenom = $('input[name="prenom"]').val();
        if (!prenom.match(prenomRegex) && prenom !== "") {
            inputprenom.css('border', '2px solid red');
            inputprenom.val('');
            inputprenom.attr('placeholder', 'Prenom invalide');
            valide = false;
        }
        // Indique si le prénom est valide ou non
        console.log("prenom : " + valide);

        // On récupère la ville
        let inputville = $('input[name="ville"]');
        let ville = inputville.val();
        const villeRegex = /^[a-zA-Z ]{2,}$/;
        if (!ville.match(villeRegex) && ville !== "") {
            inputville.css('border', '2px solid red');
            inputville.val('');
            inputville.attr('placeholder', 'Ville invalide');
            valide = false;
        }
        // Indique si la ville est valide ou non
        console.log("ville : " + valide);

        // On récupère le code postal
        let cp = $('input[name="codepostal"]').val();
        const cpRegex = /^\d{5}$/;
        if (!cp.match(cpRegex) && cp !== "") {
            inputcp.css('border', '2px solid red');
            inputcp.val('');
            inputcp.attr('placeholder', 'Code postal invalide');
            valide = false;
        }
        // Indique si le code postal est valide ou non
        console.log("cp : " + valide);

        // On récupère le genre
        let sexe = $('#genre').val();
        if (sexe == 0) {
            $('#genre').css('border', '2px solid red');
            valide = false;
        }
        // Indique si le genre est valide ou non
        console.log("sexe : " + valide);

        // On récupère les infos liées à la voiture
        let voiture = $('input[name="voiture"]:checked').val();
        if (voiture === "oui") voiture = 1;
        else if (voiture === "non") voiture = 0;
        else if (voiture === undefined) {
            valide = false;
            $('label[for="Choice1"], label[for="Choice2"], #labelvoiture').css('color', 'red');
        }
        // Indique si la voiture est valide ou non
        console.log("voiture : " + valide);

        // On récupère les infos liées aux notifs
        let notif = $('input[name="notif"]:checked').val();
        if (notif === "oui") notif = 1;
        else if (notif === "non") notif = 0;
        else if (notif === undefined) {
            valide = false;
            $('label[for="Choice1"], label[for="Choice2"], #labelnotif').css('color', 'red');
        }
        // Indique si les notifs sont valides ou non
        console.log("notif : " + valide);




        // Si le formulaire n'est pas valide, on affiche un message d'erreur.
        if (!valide) {
            alert("Le formulaire n'est pas bon. Veuillez vérifier vos informations.")
        } else {
            // Sinon on envoie les données au serveur.
            let modif = '../../modifCompte/' + token + '/' + id;

            let formData = new FormData($('form')[0]);

            fetch(modif, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'nom': document.querySelector("input[name='nom']").value,
                    'email': document.querySelector("input[name='email']").value,
                    'prenom': document.querySelector("input[name='prenom']").value,
                    'telephone': $('input[name="telephone"]').val(),
                    'notif': $('input[name="notif"]:checked').val(),
                    'voiture': $('input[name="voiture"]:checked').val(),
                    'mdp': mdp,
                    'ville': $('input[name="ville"]').val(),
                    'adresse': $('input[name="adresse"]').val(),
                    'pays': $('input[name="pays"]').val(),
                    'codepostal': $('input[name="codepostal"]').val(),
                    'genre': $('#genre').val(),
                    'photo': $('input[name="poster"]').prop('files')
                })
            }).then(reponse => {
                if (reponse.ok) {
                    alert("Le compte a bien été modifié.");
                    window.location.href = '/admin/search-account';
                } else {
                    alert("Probleme dans le fetch");

                }
            }).catch(error => {
                console.error(error);
            })
        }
    })
})