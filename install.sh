#!/bin/bash
if test -d "build"; then
  rm -rf build
fi

mkdir build
cp -R backend build

cd build
python3.11 backend/install_db.py

mkdir frontend
cp -R ../frontend/css frontend
cp -R ../frontend/fonts frontend
cp -R ../frontend/images frontend
cp -R ../frontend/js frontend
cp -R ../frontend/scss frontend
cd ..

cd frontend

python3.11 render_contact.py > ../build/frontend/contact.html
python3.11 render_deconnexion.py > ../build/frontend/deconnexion.html
python3.11 render_editprofil.py > ../build/frontend/ModifierProfil.html
python3.11 render_privacy.py > ../build/frontend/privacy.html
cp login_signup.html ../build/frontend/login_signup.html
python3.11 render_terms.py > ../build/frontend/terms.html
python3.11 render_account.py > ../build/frontend/account.html
python3.11 render_index.py > ../build/frontend/index.html