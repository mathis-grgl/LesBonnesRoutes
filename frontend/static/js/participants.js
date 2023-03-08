// Function to display a user card
function displayUserCard(user, container) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = user.name;

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = user.email;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    card.appendChild(cardBody);

    container.appendChild(card);
}

// Function to display the participants
function displayParticipants(participants) {
    const container = document.querySelector('#participants-container');

    // Remove previous participants
    container.innerHTML = '';

    // Display new participants
    participants.forEach(participant => {
        displayUserCard(participant, container);
    });
}

// Function to display the participation requests
function displayDemandes(demandes) {
    const container = document.querySelector('#demandes-container');

    // Remove previous participation requests
    container.innerHTML = '';

    // Display new participation requests
    demandes.forEach(demande => {
        displayUserCard(demande, container);
    });
}

// Example data for testing
const participants = [
    { name: 'John Doe', email: 'john.doe@example.com' },
    { name: 'Jane Doe', email: 'jane.doe@example.com' }
];

const demandes = [
    { name: 'Bob Smith', email: 'bob.smith@example.com' },
    { name: 'Alice Jones', email: 'alice.jones@example.com' }
];

// Display the participants and participation requests
//   displayParticipants(participants);
//   displayDemandes(demandes);

function displayAll() {
    displayParticipants(participants);
    displayDemandes(demandes);

}
