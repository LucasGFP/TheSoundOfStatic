const playerImage = new Image();

playerImage.src = "personagem.png"; // Substitua pelo caminho da imagem do personagem

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Definindo as dimensões do canvas
canvas.width = 1600;
canvas.height = 760;

// Carregar a imagem de fundo e do chão
const backgroundImage = new Image();
backgroundImage.src = "background.png"; // Substitua pelo caminho da sua imagem de fundo

const groundImage = new Image();
groundImage.src = "rua.png"; // Substitua pelo caminho da sua imagem de chão

// Controle do movimento do fundo e do chão
let backgroundX = 0;
let groundX = 0;
const backgroundSpeed = 2; // Velocidade do fundo
const groundSpeed = 4; // Velocidade do chão (diferente do fundo)

// Parâmetros do jogo
const gravity = 0.8;
let isJumping = false;
let isCrouching = false;
let jumpStrength = 15;

// Personagem
const player = {
  x: 50,
  y: canvas.height - 150,
  width: 50, // Ajuste a largura conforme necessário
  height: 50, // Ajuste a altura conforme necessário
  velocityY: 0,
  speed: 5,
  jump() {
    if (!isJumping) {
      isJumping = true;
      this.velocityY = -jumpStrength;
    }
  },
  crouch() {
    if (!isJumping) {
      isCrouching = true;
      this.height = 25; // Menor altura ao agachar
    }
  },
  standUp() {
    isCrouching = false;
    this.height = 50; // Altura normal
  },
  update() {
    this.velocityY += gravity;
    if (this.y + this.height + this.velocityY > canvas.height - 100) {
      this.y = canvas.height - this.height - 100;
      this.velocityY = 0;
      isJumping = false;
    }
    this.y += this.velocityY;
    this.x = 50;
  },
  draw() {
    ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
  },
};

// Teclas pressionadas
const keys = {
  up: false, // Espaço (pular)
  down: false, // S (agachar)
};

window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    // Tecla espaço
    keys.up = true;
    player.jump(); // Chama a função de pular
  }
  if (e.key === "s" || e.key === "S") {
    // Tecla S
    keys.down = true;
    player.crouch(); // Chama a função de agachar
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === " ") {
    keys.up = false;
  }
  if (e.key === "s" || e.key === "S") {
    keys.down = false;
    player.standUp(); // Chama a função de levantar
  }
});

// Função para desenhar o fundo rolante
function drawBackground() {
  ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height); // Fundo inicial
  ctx.drawImage(
    backgroundImage,
    backgroundX + canvas.width,
    0,
    canvas.width,
    canvas.height
  ); // Fundo repetido

  // Move o fundo para a esquerda
  backgroundX -= backgroundSpeed;

  // Reseta a posição quando o fundo sai completamente da tela
  if (backgroundX <= -canvas.width) {
    backgroundX = 0;
  }
}

// Função para desenhar o chão rolante
function drawGround() {
  ctx.drawImage(groundImage, groundX, canvas.height - 190, canvas.width, 230); // Chão inicial
  ctx.drawImage(
    groundImage,
    groundX + canvas.width,
    canvas.height - 190,
    canvas.width,
    230
  ); // Chão repetido

  // Move o chão para a esquerda (invertido para o movimento correto)
  groundX -= groundSpeed;

  // Reseta a posição quando o chão sai completamente da tela
  if (groundX <= -canvas.width) {
    groundX = 0;
  }
}

// Atualização do jogo
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar a tela a cada loop

  drawBackground(); // Desenha o fundo rolante
  drawGround(); // Desenha o chão rolante
  player.update(); // Atualiza a posição do personagem
  player.draw(); // Desenha o personagem

  requestAnimationFrame(gameLoop); // Chama a função recursivamente para continuar o loop
}

// Iniciar o jogo quando ambas as imagens forem carregadas
backgroundImage.onload = groundImage.onload = () => {
  gameLoop();
};
