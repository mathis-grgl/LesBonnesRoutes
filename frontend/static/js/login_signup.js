// Variables
const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");
const emailLog = document.querySelector("input[name='email-log']");
const emailSending = document.querySelector("div[name='email-sending']");
const checkKeepLog = document.querySelector("input[name='checkbox-remember-log']");

// Bouton voir/cacher mot de passe
feather.replace();

const eye = document.querySelector(".feather-eye");
const eyeoff = document.querySelector(".feather-eye-off");
const passwordField = document.querySelector("input[name=password-log]");

eye.addEventListener("click", () => {
  eye.style.display = "none";
  eyeoff.style.display = "block";
  passwordField.type = "text";
});

eyeoff.addEventListener("click", () => {
  eyeoff.style.display = "none";
  eye.style.display = "block";
  passwordField.type = "password";
});


// Boutons se connecter et s'inscrire
registerButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

function sendEmail(){
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  
  if (regex.test(emailLog.value)) {
    const message = "" + 
      "<h2>Bonjour, suite à votre demande de récupération de votre mot de passe,<br>" +
          "cliquez ci dessous pour récuperer votre mot de passe</h2><br>" +
      "<a href='#' style='border-radius: 10px; border: 0px; background-color: #67ac5b;>Cliquez ici</a>";

    const subject = "LBR Récupération mot de passe";

    Email.send({
      Host : "smtp.elasticemail.com",
      Port : 2525,
      Username : "sandygehin2@gmail.com",
      Password : "820DA5C445081CE2534D0AF842122D336A11",
      To : emailLog.value,
      From : "noreply@lesbonnesrout.es",
      Subject : subject,
      Body : message
    }).then(
      function() {
        displayMessage(true, "Le mail de récupération a bien été envoyé, vérifiez bien vos spams.");
      }
    ).catch(
      function() {
        displayMessage(false, "Le mail de récupération n'a pas été envoyé, vérifiez bien votre email et réessayez.");
      }
    );
  }
}


function displayMessage(res, message){
  emailSending.innerHTML = message
  if (res){
    emailSending.style.display = "flex";
    emailSending.style.backgroundColor = "#9dcba1";
  } else {
    emailSending.style.display = "flex";
    emailSending.style.backgroundColor = "#ff5140";
  }
}


function signIn(event) {
  const form = document.querySelector('#signup-form');
  event.preventDefault(); // Prevent the default behavior of the button click

  if (checkValue('name-sign') && checkValue('last-name-sign') && checkValue("gender-sign") && checkValue('email-sign') && checkValue('phone-sign') &&checkValue("address-sign") && checkValue("city-sign") && checkValue("postal-sign") && checkValue("country-sign") && checkValue('password-sign')) {
    
    fetch('/compte/createCompte', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name-sign': document.querySelector("input[name='name-sign']").value,
        'last-name-sign': document.querySelector("input[name='last-name-sign']").value,
        'gender-sign': document.querySelector("input[name='gender-sign']:checked").value,
        'email-sign': document.querySelector("input[name='email-sign']").value,
        'phone-sign': document.querySelector("input[name='phone-sign']").value,
        'checkbox-licence-sign': document.querySelector("input[name='checkbox-licence-sign']").value,
        'address-sign': document.querySelector("input[name='address-sign']").value,
        'city-sign': document.querySelector("input[name='city-sign']").value,
        'postal-sign': document.querySelector("input[name='postal-sign']").value,
        'country-sign': document.querySelector("input[name='country-sign']").value,
        'password-sign': document.querySelector("input[name='password-sign']").value
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        displayMessage(false, "Erreur lors de la création du compte.");
        throw new Error('Erreur : ' + response.status);
      }
    })
    .then(data => {
      if (data.error) {
        console.log(data.error);
        return;
      }

      container.classList.remove("right-panel-active");
      displayMessage(true, "Votre compte a bien été crée.");
    })
    .catch(error => {
      console.error('Erreur : ' + error.message);
      displayMessage(false, "Ce compte existe déjà.");
    });
  }
}



function connect(event){
  event.preventDefault(); // Prevent the default behavior of the button click
  fetch('/compte/connectCompte', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'email-log': document.querySelector("input[name='email-log']").value,
      'password-log': document.querySelector("input[name='password-log']").value
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Erreur : ' + response.status);
    }
  })
  .then(data => {
    if (data.error) {
      console.log(data.error);
      return;
    }
    if (checkKeepLog.checked){
      createInfiniteCookie(data.token);
    } else {
      createTemporaryCookie(data.token);
    }
    

    if (data.isAdmin)
      window.location.href = "/admin"; // Redirige vers la page d'accueil
    else
      window.location.href = "/"; // Redirige vers la page d'accueil
  })
  .catch(error => {
    console.error('Erreur : ' + error.message);
    displayMessage(false, "L'email ou le mot de passe est incorrect");
  });
}


function checkValue(val){
  var variable = document.querySelector("input[name=" + val + "]");
  var regex;
  var bool = false;

  switch(val){
    case "email-log":
      regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true
      }    
      break;

    case "name-sign":
      regex = /^[A-Za-z\-' ]+$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "last-name-sign":
      regex = /^[A-Za-z\-' ]+$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "gender-sign":
      if (document.querySelector('input[name=gender-sign]:checked').value != undefined){
        bool = true;
      }
      break;

    case "email-sign":
      regex = /.+@.+\.[A-Za-z]{2,}/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "phone-sign":
      regex = /^[0-9]{10}$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break

    case "checkbox-licence-sign":
      if (variable.checked){
        bool = true;
      }
      break;

    case "address-sign":
      regex = /^\d+\s[a-zA-ZÀ-ÿ\s]+$/u;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "city-sign":
      regex = /^[a-zA-ZÀ-ÖÙ-öù-ÿ-œ]+(?:[\s-][a-zA-ZÀ-ÖÙ-öù-ÿ-œ]+)*$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "postal-sign":
      regex = /^[0-9]{5}$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "country-sign":
      regex = /^[a-zA-Z\séàèëêôöîïûüçñÿ-]+$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "password-sign":
      regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

  }
  
  console.log(val + " : " + bool);
  return bool;
}