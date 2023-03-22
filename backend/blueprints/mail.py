URI_DATABASE = '../database.db'
URL_WEBSITE = 'http://127.0.0.1:5050'
from flask import Flask, request, Blueprint, current_app
from flask_mail import Mail, Message
import re
import secrets
import sqlite3

# python3.10 -m pip install flask-mail

mail_bp = Blueprint('mail', __name__)


regexMail = '^[^\s@]+@[^\s@]+\.[^\s@]+$'
regexTel = '^0[1-9]([-. ]?[0-9]{2}){4}$'
regexName = '^[a-zA-ZÀ-ÿ]+$'

def setConfig():
    current_app.config['MAIL_SERVER'] = 'smtp.elasticemail.com'
    current_app.config['MAIL_PORT'] = 465
    current_app.config['MAIL_USERNAME'] = 'sandygehin2@gmail.com'
    current_app.config['MAIL_PASSWORD'] = '820DA5C445081CE2534D0AF842122D336A11'
    current_app.config['MAIL_USE_TLS'] = False
    current_app.config['MAIL_USE_SSL'] = True

@mail_bp.route('/contact', methods=['POST'])
def contact():
    setConfig()

    json = request.get_json()
    name = json.get('name')
    mail = json.get('email')
    tel = json.get('phone')
    message = "Votre mail a bien été envoyé à LBR :\n\t" + json.get('message').replace('<br>', '\n\t')
    print(message)
    subject = "Contacter LBR"
    if (re.match(regexMail, mail) and re.match(regexName, name) and re.match(regexTel, tel)):
        m = Mail(current_app)
        msg = Message(subject=subject, sender='noreply@lesbonnesrout.es', recipients=[mail])
        msg.body = message
        m.send(msg)
        return "Email envoyé avec succès"
    else:
        return "Les informations fournies ne sont pas valides"


@mail_bp.route('/modifMdp', methods=['POST'])
def modifMail():
    setConfig()
    
    json = request.get_json()
    mail = json.get('email')
    subject = "Changement de mot de passe"
    message = "test : "
    if(re.match(regexMail, mail)):
        #Créer un token de chgt de mdp
        token = secrets.token_hex(16)  # generate a random token with 16 bytes
        message += token

        #On recup l'id du compte avec le mail et on vérifie s'il existe
        conn = sqlite3.connect(URI_DATABASE)
        c = conn.cursor()
        c.execute("SELECT idCompte FROM COMPTE WHERE email = ?", (mail,))
        compte = c.fetchone()
        if not compte:
            conn.close()
            return "Email envoyé avec succès"

        idCompte = compte[0]

        c.execute("INSERT INTO TOKEN_RECUP_MDP VALUES (?, ?, ?)",
                  (idCompte, token, "exp"))

        m = Mail(current_app)
        msg = Message(subject=subject, sender='noreply@lesbonnesrout.es', recipients=[mail])
        msg.body = message
        m.send(msg)
        return "Email envoyé avec succès"
    else:
        return "Les informations fournies ne sont pas valides"