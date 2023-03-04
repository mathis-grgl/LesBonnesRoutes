
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, jsonify

# Création d'un nouveau path pour le backend
import sys
sys.path.append('..')

app = Flask(__name__, template_folder=".")
app.url_map.strict_slashes = False

# Pages

@app.route('/admin')
def admin_index():
    return render_template('admin/index/admin-index.html')


@app.route('/admin/account')
def admin_account():
    return render_template('admin/account/admin-account.html')


@app.route('/admin/admin-search-account')
def admin_search_account():
    return render_template('admin/search-account/admin-search-account.html')


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


# Requetes
from backend.blueprints.compte import compte_bp
from backend.blueprints.trajet import trajet_bp
from backend.blueprints.admin import admin_bp

app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(compte_bp, url_prefix='/compte')
app.register_blueprint(trajet_bp, url_prefix='/trajet')



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, threaded=True)
