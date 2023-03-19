let token = getCookieToken();
const test = window.location.href;
const lastChar = parseInt(test.charAt(test.length - 1));
console.log(lastChar);

const url = '/ami/getGroupes/' + token;

function charger_groupe() {
    fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error("network issue");
            }
            return reponse.json();
        })
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (data[i].idGroupe == lastChar) {
                    console.log("on est ici");
                    $('#group-name').val(data[i].nomGroupe);
                }

            }

        })
        .catch(error => {
            console.error(error);
        });
}