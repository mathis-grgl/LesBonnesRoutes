import sys, shutil, os
from jinja2 import Environment, FileSystemLoader

# MODIFIER CES 2 LISTES POUR RENDRE LES DIFFÉRENTES PAGES
# SI UNE SEULE PAGE NE 'COMPILE' PAS, LE PROGRAMME NE FAIT PAS LES AUTRES

# Déclaration de la liste des pages à rendre
liste_pages_a_rendre = [
    "about",
    #"account",
    "contact",
    "deconnexion",
    "editprofil",
    "index",
    "privacy",
    "terms",
]

# Déclaration de la liste des pages à copier simplement
liste_pages_a_copier = [
    "login_signup",
]



# Crée un environnement Jinja2 avec le dossier des templates
env = Environment(loader=FileSystemLoader('.'))

# (Re-)Création du dossier build du site
shutil.rmtree('build')
os.makedirs('build')
print("Création du dossier build terminée\n")

# Copie du dossier backend dans le dossier build
shutil.copytree('backend', './build/backend')

# Exécution du fichier install_db.py
exec(open("./build/backend/install_db/install_db.py").read())

# Copie des fichiers sources du frontend
os.makedirs('./build/frontend')
shutil.copytree('./frontend/css', './build/frontend/css')
shutil.copytree('./frontend/fonts', './build/frontend/fonts')
shutil.copytree('./frontend/images', './build/frontend/images')
shutil.copytree('./frontend/js', './build/frontend/js')
shutil.copytree('./frontend/scss', './build/frontend/scss')

os.chdir('./frontend')

print("> Rendu des pages en cours...\n")

# Effectue le rendu de chaque page
for page in liste_pages_a_rendre:
    page = page + '.html'
    print("\tRendu de la page '" + page + "'...")

    page_path = page
    new_page_path = "../build/frontend/" + page

    # Charge le template "'page'.html"
    template = env.get_template(page_path)

    # Render le template avec les paramètres souhaités
    output = template.render()

    # Enregiste le résultat dans un fichier 'page'.html
    fichier = open(new_page_path, "a")
    fichier.write(output)
    fichier.close()

    print("\tRendu terminé.\n")

print("Fin de rendu des pages.\n", "\n> Copie des autres pages...\n")

# Copie des pages qui n'ont pas besoin de rendu
for page in liste_pages_a_copier:
    page = page + '.html'
    print("\tCopie de la page '" + page + "'...")

    page_path = page
    new_page_path = "../build/frontend/" + page

    shutil.copy(page_path, new_page_path)
    
    print("\tCopie terminée.\n")

print("Fin de copie des pages.\n")

# Fin du programme
print('-'*32 + "\n\tRendu complet !" + "\n" + '-'*32)
