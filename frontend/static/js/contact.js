const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTel = /^0[1-9]([-. ]?[0-9]{2}){4}$/;
const regexName = /^[a-zA-ZÀ-ÿ]+$/;
const regexMessageNotEmpty = /^.{1,}$/;




$('#formcontact').submit(function (event) {

    event.preventDefault();
    let name = $('#name').val();
    let mail = $('#email').val();
    let tel = $('#phone').val();
    let message = $('#message').val().replaceAll(/\n/g, '<br>');

    if (!$('#phone').val().match(regexTel) && $('#phone').val() !== "") {
        $('#phone').css('border', '2px solid red');
        $('#phone').val('');
        // $('#phone').attr('placeholder', 'Numéro invalide');
        let messageErreur = document.getElementById('message-erreur');
        messageErreur.innerHTML = 'Numéro de téléphone invalide : doit contenir 10 chiffres en commençant par 0.';



    }



    /*console.log(name);
    console.log(mail);
    console.log(tel);
    console.log(message);*/
    let subject = "Contacter LBR";
    if (mail.match(regexMail) && name.match(regexName) && tel.match(regexTel) && message.match(regexMessageNotEmpty)) {
        $.ajax({
            type: "POST",
            url: "/mail/contact",
            data: JSON.stringify({ name: name, email: mail, phone: tel, message: message }),
            contentType: "application/json",
            success: function (response) {
                displayMessage(true);
            },
            error: function (xhr, status, error) {
                console.log(error);
                displayMessage(false);
            }
        });
    } else {
        displayMessage(false);
    }
});

function displayMessage(res) {
    if (res) {
        $('#okok').text("L'email a été envoyé.").css('color', 'red');
        $('#name').val('');
        $('#email').val('');
        $('#phone').val('');
        $('#message').val('');
    } else {
        $('#okok').text("L'email n'a pas été envoyé.").css('color', 'red');
    }
}
