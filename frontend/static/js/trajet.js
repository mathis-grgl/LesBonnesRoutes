const nbTrajets = document.getElementById("nbtrajets");
const nbNotes = document.getElementById("nbnotes");
const name = document.getElementById("prenom");

fetch(`/trajet/trajet/${id}`, {
    method: 'POST'
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => console.error(error));