$(function () {
    console.log("ready!");
});


$(document).on('click', '.delete-group', function () {
    console.log("on a clique sur delete");
    let id = parseInt($(this).attr('id'));
    let token = getCookieToken();
    let url = '/ami/supprimerGroupe/' + token + '/' + id;
    if (window.confirm("Etes-vous sûr de vouloir supprimer ce groupe d'amis ? ")) {
        fetch(url)
            .then(reponse => {
                if (!reponse.ok) {
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
    let id = $(this).attr('id');
    let u = new URL(window.location.href);
    u.searchParams.delete("id");
    let url = new URL(window.location.href);
    console.log(url);
    url.pathname = '/ami/modifier_groupe';
    url.searchParams.set("id", id);
    window.location.href = url.href;
});


$(document).on('click', '.add-members', function () {
    console.log("on a clique ajouter membres");
    let id = $(this).attr('id');
    let u = new URL(window.location.href);
    u.searchParams.delete("id");
    let url = new URL(window.location.href);
    console.log(url);
    url.pathname = '/ami/ajouter_amis';
    url.searchParams.set("id", id);
    window.location.href = url.href;


});


