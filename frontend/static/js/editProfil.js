let nomuser = $('#nomUser').text();
console.log("Voici le nom de l'user " + nomuser);


// fetch('/users')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error("Erreur lors de l'appel à la fonction get_users: " + response.statusText);
//     }
//     return response.json();
//   })
//   .then(data => {
//     // Gérer les données de réponse ici
//     console.log(data);
//     let user = data[0];
//     let nom = user.nomCompte;
//     let prenom = user.prenomCompte;
//     let tel = user.telephone;
//     let genre = user.genre;
//     let email = user.email;
//     let mdp = user.mdp;
//     let voiture = user.voiture;
//     let notif = user.notificationMail;
//     console.log(nom + ' ' + prenom);
//     // $('#nomUser').text(nom + ' ' + prenom);
//     $("#nomUser").html(nom + " " + prenom).css({
//         "font-family": "Arial, sans-serif",
//         "font-size": "1.2rem",
//         "font-weight": "bold",
//         "color": "#333",
//         "padding": "10px",
//         "border": "1px solid #ccc",
//         "border-radius": "5px",
//         "background-color": "#f7f7f7"
//       });
//       $('input[name="telephone"]').val(tel);
//       $('input[name="nom"]').val(nom);
//       $('input[name="prenom"]').val(prenom);
//       $('input[name="logpass"]').val(mdp);
//       $('input[name="logpassconfirm"]').val(mdp);
//       $('input[name="email"]').val(email);


//       if(voiture == 1){
//         $('#Choice1').prop('checked', true);
//       }else if (voiture == 0){
//         $('#Choice2').prop('checked', true);
//       }

//       if(notif == 1){
//         $('#Choice3').prop('checked', true);
//       }else if (notif == 0){
//         $('#Choice4').prop('checked', true);
//       }

//       if (genre == "homme"){
//         $('#sexe').val(1);
//       }else if(genre == "femme"){
//         $('#sexe').val(2);
//       }else if(genre == "autre"){
//         $('#sexe').val(3);
//       }else{
//         $('#sexe').val(0);
//       }


//   })
//   .catch(error => {
//     // Gérer les erreurs ici
//     console.log(error.message);
//   });


const url = 'compte/getInfoCompte/' + "9f36ad8ef1718c3c2258025e06e7eb2d";
const token = "9f36ad8ef1718c3c2258025e06e7eb2d";

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    
    let nom = data.nomCompte;
    let prenom = data.prenomCompte;
    let tel = data.telephone;
    let genre = data.genre;
    let email = data.email;
    let mdp = data.mdp;
    let voiture = data.voiture;
    let notif = data.notificationMail;
    let ville = data.ville;
    let pays = data.pays;
    let cp = data.codePostal;
    let adresse = data.adresse;
    console.log(nom + ' ' + prenom);
    // $('#nomUser').text(nom + ' ' + prenom);
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
    $('input[name="logpass"]').val(mdp);
    $('input[name="logpassconfirm"]').val(mdp);
    $('input[name="email"]').val(email);
    $('input[name="ville"]').val(ville);
    $('input[name="pays"]').val(pays);
    $('input[name="codepostal"]').val(cp);
    $('input[name="adresse"]').val(adresse);





    if (voiture == 1) {
      $('#Choice1').prop('checked', true);
    } else if (voiture == 0) {
      $('#Choice2').prop('checked', true);
    }

    if (notif == 1) {
      $('#Choice3').prop('checked', true);
    } else if (notif == 0) {
      $('#Choice4').prop('checked', true);
    }

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
  console.log("Voici le mdp : " + mdp);

  const regexmdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  let inputmdpconfirm = $('input[name="logpassconfirm"]');
  let mdpconfirm = inputmdpconfirm.val();
  console.log("Voici le mdp de confirm : " + mdpconfirm);


  if (mdp.trim().length == 0 || mdpconfirm.trim().length == 0) {
    console.log('on ne fait rien.')
  } else {
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
  let sexe = $('#genre').val();
  if (sexe == 0) {
    $('#genre').css('border', '2px solid red');
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
    let modif = 'compte/modifCompte/' + token;
    
    let formData = new FormData($('form')[0]);
    fetch(modif, {
      method: 'POST',
      body: formData
    })
    .then(reponse => {
      if(reponse.ok){
        alert("Votre compte a bien été modifié.");
        window.location.href = '/account';
      }else{
        alert("Probleme dans le fetch");

      }
    })
  }




})