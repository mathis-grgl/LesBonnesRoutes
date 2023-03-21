from flask import Flask, request, Blueprint, current_app
from flask_mail import Mail, Message
import re

# python3.10 -m pip install flask-mail

mail_bp = Blueprint('mail', __name__)

@mail_bp.route('/contact', methods=['POST'])
def contact():
    regexMail = '^[^\s@]+@[^\s@]+\.[^\s@]+$'
    regexTel = '^0[1-9]([-. ]?[0-9]{2}){4}$'
    regexName = '^[a-zA-ZÀ-ÿ]+$'
    regexMessageNotEmpty = '^.{1,}$'

    current_app.config['MAIL_SERVER'] = 'smtp.elasticemail.com'
    current_app.config['MAIL_PORT'] = 465
    current_app.config['MAIL_USERNAME'] = 'sandygehin2@gmail.com'
    current_app.config['MAIL_PASSWORD'] = '820DA5C445081CE2534D0AF842122D336A11'
    current_app.config['MAIL_USE_TLS'] = False
    current_app.config['MAIL_USE_SSL'] = True


    json = request.get_json()
    name = json.get('name')
    print(name)
    mail = json.get('email')
    print(mail)
    tel = json.get('phone')
    print(tel)
    message = json.get('message')
    print(message)
    subject = "Contacter LBR"
    if (re.match(regexMail, mail) and re.match(regexName, name) and re.match(regexTel, tel) and re.match(regexMessageNotEmpty, message)):
        m = Mail(current_app)
        msg = Message(subject=subject, sender='noreply@lesbonnesrout.es', recipients=[mail])
        msg.body = message
        m.send(msg)
        return "Email envoyé avec succès"
    else:
        return "Les informations fournies ne sont pas valides"
