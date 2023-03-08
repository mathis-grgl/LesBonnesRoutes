
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

@app.route('/modifier_trajet')
def modifier_trajet():
    return render_template('editTrajet/editTrajet.html')

@app.route('/mes_trajets')
def mes_trajets():
    return render_template('mes_trajets/mes_trajets.html')

@app.route('/mes_trajets_crees')
def mes_trajets_crees():
    return render_template('mes_trajets/mes_trajets_crees.html')

@app.route('/creer_trajet')
def creer_trajet():
    return render_template('mes_trajets/creer_trajet.html')


@app.route('/trajet')
def trajet():
    return render_template('trajet/trajet.html')



# Requetes
from backend.blueprints.compte import compte_bp
from backend.blueprints.trajet import trajet_bp
from backend.blueprints.admin import admin_bp

app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(compte_bp, url_prefix='/compte')
app.register_blueprint(trajet_bp, url_prefix='/trajet')



if __name__ == '__main__':
    app.run(threaded=True, debug=True)
