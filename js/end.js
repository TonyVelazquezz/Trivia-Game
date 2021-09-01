const userName = document.querySelector('.user-name');
const saveButton = document.querySelector('#save-button');

const lastScore = localStorage.getItem('score');
const finalScore = document.querySelector('.final-score-number');
finalScore.innerText = lastScore;

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

//Evento cuando la tecla es soltada
userName.addEventListener('keyup', () => {
	//no se guardara si hay caracteres vacíos, undefined, null, etc
	saveButton.disabled = !userName.value;
});

saveHighScore = event => {
	event.preventDefault();

	const score = {
		score: lastScore,
		user: userName.value,
	};

	highScores.push(score);
	//ordenamiento descendente
	highScores.sort((a, b) => b.score - a.score);
	//Eliminar todos los elementos que siguen después del 5° puesto.
	highScores.splice(5);

	localStorage.setItem('highScores', JSON.stringify(highScores));
	window.location.assign('./Index.html');
};
