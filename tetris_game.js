// Path: tetris_game.js
const start = document.getElementById("start");
const audio = document.getElementById("audio");
const canvas = document.getElementById("myCanvas");
const points = document.getElementById("points");
canvas.style.display = "none";
const context = canvas.getContext("2d");
const boxSize = 30;
const boardWidth = canvas.width / boxSize;
const boardHeight = canvas.height / boxSize;

// Tetris shapes and their colors
const shapes = [
  [[1, 1, 1, 1]], // I
  [[1, 1, 1], [1]], // L
  [
    [1, 1, 1],
    [0, 1],
  ], // J
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [1, 1, 1],
    [0, 1],
  ], // S
  [[1, 1, 1], [1]], // T
  [
    [1, 1],
    [0, 1, 1],
  ], // Z
];
const colors = [
  "#FFA500",
  "#0000FF",
  "#FFFF00",
  "#00FF00",
  "#FF00FF",
  "#FF0000",
];

let currentTetromino = randomTetromino();
let tetrominoX =
  Math.floor(boardWidth / 2) - Math.floor(currentTetromino[0].length / 2);
let tetrominoY = 0;
let colorActual = generateColor();
let lastTime = 0;
let interval = 1000;
let countGame = 0;
let sumPoint = 10;
let globalId;
const namePlayer = document.getElementById("name");
const score = document.getElementById("score");

// Function to draw a square
function drawSquare(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
  context.strokeStyle = "#000000";
  context.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);
}

// Function to draw the game board
function drawBoard() {
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      if (board[row][col]) {
        drawSquare(col, row, "#00FFFF");
      }
    }
  }
}

// Initialize the game board
const board = Array.from({ length: boardHeight }, () =>
  Array(boardWidth).fill(0)
);

// Function to draw the tetromino
function drawTetromino(tetromino, xOffset, yOffset, color) {
  tetromino.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value) {
        const x = colIndex + xOffset;
        const y = rowIndex + yOffset;
        drawSquare(x, y, color);
      }
    });
  });
}

// Function to rotate a tetromino
function rotateTetromino(tetromino) {
  console.log(tetromino);
  const rotated = [];
  for (let i = 0; i <= tetromino[0].length; i++) {
    const row = [];
    for (let j = tetromino.length - 1; j >= 0; j--) {
      if (tetromino[j][i] == undefined) {
        console.log(tetromino[j][i]);
        row.push(0);
      } else row.push(tetromino[j][i]);
    }
    rotated.push(row);
  }
  console.log(rotated);
  return rotated;
}

// Generate a random tetromino
function randomTetromino() {
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex];
}

// Game loop
function gameLoop(timestamp = 3000) {
  // Move the tetromino down
  const deltaTime = timestamp - lastTime;
  updateDifficulty();

  // Si ha pasado el intervalo de tiempo, ejecuta tu lógica
  if (deltaTime >= interval) {
    tetrominoY++;
    update();

    console.log("Ejecutando cada segundo");

    // Actualiza el último tiempo
    lastTime = timestamp;
  }

  globalId = requestAnimationFrame(gameLoop);
}

