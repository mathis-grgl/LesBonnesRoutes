const submitButton = document.querySelector('input[type="submit"][value="Envoyer"].btn.btn-success.text-white.font-weight-bold');

console.log("OOOK");

submitButton.addEventListener('click', function(event) {
  // handle the submit event here
  event.preventDefault(); // prevent the form from submitting
  
  fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json));
});
