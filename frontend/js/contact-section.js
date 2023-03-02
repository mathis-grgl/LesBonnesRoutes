const submitButton = document.querySelector('input[type="submit"][value="Envoyer"].btn.btn-success.text-white.font-weight-bold');

console.log("OOOK");

submitButton.addEventListener('click', function(event) {
  // handle the submit event here
  event.preventDefault(); // prevent the form from submitting
  
  fetch('/ping/')
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(() => {
        console.error('On a pas pu se co bordelllllll');
      })

    });
