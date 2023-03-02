


$('#update-form').submit(function (event) {
    event.preventDefault();

    // variable pour vérifier que tout le formulaire est valide, si valide = 0 alors on affiche une alerte pour dire que le formulaire n'est pas bon
    let valide = true;

    // On récupère le numéro de téléphone et vérifie que c'est bien un numéro valide
    let input = $('input[name="telephone"]');
    let telephone = input.val();
    console.log(telephone);
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;


    if (!telephone.match(phoneRegex) && telephone !== "") {
        // alert('Numéro de tel pas bon.');
        input.css('border', '2px solid red');
        input.val('');
        input.attr('placeholder', 'Numéro invalide');
        valide = false;
    }





    // On récupère le nom de famille
    let inputnom = $('input[name="nom"]');
    let nom = inputnom.val();
    console.log(nom);

    const nomRegex = /^[a-zA-Z ]{2,}$/;

    if (!nom.match(nomRegex) && nom !== "") {
        // alert('Nom de famille pas bon.');
        inputnom.css('border', '2px solid red');
        inputnom.val('');
        inputnom.attr('placeholder', 'Nom invalide');
        valide = false;
    }



    // On récupère l'adresse mail
    let inputmail = $('input[name="email"]');
    let email = inputmail.val();
    console.log(email);


    // On récupère le prénom
    const prenomRegex = /^([a-zA-Z]{2,}(-[a-zA-Z]{2,})?\s?)+$/;
    let inputprenom = $('input[name="prenom"]');
    let prenom = inputprenom.val();
    console.log(prenom);

    if (!prenom.match(prenomRegex) && prenom !== "") {
        // alert('Prénom pas bon.');
        inputprenom.css('border', '2px solid red');
        inputprenom.val('');
        inputprenom.attr('placeholder', 'Prenom invalide');
        valide = false;

    }



    // On récupère les mot de passes
    let inputmdp = $('input[name="logpass"]')
    let mdp = inputmdp.val();
    console.log("Voici le mdp : " + mdp.trim().length);

    const regexmdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;




    let inputmdpconfirm = $('input[name="logpassconfirm"]');
    let mdpconfirm = inputmdpconfirm.val();
    console.log("Voici le mdp de confirm : " + mdpconfirm.trim().length);

    if (!mdp.match(regexmdp) || !mdpconfirm.match(regexmdp)) {
        // alert('Les deux mdp ne sont pas pareils.');
        console.log("on rentre ici !")
        inputmdpconfirm.css('border', '2px solid red');
        inputmdpconfirm.val('');
        inputmdpconfirm.attr('placeholder', 'Mot de passe invalide');
        $('input[name="logpass"]').val('');
        $('input[name="logpass"]').attr('placeholder', 'Mot de passe invalide');
        $('input[name="logpass"]').css('border', '2px solid red');
        $('#small').css('font-weight', 'bold');
        $('#small').css('text-decoration', 'underline');
        valide = false;

    }

    if (mdp !== mdpconfirm) {
        inputmdpconfirm.css('border', '2px solid red');
        inputmdpconfirm.val('');
        inputmdpconfirm.attr('placeholder', 'Différent du premier mot de passe');
        $('input[name="logpass"]').val('');
        $('input[name="logpass"]').attr('placeholder', 'Mot de passe invalide');
        $('input[name="logpass"]').css('border', '2px solid red');
        $('#small').css('font-weight', 'bold');
        $('#small').css('text-decoration', 'underline');
        valide = false;
    }



    // On récupère l'adresse
    let inputadresse = $('input[name="adresse"]');
    let adresse = inputadresse.val();
    console.log(adresse);




    // On récupère la ville
    let inputville = $('input[name="ville"]');
    let ville = inputville.val();
    console.log(ville);






    // On récupère le code postal
    let inputcp = $('input[name="codepostal"]');
    let cp = inputcp.val();
    console.log(cp);
    const cpRegex = /^\d{5}$/;

    if (!cp.match(cpRegex) && cp !== "") {
        inputcp.css('border', '2px solid red');
        inputcp.val('');
        inputcp.attr('placeholder', 'Code postal invalide');
        valide = false;

    }







    // On récupère le genre
    let sexe = $('#sexe').val();
    if (sexe == 0) {
        $('#sexe').css('border', '2px solid red');
        valide = false;
    }
    console.log(sexe);


    // On récupère les infos liées à la voiture
    let voiture = $('input[name="voiture"]:checked').val();
    console.log(voiture);


    if (voiture === "oui") {
        voiture = 1;
    } else if (voiture === "non") {
        voiture = 0;
    } else if (voiture === undefined) {
        valide = false;
        $('label[for="Choice1"], label[for="Choice2"], #labelvoiture').css('color', 'red');

    }

    console.log('Nouvelle info pour la voiture : ' + voiture);



    // On récupère les infos liées aux notifs
    let notif = $('input[name="notif"]:checked').val();
    console.log(notif);

    if (notif === "oui") {
        notif = 1;
    } else if (notif === "non") {
        notif = 0;

    } else if (notif === undefined) {
        valide = false;
        $('label[for="Choice1"], label[for="Choice2"], #labelnotif').css('color', 'red');
    }

    console.log('Nouvelle info pour la notif : ' + notif);

    let inputimage = $('input[name="poster"]').prop('files');
    if (inputimage && inputimage.length > 0) {
        let image = inputimage[0];

        console.log(image.name);
        console.log(image.size + " octets");

        console.log(image.type);

    }



    if (!valide) {
        alert("Le formulaire n'est pas bon. Veuillez vérifier vos informations.")
    } else {
        // mettre ici le code pour update les données.
    }




})