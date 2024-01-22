const userName = document.querySelector('.user-name');
const saveButton = document.querySelector('#save-button');

const lastScore = localStorage.getItem('score');
const finalScore = document.querySelector('.final-score-number');
finalScore.innerText = lastScore;

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

userName.addEventListener('keyup', () => {
	saveButton.disabled = !userName.value;
});

const saveHighScore = event => {
	event.preventDefault();

	const score = {
		score: lastScore,
		user: userName.value,
	};

	highScores.push(score);
	highScores.sort((a, b) => b.score - a.score);
	highScores.splice(5);

	localStorage.setItem('highScores', JSON.stringify(highScores));
	window.location.assign('./Index.html');
};
