const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");
const emailLog = document.querySelector("input[name='email-log']");
const emailSending = document.querySelector("div[name='email-sending']");

registerButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

function sendEmail(){
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  
  if (regex.test(emailLog.value)) {
    const message = "Bonjour, après une demande de récupération de votre mot de passe, voici un lien pour le récupérer. ";
    const subject = "LBR Récupération mot de passe";

    Email.send({
      Host : "smtp.elasticemail.com",
      Port : 2525,
      Username : "sandygehin2@gmail.com",
      Password : "820DA5C445081CE2534D0AF842122D336A11",
      To : emailLog.value,
      From : "yoferrari3@gmail.com",
      Subject : subject,
      Body : message
    }).then(
      function() {
        displayMessage(true);
      }
    ).catch(
      function() {
        displayMessage(false);
      }
    );
  }
}


function displayMessage(res){
  if (res){
    emailSending.innerHTML = "Le mail de récupération a bien été envoyé, vérifiez bien vos spams."
    emailSending.style.display = "flex";
    emailSending.style.backgroundColor = "#9dcba1";
  } else {
    emailSending.innerHTML = "Le mail de récupération n'a pas été envoyé, vérifiez bien votre email et réessayez."
    emailSending.style.display = "flex";
    emailSending.style.backgroundColor = "#ff5140";
  }
}


function signIn(){
  const url = 'http://127.0.0.1:5000/api/v1/user';

  if (checkValue("name-sign") && checkValue("last-name-sign") && checkValue("email-sign") && checkValue("phone-sign") && checkValue("checkbox-licence-sign") && checkValue("password-sign")){
    let data = {
      nom: document.querySelector("input[name='name-sign']"),
      prenom: document.querySelector("input[name='last-name-sign']"),
      mail: document.querySelector("input[name='email-sign']"),
      tel: document.querySelector("input[name='phone-sign']"),
      password: document.querySelector("input[name='password-sign']")
    }

    let fetchData = {
      method: 'PUT',
      body: data,
      headers: new Headers()
    }

    fetch(url, fetchData)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data); // afficher la réponse du serveur
    });
  }
}


function checkValue(val){
  var variable;
  var regex;
  var bool = false;

  switch(val){
    case "email-log":
      variable = document.querySelector("input[name=" + val + "]");
      regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true
      }    
      break;
    
    case "password-log":
      break;
        

    case "checkbox-remember-log":
      break;


    case "name-sign":
      variable = document.querySelector("input[name=" + val + "]");
      regex = /^[A-Za-z\-' ]+$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "last-name-sign":
      variable = document.querySelector("input[name=" + val + "]");
      regex = /^[A-Za-z\-' ]+$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "email-sign":
      variable = document.querySelector("input[name=" + val + "]");
      regex = /.+@.+\.[A-Za-z]{2,}/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break;

    case "phone-sign":
      variable = document.querySelector("input[name=" + val + "]");
      regex = /^[0-9]{10}$/;
      if (!regex.test(variable.value)){
        variable.style.setProperty("border", "1px solid #ff0000");
      } else {
        variable.style.setProperty("border", "1px solid #000000");
        bool = true;
      }
      break

    case "checkbox-licence-sign":
      if (document.querySelector("input[name=" + val + "]").checked){
        bool = true;
      }
      break;

    case "password-sign":
      variable = document.querySelector("input[name=" + val + "]");
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