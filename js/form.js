let mainForm = document.getElementById('triviaForm');

//Funciones
const formData = event => {
	event.preventDefault();
	let difficulty = document.getElementById('difficulty').value;
	let amount = document.getElementById('amount').value;
	let type = document.getElementById('type').value;
	let category = document.getElementById('category').value;

	localStorage.setItem('difficulty', difficulty);
	localStorage.setItem('amount', amount);
	localStorage.setItem('type', type);
	localStorage.setItem('category', category);
};

//Eventos;
mainForm.onsubmit = formData;
