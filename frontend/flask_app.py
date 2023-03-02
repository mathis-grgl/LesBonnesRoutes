
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, jsonify
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

@app.route('/trajets')
def get_trajets():
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM TRAJET")
    rows = c.fetchall()
    conn.close()
    print(jsonify(rows))   
    
    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Création d'une liste de dictionnaires contenant les données
    trajets = []
    for row in rows:
        trajet = {col_names[i]: row[i] for i in range(len(col_names))}
        trajets.append(trajet)

    conn.close()
    return jsonify(trajets)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, threaded=True)