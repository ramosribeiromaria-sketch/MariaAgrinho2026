const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let score = 0;
let draggingPlant = null;

// Ajusta canvas ao tamanho da janela
function resizeCanvas(){
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.75;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Plantas e doenças
const plants = ["Milho","Soja","Trigo","Feijão","Tomate","Alface","Batata","Café","Algodão","Cana","Morango","Uva","Cenoura","Couve","Pimentão"];
const diseases = [
    { name: "Saudável", color: "#2ecc71", destination: "Viveiro" },
    { name: "Fungo", color: "#8e44ad", destination: "Laboratório" },
    { name: "Pulgões", color: "#e74c3c", destination: "Controle Biológico" },
    { name: "Lagartas", color: "#d35400", destination: "Manejo Integrado" },
    { name: "Deficiência Nutricional", color: "#f1c40f", destination: "Adubação" },
    { name: "Virose", color: "#34495e", destination: "Quarentena" }
];

// Setores posicionados dinamicamente
function generateSectors(){
    const sectorHeight = 70;
    const gap = 20;
    const startY = 30;
    const x = canvas.width - 250;
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

// Cria plantas
function createPlant() {
    const disease = diseases[Math.floor(Math.random() * diseases.length)];
    return {
        plant: plants[Math.floor(Math.random() * plants.length)],
        disease: disease,
        x: 50 + Math.random() * (canvas.width - 350),
        y: 50 + Math.random() * (canvas.height - 100),
        width: 130,
        height: 50
    };
}

let currentPlants = [];

function spawnPlants(){
    currentPlants = [];
    for(let i=0; i<6; i++){
        currentPlants.push(createPlant());
    }
}

// Função para desenhar retângulos arredondados
function roundRect(x, y, width, height, radius){
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
}

// Desenha setores com cartão arredondado e círculo indicador
function drawSectors(){
    sectors.forEach(sector=>{
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 15;
        roundRect(sector.x, sector.y, 220, 70, 18);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(sector.x + 25, sector.y + 35, 12, 0, Math.PI*2);
        ctx.fillStyle = sector.color;
        ctx.fill();

        ctx.fillStyle = "#2c3e50";
        ctx.font = "bold 16px Arial";
        ctx.fillText(sector.name, sector.x + 50, sector.y + 40);
    });
}

// Desenha plantas com cartão arredondado e bolinha de doença
function drawPlants(){
    currentPlants.forEach(plant=>{
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 12;
        roundRect(plant.x, plant.y, plant.width, plant.height, 15);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(plant.x + 18, plant.y + 18, 8, 0, Math.PI*2);
        ctx.fillStyle = plant.disease.color;
        ctx.fill();

        ctx.fillStyle = "#2c3e50";
        ctx.font = "bold 14px Arial";
        ctx.fillText(plant.plant, plant.x + 35, plant.y + 20);

        ctx.fillStyle = "#7f8c8d";
        ctx.font = "12px Arial";
        ctx.fillText(plant.disease.name, plant.x + 35, plant.y + 38);
    });
}

// Loop principal
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSectors();
    drawPlants();
    requestAnimationFrame(draw);
}

// Eventos de arrastar
canvas.addEventListener("mousedown", e=>{
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
    if(!draggingPlant) return;
    const rect = canvas.getBoundingClientRect();
    draggingPlant.x = e.clientX - rect.left - draggingPlant.width/2;
    draggingPlant.y = e.clientY - rect.top - draggingPlant.height/2;
});

canvas.addEventListener("mouseup", ()=>{
    if(!draggingPlant) return;
    sectors.forEach(sector=>{
        if(
            draggingPlant.x > sector.x &&
            draggingPlant.x < sector.x+220 &&
            draggingPlant.y > sector.y &&
            draggingPlant.y < sector.y+70
        ){
            if(draggingPlant.disease.destination === sector.name){
                score+=10;
                currentPlants=currentPlants.filter(p=>p!==draggingPlant);
                currentPlants.push(createPlant());
            }else{
                score-=5;
            }
            scoreElement.textContent=`Pontuação: ${score}`;
        }
    });
    draggingPlant=null;
});

spawnPlants();
draw();
