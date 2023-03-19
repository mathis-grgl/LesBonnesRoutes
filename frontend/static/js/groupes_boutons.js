$(function () {
    console.log("ready!");
});


$(document).on('click', '.delete-group', function () {
    console.log("on a clique sur delete");
    let id = parseInt($(this).attr('id'));
    let token = getCookieToken();
    let url = '/ami/supprimerGroupe/' + token + '/'+id;
    if(window.confirm("Etes-vous sûr de vouloir supprimer ce groupe d'amis ? ")){
        fetch(url)
        .then(reponse => {
            if(!reponse.ok){
                throw new Error('PB network');
            }
            return reponse.json();
        })
        .then(data => {
            console.log("On retire le groupe " + id);
            location.reload();
        })
        .catch(error => {
            console.error(error);
        })
    }

    
});



$(document).on('click', '.edit-group', function () {
    console.log("on a clique sur edit");

    // console.log('Le bouton "details" a été cliqué.');
    // let id = $(this).attr('id');
    // console.log(id);
    // let u = new URL(window.location.href);
    // u.searchParams.delete("id");
    
    // let url = new URL(window.location.href);

    // console.log(url);

    // url.pathname = '/trajet/participants';
    // // Ajouter un paramètre "id" à l'URL
    // url.searchParams.set("id", id);
    

    // // console.log(url);
    // // window.location.href = url.href;

    


    // // Rediriger vers la nouvelle URL avec le paramètre "id"
    // window.location.href = url.href;
});