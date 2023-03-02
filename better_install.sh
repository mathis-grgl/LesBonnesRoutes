#!/bin/bash
# (Re-)Création du dossier build du site
if test -d "build"; then
  rm -rf build
fi

mkdir build
cp -R backend build

# Copie du fichier install_db.py
cd build
python backend/install_db/install_db.py

# Copie des fichiers sources du frontend
mkdir frontend
cp -R ../frontend/css frontend
cp -R ../frontend/fonts frontend
cp -R ../frontend/images frontend
cp -R ../frontend/js frontend
cp -R ../frontend/scss frontend
cd ..

cd frontend

# Déclaration de la liste des pages
declare -a ListePagesARendre=("contact" "deconnexion" "editprofil" "privacy" "terms" "account" "index" "about")

# Effectue le rendu de chaque page
for page in ${ListePagesARendre[@]};
do
  echo "Rendu de la page $page.html"
  # Exécution du programme python chargé de rendre une page
  python render_page.py $page > ../build/frontend/$page.html
done

# Copie des pages qui n'ont pas besoin de rendu
cp login_signup.html ../build/frontend/login_signup.html

# Fin du programme
echo "Rendu terminé"