const highScoreList = document.querySelector('.scores-list');
const highScores = JSON.parse(localStorage.getItem('highScores') || []);

highScoreList.innerHTML = highScores
	.map(
		score =>
			`<li class= "high-score">
           	 	<p class= "score-name">${score.user}</p>
            	<p class= "score-number">${score.score}</p>
            </li>`
	)
	.join('');