function updateDifficulty() {
  countGame++;
  if (countGame == 2000) {
    //alert("Aumentando a "+ sumPoint);
    interval = interval - 100;
    countGame = 0;
    sumPoint = sumPoint + 10;
  }
}
function generateColor() {
  console.log("generate collor");
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function sumPoints() {
  points.innerHTML = parseInt(points.innerHTML) + sumPoint;
}

// Function to check if the tetromino collides with the board or other tetrominos
function collidesWithBoard() {
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (
        currentTetromino[row][col] &&
        (board[row + tetrominoY] &&
          board[row + tetrominoY][col + tetrominoX]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function clearPieces() {
  const newRow = Array(boardWidth).fill(0);
  const rowsDelete = [];

  board.forEach((row) => {
    if (row.every((cell) => cell === 1)) rowsDelete.push(row);
  });
  console.log(rowsDelete);
  rowsDelete.forEach((row) => {
    board.splice(board.indexOf(row), 1);
    board.unshift(newRow);
    sumPoints();
  });
}

// Function to merge the tetromino with the board
function mergeTetromino() {
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (currentTetromino[row][col] == 1) {
        const x = col + tetrominoX;
        const y = row + tetrominoY;
        board[y][x] = 1;
      }
    }
  }
}

// Event Listener for Touch Controls
document.addEventListener(LISTENER_ENUM.TOUCHSTART, function (event) {
  const touch = event.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;
  const halfWidth = canvas.width / 2;
  const halfHeight = canvas.height / 2;
  if (x < halfWidth) {
    // Move tetromino left
    tetrominoX--;
    if (collidesWithBoard()) {
      // Revert the move if it collides
      tetrominoX++;
    }
  } else {
    // Move tetromino right
    tetrominoX++;
    if (collidesWithBoard()) {
      // Revert the move if it collides
      tetrominoX--;
    }
  }
  if (y > halfHeight) {
    // Move tetromino down
    tetrominoY++;
    update();
  } else {
    // Rotate tetromino
    const rotatedTetromino = rotateTetromino(currentTetromino);
    if (!collidesWithBoard(rotatedTetromino)) {
      currentTetromino = rotatedTetromino;
    }
  }
});

// Event listener for keyboard controls
document.addEventListener(LISTENER_ENUM.KEYDOWN, function (event) {
  switch (event.code) {
    case MOVEMENT_ENUM.LEFT:
      // Move tetromino left
      tetrominoX--;
      if (collidesWithBoard()) {
        // Revert the move if it collides
        tetrominoX++;
      }
      break;
    case MOVEMENT_ENUM.RIGHT:
      // Move tetromino right
      tetrominoX++;
      if (collidesWithBoard()) {
        // Revert the move if it collides
        tetrominoX--;
      }
      break;
    case MOVEMENT_ENUM.DOWN:
      // Move tetromino down
      tetrominoY++;
      update();
      break;
    case MOVEMENT_ENUM.UP:
      // Rotate tetromino
      const rotatedTetromino = rotateTetromino(currentTetromino);
      if (!collidesWithBoard(rotatedTetromino)) {
        currentTetromino = rotatedTetromino;
      }
  }
});

// Start the game loop
main();
//openModal();
function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (collidesWithBoard()) {
    // Revert the move if it collides
    tetrominoY--;
    mergeTetromino();
    currentTetromino = randomTetromino();
    tetrominoX =
      Math.floor(boardWidth / 2) - Math.floor(currentTetromino[0].length / 2);
    tetrominoY = 0;
    colorActual = generateColor();
    clearPieces();
    if (collidesWithBoard()) {
      // Game over
      gameOver();
    }
  }
  drawTetromino(currentTetromino, tetrominoX, tetrominoY, colorActual);
  drawBoard();
}
function gameOver() {
  const scoreHistory = new ScoreHistory(
    parseInt(points.innerHTML),
    namePlayer.value
  );
  scoreHistory.saveScore();
  audio.pause();
  cancelAnimationFrame(globalId);
  score.style.display = "none";
  //canvas.style.display = "none";
  const resume_score = document.getElementById("resume_score");
  resume_score.innerHTML = "Hiciste: " + points.innerHTML + " puntos";
  sumPoint = 0;
  points.innerHTML = parseInt(points.innerHTML) + sumPoint;
  board.forEach((row) => row.fill(0));
  openModal();
}

// Función para abrir el modal
function openModal() {
  document.getElementById("gameResultModal").style.display = "block";
}

// Función para cerrar el modal
function closeModalResumeScores() {
  document.getElementById("historyScoreModal").style.display = "none";
  document.getElementById("tableBodyHistoryScore").innerHTML = "";
}

function closeModal() {
  document.getElementById("gameResultModal").style.display = "none";
  start.style.display = "flex";
}

function main() {
  verifyGadget();
  const startEvent = document.getElementById("startEvent");
  startEvent.addEventListener("click", function () {
    if (namePlayer.value == "") {
      console.log("no hay nombre");
      showSnackBarMessage();
      return;
    }
    audio.play();
    audio.loop = true;
    start.style.display = "none";
    canvas.style.display = "flex";
    score.style.display = "block";
    globalId = requestAnimationFrame(gameLoop);
  });
}

async function openModalScore() {
  document.getElementById("historyScoreModal").style.display = "block";
  const scoreHistory = new ScoreHistory();
  const scores = await scoreHistory.getScore();
  console.log(scores);
  const scoreList = document.getElementById("tableBodyHistoryScore");
  scores.forEach((score) => {
    const row = document.createElement("tr");
    const nameUser = document.createElement("td");
    nameUser.innerHTML = score.nameUser;
    const scoreUser = document.createElement("td");
    scoreUser.innerHTML = score.score;
    row.appendChild(nameUser);
    row.appendChild(scoreUser);
    scoreList.appendChild(row);
  });
}

function showSnackBarMessage() {
  // Get the snackbar DIV
  var snackbar = document.getElementById("snackbar");

  // Add the "show" class to DIV
  snackbar.className = "show";

  snackbar.innerHTML = "Debes ingresar un nombre para comenzar a jugar";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

function verifyGadget() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    console.log("Estás usando un dispositivo móvil!!");
  } else {
    console.log("Estás usando un dispositivo de escritorio!!");
  }
}
