//Gérer affichage des boutons dans le menu
const connection = document.querySelector("li[name='connection']");
const deconnection = document.querySelector("li[name='deconnection']");
const profil = document.querySelector("li[name='profil']");
const rechercherTrajet = document.querySelector("li[name='mes_offres']");
const groupes = document.querySelector("li[name='groupes']");
const iconWrapper = document.querySelector('.icon-wrapper');
const admin = document.querySelector("li[name='admin']");
const tokenH = getCookieToken();
let isAdmin = false;

// Si le token est null, on affiche le bouton de connexion et on cache les autres
if (tokenH === null) {
    connection.style = "display: block;";
    deconnection.style = "display: none;";
    profil.style = "display: none";
    rechercherTrajet.style = "display: none";
    groupes.style = "display: none";
    iconWrapper.style = "display: none;";
    admin.style = "display: none;";
} 

// Sinon on affiche tous les boutons liés à l'utilisateur connecté et on cache le bouton de connexion
else {

    // Requête pour vérifier si l'utilisateur est admin
    fetch('/admin/users/' + tokenH + '/isadmin')
        .then(reponse => {
            if (!reponse.ok) { throw new Error(reponse.statusText); }
            return reponse.json();
        })
        .then(data => {

            // On cache le bouton de connexion et on affiche le bouton de déconnexion
            connection.style = "display: none";

            // Si l'utilisateur est admin, on affiche le bouton admin
            if (data === 1){
                rechercherTrajet.style = "display: none";
                groupes.style = "display: none";
            }
            
            // Sinon on ne l'affiche pas
            else admin.style = "display: none;";
        })
        .catch(error => {
            console.error(error);
        })
}