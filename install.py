import sys, shutil, os
from jinja2 import Environment, FileSystemLoader

# MODIFIER CES 2 LISTES POUR RENDRE LES DIFFÉRENTES PAGES
# SI UNE SEULE PAGE NE 'COMPILE' PAS, LE PROGRAMME NE FAIT PAS LES AUTRES

if len(sys.argv) == 2 and sys.argv[1] == "backend":
    # Déclaration de la liste des pages à rendre
    liste_pages_a_rendre = [
        "about",
        "account",
        "admin-search-account",
        "contact",
        "deconnexion",
        "editprofil",
        "index",
        "privacy",
        "terms",
    ]

    # Déclaration de la liste des pages à copier simplement
    liste_pages_a_copier = [
        "admin-account",
        "login_signup",
    ]


    # Crée un environnement Jinja2 avec le dossier des templates
    env = Environment(loader=FileSystemLoader('.'))

    # (Re-)Création du dossier build du site
    if os.path.exists('build'):
        shutil.rmtree('build')
    os.makedirs('build')

    # Copie du dossier backend dans le dossier build
    shutil.copytree('backend', './build/backend')

    print("Installation de la DB...")
    # Exécution du fichier install_db.py
    exec(open("./build/backend/install_db/install_db.py").read())
else:
    # Copie des fichiers sources du frontend
    shutil.copytree('./frontend/static', './build/static')

    os.chdir('./frontend')

    # Effectue le rendu de chaque page
    for page in liste_pages_a_rendre:
        page = page + '.html'
        print("Rendu de la page '" + page + "'...")

        page_path = page
        new_page_path = "../build/" + page

        # Charge le template "'page'.html"
        template = env.get_template(page_path)

        # Render le template avec les paramètres souhaités
        output = template.render()

        # Enregiste le résultat dans un fichier 'page'.html
        fichier = open(new_page_path, "a")
        fichier.write(output)
        fichier.close()

    # Copie des pages qui n'ont pas besoin de rendu
    for page in liste_pages_a_copier:
        page = page + '.html'
        print("Copie de la page '" + page + "'...")

        page_path = page
        new_page_path = "../build/" + page

        shutil.copy(page_path, new_page_path)
        