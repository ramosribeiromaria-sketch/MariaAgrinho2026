const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");

let score = 0;
let draggingPlant = null;

const plants = [
    "Milho",
    "Soja",
    "Trigo",
    "Feijão",
    "Tomate",
    "Alface",
    "Batata",
    "Café",
    "Algodão",
    "Cana",
    "Morango",
    "Uva",
    "Cenoura",
    "Couve",
    "Pimentão"
];

const diseases = [
    {
        name: "Saudável",
        color: "#2ecc71",
        destination: "Viveiro"
    },
    {
        name: "Fungo",
        color: "#8e44ad",
        destination: "Laboratório"
    },
    {
        name: "Pulgões",
        color: "#e74c3c",
        destination: "Controle Biológico"
    },
    {
        name: "Lagartas",
        color: "#d35400",
        destination: "Manejo Integrado"
    },
    {
        name: "Deficiência Nutricional",
        color: "#f1c40f",
        destination: "Adubação"
    },
    {
        name: "Virose",
        color: "#34495e",
        destination: "Quarentena"
    }
];

const sectors = [
    {
        name: "Viveiro",
        x: 650,
        y: 30,
        color: "#2ecc71"
    },
    {
        name: "Laboratório",
        x: 650,
        y: 120,
        color: "#8e44ad"
    },
    {
        name: "Controle Biológico",
        x: 650,
        y: 210,
        color: "#e74c3c"
    },
    {
        name: "Manejo Integrado",
        x: 650,
        y: 300,
        color: "#d35400"
    },
    {
        name: "Adubação",
        x: 650,
        y: 390,
        color: "#f1c40f"
    },
    {
        name: "Quarentena",
        x: 650,
        y: 480,
        color: "#34495e"
    }
];

let currentPlants = [];

function createPlant() {

    const disease =
        diseases[Math.floor(Math.random() * diseases.length)];

    return {
        plant: plants[Math.floor(Math.random() * plants.length)],
        disease: disease,
        x: 30 + Math.random() * 500,
        y: 30 + Math.random() * 500,
        width: 130,
        height: 50
    };
}

function spawnPlants() {

    currentPlants = [];

    for(let i = 0; i < 6; i++) {
        currentPlants.push(createPlant());
    }
}

function drawSectors() {

    sectors.forEach(sector => {

        ctx.fillStyle = sector.color;

        ctx.fillRect(
            sector.x,
            sector.y,
            220,
            70
        );

        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";

        ctx.fillText(
            sector.name,
            sector.x + 10,
            sector.y + 40
        );
    });
}

function drawPlants() {

    currentPlants.forEach(plant => {

        ctx.fillStyle = plant.disease.color;

        ctx.fillRect(
            plant.x,
            plant.y,
            plant.width,
            plant.height
        );

        ctx.fillStyle = "white";
        ctx.font = "14px Arial";

        ctx.fillText(
            plant.plant,
            plant.x + 8,
            plant.y + 18
        );

        ctx.fillText(
            plant.disease.name,
            plant.x + 8,
            plant.y + 38
        );
    });
}

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawSectors();
    drawPlants();

    requestAnimationFrame(draw);
}

canvas.addEventListener("mousedown", e => {

    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    currentPlants.forEach(plant => {

        if(
            mouseX > plant.x &&
            mouseX < plant.x + plant.width &&
            mouseY > plant.y &&
            mouseY < plant.y + plant.height
        ){
            draggingPlant = plant;
        }
    });
});

canvas.addEventListener("mousemove", e => {

    if(!draggingPlant) return;

    const rect = canvas.getBoundingClientRect();

    draggingPlant.x =
        e.clientX - rect.left - draggingPlant.width / 2;

    draggingPlant.y =
        e.clientY - rect.top - draggingPlant.height / 2;
});

canvas.addEventListener("mouseup", () => {

    if(!draggingPlant) return;

    sectors.forEach(sector => {

        if(
            draggingPlant.x > sector.x &&
            draggingPlant.x < sector.x + 220 &&
            draggingPlant.y > sector.y &&
            draggingPlant.y < sector.y + 70
        ){

            if(
                draggingPlant.disease.destination ===
                sector.name
            ){

                score += 10;

                currentPlants =
                    currentPlants.filter(
                        p => p !== draggingPlant
                    );

                currentPlants.push(createPlant());

            }else{

                score -= 5;
            }

            scoreElement.textContent =
                `Pontuação: ${score}`;
        }
    });

    draggingPlant = null;
});

spawnPlants();
draw();
