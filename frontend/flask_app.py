
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, jsonify, request
import sqlite3
import secrets

# Création d'un nouveau path pour le backend
import sys
sys.path.append('..')

app = Flask(__name__, template_folder=".")

#Pages
@app.route('/admin-search-account')
def admin_account():
    return render_template('admin-search-account.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/deconnexion')
def deconnexion():
    return render_template('deconnexion.html')

@app.route('/account/modifier')
def ModifierProfil():
    return render_template('editprofil.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/login_signup')
def login_signup():
    return render_template('login_signup.html')

@app.route('/terms')
def terms():
    return render_template('terms.html')

@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/about')
def about():
    return render_template('about.html')




#Requetes
@app.route('/trajets')
def get_trajets():
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()

    # Requête pour récupérer tous les trajets avec les ID de ville
    c.execute('''SELECT idTrajet, idVilleDepart, idVilleArrivee, dateDepart, dateArrivee, 
                       prix, nombrePlaces, description FROM TRAJET''')
    rows = c.fetchall()

    # Récupération des noms des villes correspondant aux ID
    trajets = []
    for row in rows:
        trajet = {'idTrajet': row[0], 'villeDepart': '', 'villeArrivee': '', 'dateDepart': row[3],
                  'dateArrivee': row[4], 'prix': row[5], 'nombrePlaces': row[6], 'description': row[7]}
        # Requête pour récupérer le nom de la ville de départ correspondant à l'ID
        c.execute('''SELECT nomVille FROM VILLE WHERE idVille = ?''', (row[1],))
        ville_depart = c.fetchone()
        trajet['villeDepart'] = ville_depart[0] if ville_depart else ''

        # Requête pour récupérer le nom de la ville d'arrivée correspondant à l'ID
        c.execute('''SELECT nomVille FROM VILLE WHERE idVille = ?''', (row[2],))
        ville_arrivee = c.fetchone()
        trajet['villeArrivee'] = ville_arrivee[0] if ville_arrivee else ''

        trajets.append(trajet)

    conn.close()
    return jsonify(trajets)




@app.route('/users')
def get_users():
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE")
    rows = c.fetchall()

    # Récupération des noms de colonnes
    col_names = [desc[0] for desc in c.description]

    # Création d'une liste de dictionnaires contenant les données
    users = []
    for row in rows:
        user = {col_names[i]: row[i] for i in range(len(col_names))}
        users.append(user)

    conn.close()
    return jsonify(users)


@app.route('/createCompte', methods=['POST'])
def create_compte():
    # Récupérer les données envoyées dans la requête
    nom = request.form.get('nomCompte')
    prenom = request.form.get('prenomCompte')
    email = request.form.get('email')
    genre = request.form.get('genre')
    voiture = request.form.get('voiture')
    telephone = request.form.get('telephone')
    mdp = request.form.get('mdp')
    notificationMail = request.form.get('notificationMail')

    # Vérifier si le compte existe déjà dans la base de données
    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE WHERE email = ?", (email,))
    compte = c.fetchone()

    if compte is not None:
        # Le compte existe déjà
        conn.close()
        return jsonify({'message': 'Le compte existe déjà'}), 409

    if not nom or not prenom or not email or not genre or not voiture or not telephone or not mdp or not notificationMail:
        # Il manque des informations dans la requête
        conn.close()
        return jsonify({'message': 'Informations manquantes'}), 400

    # Insérer le compte dans la base de données
    c.execute("INSERT INTO COMPTE (nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (nom, prenom, email, genre, voiture, telephone, mdp, notificationMail))
    conn.commit()
    conn.close()

    # Envoyer une réponse avec le code HTTP 201 Created
    return jsonify({'message': 'Le compte a été créé'}), 201


@app.route("/connectCompte, methods=['POST']")
def connectCompte(idCompte):
    email = request.form.get('email')
    mdp = request.form.get('mdp')

    conn = sqlite3.connect('../database.db')
    c = conn.cursor()
    c.execute("SELECT idCompte FROM COMPTE WHERE email = ? AND mdp = ?", (email, mdp))
    compte = c.fetchone()
    conn.close()

    if compte:
        # Création du token (ici, une simple concaténation de l'email et du mot de passe)
        token = secrets.token_hex(16) # generate a random token with 16 bytes
        c.execute("INSERT INTO TOKEN VALUES (?, ?, ?)", (idCompte, token, "exp"))
        conn.commit()

        # Retour de la réponse avec code 200 et le token
        return jsonify({'idCompte': compte[0], 'token': token}), 200
    else:
        # Retour de la réponse avec code 401 et un message d'erreur
        return jsonify({'message': 'Email ou mot de passe incorrect.'}), 401


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, threaded=True)