
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template
import sqlite3

# Création d'un nouveau path pour le backend
import sys
sys.path.append('..')

app = Flask(__name__, template_folder=".")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact.html')
def contact():
    return render_template('contact.html')

@app.route('/deconnexion.html')
def deconnexion():
    return render_template('deconnexion.html')

@app.route('/ModifierProfil.html')
def ModifierProfil():
    return render_template('ModifierProfil.html')

@app.route('/privacy.html')
def privacy():
    return render_template('privacy.html')

@app.route('/login_signup.html')
def login_signup():
    return render_template('login_signup.html')

@app.route('/terms.html')
def terms():
    return render_template('terms.html')

@app.route('/account.html')
def account():
    return render_template('account.html')

@app.route('/about.html')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, threaded=True)