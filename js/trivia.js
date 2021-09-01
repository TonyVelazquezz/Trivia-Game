//Obtener datos del localStorage
localStorage.getItem('difficulty');
localStorage.getItem('amount');
localStorage.getItem('type');
localStorage.getItem('category');

//Guardar datos del localStorage en variables
let difficulty = localStorage.getItem('difficulty');
let amount = localStorage.getItem('amount');
let type = localStorage.getItem('type');
let category = localStorage.getItem('category');

//Si las preguntas son de tipo opción multiple, elimina la opción C y D

//Selectores
const question = document.querySelector('.question');
const answers = Array.from(document.querySelectorAll('.answer-text'));
const scoreNumber = document.querySelector('#score');
const questionNumber = document.querySelector('#number-question');
const progressPercentage = document.querySelector('#progress-percentage');
const answerContainerC = document.querySelector('#c');
const answerContainerD = document.querySelector('#d');
const triviaContainer = document.querySelector('#trivia');
const loader = document.querySelector('.loader');

let currentQuestion = {};
let acceptAnswers = false;
let score = 0;

let questionCounter = 0;
let availableQuestion = [];

//Constantes
const bonus = 10;
const maxQuestions = amount;
const addPercent = 100 / maxQuestions;
progressPercentage.innerText = `${Math.round(0)}%`;
let percent = 0;

let questions = [];

//Fetch
const API = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}&encode=base64`;

fetch(API)
	.then(response => response.json())
	.then(result => fillQuestions(result))
	.catch(err => console.log(err));

const fillQuestions = questionsAPI => {
	questions = questionsAPI.results.map(questionAPI => {
		const decodedQuestions = {
			question: b64toUTF8(questionAPI.question),
		};
		const answerOptions = [...questionAPI.incorrect_answers];
		decodedQuestions.answer = Math.floor(Math.random() * 3) + 1;
		answerOptions.splice(
			decodedQuestions.answer - 1,
			0,
			questionAPI.correct_answer
		);

		answerOptions.forEach((option, index) => {
			decodedQuestions[`answer${index + 1}`] = b64toUTF8(option);
		});

		return decodedQuestions;
	});

	startTrivia();
};

startTrivia = () => {
	questionCounter = 0;
	score = 0;
	availableQuestion = [...questions];
	triviaContainer.classList.remove('hidden');
	loader.classList.add('hidden');
	getNewQuestion();
};

getNewQuestion = () => {
	if (availableQuestion.length === 0 || questionCounter >= maxQuestions) {
		//Guardar la puntuación final en localStorage
		localStorage.setItem('score', score);
		//Ir a la página final
		return window.location.assign('/end-page.html');
	}

	//Contador de preguntas
	questionCounter++;
	questionNumber.innerText = `${questionCounter}/${maxQuestions}`;

	//Generar preguntas aleatorias
	const questionIndex = Math.floor(Math.random() * availableQuestion.length);
	currentQuestion = availableQuestion[questionIndex];
	question.innerText = currentQuestion.question;

	//Si la pregunta es de tipo true/false, remueve la opción C y D.
	if (
		currentQuestion.answer1 === 'True' ||
		currentQuestion.answer1 === 'False' ||
		currentQuestion.answer2 === 'True' ||
		currentQuestion.answer2 === 'False'
	) {
		answerContainerC.classList.add('remove');
		answerContainerD.classList.add('remove');
	} else {
		answerContainerC.classList.remove('remove');
		answerContainerD.classList.remove('remove');
	}

	answers.forEach(answer => {
		const number = answer.dataset['number'];
		//coloca la respuesta en el contenedor correspondiente al atributo de datos
		answer.innerText = currentQuestion[`answer${number}`];
	});

	availableQuestion.splice(questionIndex, 1);
	acceptAnswers = true;
};

answers.forEach(answer => {
	answer.addEventListener('click', event => {
		if (!acceptAnswers) return;
		acceptAnswers = false;

		const selectedAnswer = event.target;
		//manda la posición al hacer click establecida por el atributo de dato
		const optionSelected = selectedAnswer.dataset['number'];

		const classToApply =
			//Si el numero del atributo de dato cliqueado coincide con el valor de la pregunta correcta.
			parseInt(optionSelected) === currentQuestion.answer
				? 'correct'
				: 'incorrect';

		//Si la respuesta es correcta, aumenta 10 puntos.
		classToApply === 'correct' ? incrementScore(bonus) : 0;
		//agrega la clase 'correcta o incorrecta' dependiendo de si acertó o no
		selectedAnswer.parentElement.classList.add(classToApply);

		//Aumenta el porcentaje correspondiente al numero de preguntas.
		incrementPercent(addPercent);

		setTimeout(() => {
			selectedAnswer.parentElement.classList.remove(classToApply);
			getNewQuestion();
		}, 500);
	});
});

const incrementScore = increment => {
	score += increment;
	scoreNumber.innerText = score;
};

const incrementPercent = increment => {
	percent += increment;
	progressPercentage.innerText = `${Math.round(percent)}%`;
};

//Decodificar base64 a UTF-8
const b64toUTF8 = str => decodeURIComponent(escape(window.atob(str)));
