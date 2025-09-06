document.addEventListener('DOMContentLoaded', () => {
    const groupForm = document.getElementById('group-form');
    const groupInput = document.getElementById('group-name');
    const message = document.getElementById('message');
    const resultsContainer = document.getElementById('results-container');
    const resultsList = document.getElementById('results-list');
    const showResultsBtn = document.getElementById('show-results-btn');
    
    // Recuperar grupos y el total de votos del almacenamiento local
    let groups = JSON.parse(localStorage.getItem('groups')) || {};
    let totalVotes = parseInt(localStorage.getItem('totalVotes')) || 0;
    
    // Comprobar si el usuario actual ya ha enviado un nombre
    const hasSubmitted = localStorage.getItem('hasSubmitted') === 'true';

    // Deshabilitar el campo de entrada si el usuario ya ha enviado un nombre
    if (hasSubmitted) {
        groupInput.disabled = true;
        groupInput.placeholder = 'Ya has registrado un grupo.';
        document.querySelector('#group-form button').disabled = true;
        showResultsBtn.style.display = 'block'; // Mostrar el botón si ya votó
    }
    
    groupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (hasSubmitted) {
            message.textContent = 'Ya has registrado un grupo. No puedes registrar otro.';
            return;
        }

        const groupName = groupInput.value.trim();

        if (groupName === '') {
            message.textContent = 'Por favor, ingresa un nombre.';
            return;
        }

        // Incrementar el conteo para el nombre del grupo ingresado
        groups[groupName] = (groups[groupName] || 0) + 1;
        
        // Incrementar el conteo total de votos
        totalVotes++;

        // Guardar los datos actualizados
        localStorage.setItem('groups', JSON.stringify(groups));
        localStorage.setItem('totalVotes', totalVotes);
        localStorage.setItem('hasSubmitted', 'true'); // Marcar que este usuario ha enviado un nombre
        
        message.textContent = `¡Gracias! "${groupName}" ha sido registrado.`;

        // Deshabilitar el campo de entrada y el botón después de la entrega
        groupInput.disabled = true;
        groupInput.placeholder = 'Ya has registrado un grupo.';
        document.querySelector('#group-form button').disabled = true;

        // Mostrar el botón de resultados inmediatamente después del registro
        showResultsBtn.style.display = 'block';
    });

    showResultsBtn.addEventListener('click', () => {
        if (resultsContainer.style.display === 'none') {
            displayResults();
            resultsContainer.style.display = 'block';
            showResultsBtn.textContent = 'Ocultar Resultados';
        } else {
            resultsContainer.style.display = 'none';
            showResultsBtn.textContent = 'Mostrar Resultados';
        }
    });

    function displayResults() {
        const latestGroups = JSON.parse(localStorage.getItem('groups'));
        resultsList.innerHTML = '';
        
        // Convertir el objeto a una matriz y ordenarla alfabéticamente
        const sortedGroups = Object.entries(latestGroups).sort();
        
        sortedGroups.forEach(([name, votes]) => {
            const resultItem = document.createElement('li');
            resultItem.textContent = `${name}: ${votes} voto(s)`;
            resultsList.appendChild(resultItem);
        });
    }
});