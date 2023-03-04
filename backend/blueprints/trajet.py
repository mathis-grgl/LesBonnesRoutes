from flask import Blueprint, jsonify, request

trajet_bp = Blueprint('trajet', __name__)


#Rechercher un trajet
@trajet_bp.route('/recherche', methods=['GET'])
def rechercher():
    # Récupérer les données envoyées dans la requête
    villeDepart = request.form.get('ville_depart')
    villeArrivee = request.form.get('ville_arrivee')
    
