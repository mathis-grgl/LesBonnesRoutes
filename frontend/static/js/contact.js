const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTel = /^0[1-9]([-. ]?[0-9]{2}){4}$/;
const regexName = /^[a-zA-ZÀ-ÿ]+$/;
const regexMessageNotEmpty = /^.{1,}$/;

$('#formcontact').submit(function (event) {

    event.preventDefault();
    let name = $('#name').val();
    let mail = $('#email').val();
    let tel = $('#phone').val();
    let message = $('#message').val();

    /*console.log(name);
    console.log(mail);
    console.log(tel);
    console.log(message);*/
    let subject = "Contacter LBR";
    if (mail.match(regexMail) && name.match(regexName) && tel.match(regexTel) && message.match(regexMessageNotEmpty)) {
        Email.send({
            Host: "smtp.elasticemail.com",
            Port: 2525,
            Username: "sandygehin2@gmail.com",
            Password: "820DA5C445081CE2534D0AF842122D336A11",
            To: mail,
            From: "noreply@lesbonnesrout.es",
            Subject: subject,
            Body: message
        }).then(
            function () {
                displayMessage(true);
            }
        ).catch(
            function () {
                displayMessage(false);
            }
        );
    } else {
        displayMessage(false);
    }


});

function displayMessage(res) {
    if (res) {
        $('#okok').text("L'email a été envoyé.").css('color', 'red');
    } else {
        $('#okok').text("L'email n'a pas été envoyé.").css('color', 'red');
        //   console.log("L'email n'a pas été envoyé.");
        //   emailSending.innerHTML = "Le mail de récupération n'a pas été envoyé, vérifiez bien votre email et réessayez."
        //   emailSending.style.display = "flex";
        //   emailSending.style.backgroundColor = "#ff5140";
    }
}
