localStorage.getItem('difficulty');
localStorage.getItem('amount');
localStorage.getItem('type');
localStorage.getItem('category');

let difficulty = localStorage.getItem('difficulty');
let amount = localStorage.getItem('amount');
let type = localStorage.getItem('type');
let category = localStorage.getItem('category');

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
let availableQuestions = [];

const bonus = 10;
const maxQuestions = amount;
const addPercent = 100 / maxQuestions;
progressPercentage.innerText = `${Math.round(0)}%`;
let percent = 0;

let questions = [];

const API = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}&encode=base64`;

const APICall = async () => {
	try {
		const response = await fetch(API);
		const { results } = await response.json();
		fillQuestions(results);
	} catch (error) {
		console.log(error);
	}
};
APICall();

const fillQuestions = questionsAPI => {
	questions = questionsAPI.map(questionAPI => {
		const decodedQuestions = {
			question: b64toUTF8(questionAPI.question),
		};
		const answerOptions = [...questionAPI.incorrect_answers];
		decodedQuestions.answer = Math.floor(Math.random() * 3) + 1;
		answerOptions.splice(decodedQuestions.answer - 1, 0, questionAPI.correct_answer);

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
	availableQuestions = [...questions];
	triviaContainer.classList.remove('hidden');
	loader.classList.add('hidden');
	getNewQuestion();
};

getNewQuestion = () => {
	if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
		localStorage.setItem('score', score);
		return window.location.assign('/end-page.html');
	}

	questionCounter++;
	questionNumber.innerText = `${questionCounter}/${maxQuestions}`;

	const questionIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];
	question.innerText = currentQuestion.question;

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
		answer.innerText = currentQuestion[`answer${number}`];
	});

	availableQuestions.splice(questionIndex, 1);
	acceptAnswers = true;
};

answers.forEach(answer => {
	answer.addEventListener('click', event => {
		if (!acceptAnswers) return;
		acceptAnswers = false;

		const selectedAnswer = event.target;
		const optionSelected = selectedAnswer.dataset['number'];

		const classToApply =
			parseInt(optionSelected) === currentQuestion.answer ? 'correct' : 'incorrect';

		classToApply === 'correct' ? incrementScore(bonus) : 0;
		selectedAnswer.parentElement.classList.add(classToApply);

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

const b64toUTF8 = str => decodeURIComponent(window.atob(str));
