
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const feedback = document.getElementById("feedback");
const finalScore = document.getElementById("final-score");

let currentQuestionIndex = 0;
let score = 0;

const questions = [
    {
        question: "Qual a importância de plantar árvores?",
        answers: [
            { text: "Aumenta a poluição", correct: false },
            { text: "Ajuda a manter o ar limpo e protege o solo", correct: true },
            { text: "Não tem efeito algum", correct: false },
        ]
    },
    {
        question: "Qual prática ajuda a economizar água?",
        answers: [
            { text: "Deixar a torneira aberta enquanto escova os dentes", correct: false },
            { text: "Reutilizar água da chuva e fechar torneiras", correct: true },
            { text: "Usar água de rio para beber direto", correct: false },
        ]
    },
    {
        question: "O que é cidadania?",
        answers: [
            { text: "Apenas pagar impostos", correct: false },
            { text: "Participar da sociedade e respeitar regras", correct: true },
            { text: "Ignorar leis e regras", correct: false },
        ]
    },
    {
        question: "Qual alimento é considerado saudável?",
        answers: [
            { text: "Frutas e verduras", correct: true },
            { text: "Refrigerantes e doces em excesso", correct: false },
            { text: "Salgadinhos industrializados", correct: false },
        ]
    }
];

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

function startGame() {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function restartGame() {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
}

function showQuestion() {
    feedback.textContent = "";
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answerButtons.innerHTML = "";

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.addEventListener("click", () => selectAnswer(answer));
        answerButtons.appendChild(button);
    });
}

function selectAnswer(answer) {
    if (answer.correct) {
        feedback.textContent = "✅ Correto!";
        score += 10;
    } else {
        feedback.textContent = "❌ Errado!";
    }

    currentQuestionIndex++;

    setTimeout(() => {
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    finalScore.textContent = score;
}
