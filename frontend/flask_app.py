# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, jsonify

# Création d'un nouveau path pour le backend
import sys
sys.path.append('..')

app = Flask(__name__, template_folder=".")
app.url_map.strict_slashes = False

# Pages

@app.route('/')
def index():
    return render_template('index/index.html')


@app.route('/contact')
def contact():
    return render_template('contact/contact.html')


@app.route('/deconnexion')
def deconnexion():
    return render_template('deconnexion/deconnexion.html')


@app.route('/modifier')
def ModifierProfil():
    return render_template('modifProfil/editprofil.html')


@app.route('/privacy')
def privacy():
    return render_template('privacy/privacy.html')


@app.route('/login_signup')
def login_signup():
    return render_template('login_signup/login_signup.html')


@app.route('/terms')
def terms():
    return render_template('terms/terms.html')


@app.route('/account')
def account():
    return render_template('account/account.html')


@app.route('/about')
def about():
    return render_template('about/about.html')

@app.route('/recuperation-mot-de-passe')
def recuperation():
    return render_template('recuperation_mdp/recuperation-mdp.html')

@app.route('/changer-mdp')
def changer_mdp():
    return render_template('changer_mdp/changer-mdp.html')

# Requetes
from backend.blueprints.compte import compte_bp
from backend.blueprints.trajet import trajet_bp
from backend.blueprints.admin import admin_bp
from backend.blueprints.ami import ami_bp
from backend.blueprints.mail import mail_bp

app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(compte_bp, url_prefix='/compte')
app.register_blueprint(trajet_bp, url_prefix='/trajet')
app.register_blueprint(ami_bp, url_prefix='/ami')
app.register_blueprint(mail_bp, url_prefix='/mail')



if __name__ == '__main__':
    app.run(threaded=True, debug=True, port=5050)

