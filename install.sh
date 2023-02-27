if test -d "build"; then
  rm -rf build
fi

mkdir build
cp -R backend build

cd build
python3 backend/install_db.py

mkdir frontend
cp -R ../frontend/css frontend
cp -R ../frontend/fonts frontend
cp -R ../frontend/images frontend
cp -R ../frontend/js frontend
cp -R ../frontend/scss frontend
cd ..

cd frontend

python3 render_contact.py > ../build/frontend/contact.html
python3 render_deconnexion.py > ../build/frontend/deconnexion.html
python3 render_editprofil.py > ../build/frontend/modifierProfil.html
