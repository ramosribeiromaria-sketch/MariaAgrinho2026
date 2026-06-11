const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const infoDiv = document.getElementById('info');

const plants = [
  { name: "Tomate", x: 150, y: 200, width: 80, height: 80 },
  { name: "Milho", x: 350, y: 200, width: 80, height: 80 },
  { name: "Alface", x: 550, y: 200, width: 80, height: 80 },
];

const pests = [
  { name: "Lagarta", hint: "Come folhas e deixa buracos" },
  { name: "Pulgão", hint: "Pequeno e suga a seiva" },
  { name: "Mosca-branca", hint: "Voa ao mexer a planta" }
];

let currentPest = null;
let selectedTool = null;

function drawPlants() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  plants.forEach(plant => {
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(plant.x, plant.y, plant.width, plant.height);
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(plant.name, plant.x + 10, plant.y + plant.height + 20);
  });
}

function randomPest() {
  const plant = plants[Math.floor(Math.random() * plants.length)];
  const pest = pests[Math.floor(Math.random() * pests.length)];
  currentPest = { plant, pest };
  infoDiv.textContent = `Detecte a praga na planta: ${plant.name}`;
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (!selectedTool) {
    infoDiv.textContent = "Escolha uma ferramenta primeiro!";
    return;
  }

  const plant = plants.find(p =>
    x > p.x && x < p.x + p.width &&
    y > p.y && y < p.y + p.height
  );

  if (plant) {
    if (plant === currentPest.plant) {
      infoDiv.textContent = `✅ Você detectou: ${currentPest.pest.name}. Dica: ${currentPest.pest.hint}`;
      setTimeout(randomPest, 2000);
    } else {
      infoDiv.textContent = "❌ Esta planta não tem praga!";
    }
  }
});

document.getElementById('magnifier').addEventListener('click', () => {
  selectedTool = "lupa";
  infoDiv.textContent = "Ferramenta selecionada: Lupa 🔍";
});

document.getElementById('sensor').addEventListener('click', () => {
  selectedTool = "sensor";
  infoDiv.textContent = "Ferramenta selecionada: Sensor Térmico 🌡️";
});

drawPlants();
randomPest();
