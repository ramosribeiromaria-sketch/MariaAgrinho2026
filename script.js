const story = document.getElementById("story");
const choices = document.getElementById("choices");
const startBtn = document.getElementById("startBtn");

let score = 0;
let currentScene = 0;

const scenes = [
  {
    text:"Uma escola da cidade quer conhecer de onde vêm os alimentos. O que você sugere?",
    answers:[
      { text:"Organizar uma visita a uma propriedade rural.", points:10 },
      { text:"Pesquisar somente pela internet.", points:5 },
      { text:"Não fazer nenhuma atividade.", points:0 }
    ]
  },
  {
    text:"A comunidade rural está desperdiçando água na irrigação. Qual solução escolher?",
    answers:[
      { text:"Instalar irrigação por gotejamento.", points:10 },
      { text:"Usar mais água para garantir.", points:0 },
      { text:"Ignorar o problema.", points:0 }
    ]
  },
  {
    text:"Feira local tem pouco movimento. Como aproximar produtores e consumidores?",
    answers:[
      { text:"Criar feira sustentável com produtos locais.", points:10 },
      { text:"Aumentar preços.", points:0 },
      { text:"Cancelar a feira.", points:0 }
    ]
  },
  {
    text:"Muitos resíduos estão sendo descartados incorretamente. O que fazer?",
    answers:[
      { text:"Implantar coleta seletiva e educação ambiental.", points:10 },
      { text:"Queimar os resíduos.", points:0 },
      { text:"Jogar em terreno vazio.", points:0 }
    ]
  }
];

startBtn.addEventListener("click", startGame);

function startGame() {
  startBtn.style.display = "none";
  loadScene();
}

function loadScene() {
  if(currentScene >= scenes.length){
    finishGame();
    return;
  }

  const scene = scenes[currentScene];

  story.textContent = scene.text;
  choices.innerHTML = "";

  scene.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.classList.add("choice");
    btn.textContent = answer.text;
    btn.onclick = () => {
      score += answer.points;
      currentScene++;
      loadScene();
    };
    choices.appendChild(btn);
  });
}

function finishGame() {
  choices.innerHTML = "";

  if(score >= 35){
    story.innerHTML = "🏆 FINAL OURO<br>Você fortaleceu a conexão entre campo e cidade e criou uma comunidade sustentável.";
  } else if(score >= 20){
    story.innerHTML = "🥈 FINAL PRATA<br>Você ajudou a comunidade, mas ainda existem desafios a resolver.";
  } else {
    story.innerHTML = "🥉 FINAL BRONZE<br>A comunidade precisa de mais ações sustentáveis para prosperar.";
  }

  // Mostrar botão de reiniciar
  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Jogar Novamente";
  restartBtn.id = "startBtn";
  restartBtn.onclick = () => {
    score = 0;
    currentScene = 0;
    startBtn.style.display = "none";
    loadScene();
  };
  choices.appendChild(restartBtn);
}
