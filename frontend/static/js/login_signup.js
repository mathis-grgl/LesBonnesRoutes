function onLoad(){
    if(getCookieToken() != null){
        location.href = "/account";
    }
    console.log("onLoad");
}

// Variables
const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");
const emailLog = document.querySelector("input[name='email-log']");
const emailSending = document.querySelector("div[name='email-sending']");
const checkKeepLog = document.querySelector("input[name='checkbox-remember-log']");

// Bouton voir/cacher mot de passe
// Recherchez tous les éléments d'icône d'œil
const eyeIcons = document.querySelectorAll('.password-icon');
//feather.replace();
// Pour chaque icône d'œil, ajoutez un gestionnaire d'événement "click"
/*eyeIcons.forEach(icon => {
  feather.replace(icon);
  icon.addEventListener('click', () => {
    // Trouvez le champ de mot de passe parent
    const passwordField = icon.parentNode.previousElementSibling;
    console.log("Type : " + passwordField);

    // Modifiez le type d'entrée pour montrer/cacher le mot de passe
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      icon.dataset.feather = 'eye-off';
    } else {
      passwordField.type = 'password';
      icon.dataset.feather = 'eye';
    }

    // Rafraîchir l'icône Feather pour prendre en compte les changements
    feather.replace(icon);
  });
});*/


/*
feather.replace();
const eyeLog = document.querySelector(".eye");
const eyeoffLog = document.querySelector(".eye-off");
const passwordFieldLog = document.querySelector("input[name=password-log]");
/*
const eyeSign = document.querySelector(".feather-eye-sign");
const eyeoffSign = document.querySelector(".feather-eye-off-sign");
const passwordFieldSign = document.querySelector("input[name=password-sign]");

eyeLog.addEventListener("click", () => {
  eyeLog.style.display = "none";
  eyeoffLog.style.display = "block";
  passwordFieldLog.type = "text";
});

eyeoffLog.addEventListener("click", () => {
  eyeoffLog.style.display = "none";
  eyeLog.style.display = "block";
  passwordFieldLog.type = "password";
});*/

/*eyeSign.addEventListener("click", () => {
  eyeSign.style.display = "none";
  eyeoffSign.style.display = "block";
  passwordFieldSign.type = "text";
});

eyeoffSign.addEventListener("click", () => {
  eyeoffSign.style.display = "none";
  eyeSign.style.display = "block";
  passwordFieldSign.type = "password";
});*/


// Boutons se connecter et s'inscrire
registerButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

function openRecuperationWindow(){
  window.open('/recuperation-mot-de-passe', 'Example', 'width=400,height=400');
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
  event.preventDefault(); // Prevent the default behavior of the button click
  const formData = new FormData();
  const fileInput = document.querySelector("input[name='file-sign']");
  if(fileInput.files[0]){
    const file = fileInput.files[0];
    const fileExtension = file.name.split('.').pop();
    const fileName = `${document.querySelector("input[name='name-sign']").value}-${document.querySelector("input[name='last-name-sign']").value}-${Date.now()}.${fileExtension}`;
  
    // Create a new File object with the unique name
    const newFile = new File([file], fileName, { type: file.type });

    // Append the new file to the form data
    formData.append('file-sign', newFile);
  }

  if (checkValue('name-sign') && checkValue('last-name-sign') && checkValue("gender-sign") && checkValue('email-sign') && checkValue('phone-sign') &&checkValue("address-sign") && checkValue("city-sign") && checkValue("postal-sign") && checkValue("country-sign") && checkValue('password-sign')) {
    // Stockage de la valeur dans une variable booléenne
    const car = checkValue('checkbox-licence-sign') ? true : false;

    // Append the rest of the form data to the form data
    formData.append('name-sign', document.querySelector("input[name='name-sign']").value);
    formData.append('last-name-sign', document.querySelector("input[name='last-name-sign']").value);
    formData.append('gender-sign', document.querySelector("input[name='gender-sign']:checked").value);
    formData.append('email-sign', document.querySelector("input[name='email-sign']").value);
    formData.append('phone-sign', document.querySelector("input[name='phone-sign']").value);
    formData.append('checkbox-licence-sign', car);
    formData.append('address-sign', document.querySelector("input[name='address-sign']").value);
    formData.append('city-sign', document.querySelector("input[name='city-sign']").value);
    formData.append('postal-sign', document.querySelector("input[name='postal-sign']").value);
    formData.append('country-sign', document.querySelector("input[name='country-sign']").value);
    formData.append('password-sign', document.querySelector("input[name='password-sign']").value);

    fetch('/compte/createCompte', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then(data => {
      if (data.error) {
        console.log(data.error);
        return;
      }

      container.classList.remove("right-panel-active");
      displayMessage(true, "Votre compte a bien été créé.");
    })
    .catch(error => {
      console.error('Erreur : ' + error.message);
      switch (error.message){
        case "409":
          displayMessage(false, "Ce compte existe déjà.");
          break;

        case "400":
          displayMessage(false, "Veuillez rentrer toutes les informations nécessaires.");
          break;

        default:
          displayMessage(false, "Erreur lors de la création du compte.");
          break;
      }
    });
  } else {
    displayMessage(false, "Veuillez rentrer toutes les informations nécessaires.");
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
      if (document.querySelector('input[name=gender-sign]:checked') && document.querySelector('input[name=gender-sign]:checked').value != undefined){
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