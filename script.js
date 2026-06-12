const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const btnPause = document.getElementById("btnPause");
const btnRestart = document.getElementById("btnRestart");

let score = 0;
let timeLeft = 30; 
let draggingPlant = null;
let gameInterval = null;
let isGameOver = false;
let isPaused = false; // Controla se o jogo está em pausa

// Ajusta canvas ao tamanho da janela
function resizeCanvas(){
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.72;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Plantas e doenças
const plants = ["Milho","Soja","Trigo","Feijão","Tomate","Alface","Batata","Café","Algodão","Cana","Morango","Uva","Cenoura","Couve","Pimentão"];
const diseases = [
    { name: "Saudável", destination: "Viveiro" },
    { name: "Fungo", destination: "Laboratório" },
    { name: "Pulgões", destination: "Controle Biológico" },
    { name: "Lagartas", destination: "Manejo Integrado" },
    { name: "Deficiência Nutricional", destination: "Adubação" },
    { name: "Virose", destination: "Quarentena" }
];

// Setores posicionados dinamicamente
function generateSectors(){
    const sectorHeight = 65;
    const gap = 15;
    const startY = 20;
    const x = canvas.width - 260;
    return [
        {name:"Viveiro", x:x, y:startY, color:"#2ecc71"},
        {name:"Laboratório", x:x, y:startY + (sectorHeight+gap)*1, color:"#8e44ad"},
        {name:"Controle Biológico", x:x, y:startY + (sectorHeight+gap)*2, color:"#e74c3c"},
        {name:"Manejo Integrado", x:x, y:startY + (sectorHeight+gap)*3, color:"#d35400"},
        {name:"Adubação", x:x, y:startY + (sectorHeight+gap)*4, color:"#f1c40f"},
        {name:"Quarentena", x:x, y:startY + (sectorHeight+gap)*5, color:"#34495e"}
    ];
}

let sectors = generateSectors();
let currentPlants = [];

function createPlant() {
    const disease = diseases[Math.floor(Math.random() * diseases.length)];
    let plantWidth = 140;
    const plantHeight = 55;

    ctx.font = "bold italic 12px Arial";
    const textWidth = ctx.measureText(`Problema: ${disease.name}`).width;
    
    if (textWidth + 40 > plantWidth) {
        plantWidth = textWidth + 40;
    }

    return {
        plant: plants[Math.floor(Math.random() * plants.length)],
        disease: disease,
        x: 50 + Math.random() * (canvas.width - 500),
        y: 150 + Math.random() * (canvas.height - 250),
        width: plantWidth,
        height: plantHeight
    };
}

function spawnSinglePlant() {
    currentPlants = [createPlant()];
}

// Sistema do Cronômetro
function startTimer() {
    // Limpa qualquer intervalo anterior para evitar bugs de velocidade duplicada
    if(gameInterval) clearInterval(gameInterval);
    
    gameInterval = setInterval(() => {
        if (!isPaused && !isGameOver) {
            if (timeLeft > 0) {
                timeLeft--;
                timerElement.textContent = `Tempo: ${timeLeft}s`;
            } else {
                endGame();
            }
        }
    }, 1000);
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    alert(`Fim de Jogo! Você conseguiu ${score} pontos!`);
}

// Funções de controle de estado (Pausar e Reiniciar)
function togglePause() {
    if(isGameOver) return;
    
    isPaused = !isPaused;
    if(isPaused) {
        btnPause.innerHTML = "Retomar ▶️";
    } else {
        btnPause.innerHTML = "Pausar ⏸️";
    }
}

function restartGame() {
    clearInterval(gameInterval);
    score = 0;
    timeLeft = 30;
    isGameOver = false;
    isPaused = false;
    draggingPlant = null;
    btnPause.innerHTML = "Pausar ⏸️";
    scoreElement.textContent = `Pontuação: ${score}`;
    timerElement.textContent = `Tempo: ${timeLeft}s`;
    
    spawnSinglePlant();
    startTimer();
}

// Ouvintes de clique nos botões HTML
btnPause.addEventListener("click", togglePause);
btnRestart.addEventListener("click", restartGame);

function roundRect(x, y, width, height, radius, strokeColor = "#000000"){
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
}

function drawSectors(){
    sectors.forEach(sector=>{
        ctx.font = "bold 15px Arial";
        const textWidth = ctx.measureText(sector.name).width;
        const sectorWidth = Math.max(240, textWidth + 70);

        ctx.fillStyle = "#ffffff";
        roundRect(sector.x, sector.y, sectorWidth, 65, 12, "#004d1a");
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sector.x + 25, sector.y + 32, 12, 0, Math.PI*2);
        ctx.fillStyle = sector.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.stroke();

        ctx.fillStyle = "#004d1a";
        ctx.fillText(sector.name, sector.x + 48, sector.y + 38);
        
        sector.actualWidth = sectorWidth;
    });
}

function drawPlants(){
    currentPlants.forEach(plant=>{
        ctx.fillStyle = "#fffdf0";
        roundRect(plant.x, plant.y, plant.width, plant.height, 12, "#2c3e50");
        ctx.fill();

        ctx.fillStyle = "#2c3e50";
        ctx.font = "bold 14px Arial";
        ctx.fillText(plant.plant, plant.x + 20, plant.y + 24);

        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold italic 12px Arial";
        ctx.fillText(`Problema: ${plant.disease.name}`, plant.x + 20, plant.y + 42);
    });
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSectors();
    drawPlants();
    
    if (isPaused && !isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 35px Arial";
        ctx.fillText("JOGO PAUSADO", canvas.width/2 - 130, canvas.height/2);
    }
    
    if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px Arial";
        ctx.fillText("FIM DE JOGO", canvas.width/2 - 130, canvas.height/2);
        return;
    }
    
    requestAnimationFrame(draw);
}

// Impedir interações se estiver pausado
canvas.addEventListener("mousedown", e=>{
    if(isGameOver || isPaused) return; 
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    currentPlants.forEach(plant=>{
        if(mx>plant.x && mx<plant.x+plant.width && my>plant.y && my<plant.y+plant.height){
            draggingPlant=plant;
        }
    });
});

canvas.addEventListener("mousemove", e=>{
    if(!draggingPlant || isGameOver || isPaused) return; 
    const rect = canvas.getBoundingClientRect();
    draggingPlant.x = e.clientX - rect.left - draggingPlant.width/2;
    draggingPlant.y = e.clientY - rect.top - draggingPlant.height/2;
});

canvas.addEventListener("mouseup", ()=>{
    if(!draggingPlant || isGameOver || isPaused) return; 
    
    let acertou = false;
    sectors.forEach(sector=>{
        const widthDoSetor = sector.actualWidth || 240;
        if(
            draggingPlant.x > sector.x - 50 &&
            draggingPlant.x < sector.x + widthDoSetor &&
            draggingPlant.y > sector.y - 20 &&
            draggingPlant.y < sector.y + 65
        ){
            if(draggingPlant.disease.destination === sector.name){
                acertou = true;
            }
        }
    });

    if (acertou) {
        score += 10;
        currentPlants = []; 
        spawnSinglePlant(); 
    } else {
        score = Math.max(0, score - 5); 
        draggingPlant.x = 50 + Math.random() * (canvas.width - 500);
        draggingPlant.y = 150 + Math.random() * (canvas.height - 250);
    }
    
    scoreElement.textContent = `Pontuação: ${score}`;
    draggingPlant = null;
});

// Inicialização
spawnSinglePlant();
startTimer();
draw();
