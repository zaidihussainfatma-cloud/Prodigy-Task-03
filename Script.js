const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const xScoreEl = document.getElementById('xScore');
const oScoreEl = document.getElementById('oScore');
const clickSound = document.getElementById('clickSound');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let xScore = 0;
let oScore = 0;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function playSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function handleClick(event) {
  const index = event.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  playSound();

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    updateScore(currentPlayer);
    highlightWinningCells(currentPlayer);
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  statusText.textContent = `AI's turn...`;

  setTimeout(() => {
    aiMove();
  }, 500);
}

function aiMove() {
  if (!gameActive) return;

  // Simple AI: pick random empty cell
  const emptyIndices = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[randomIndex] = "O";
  cells[randomIndex].textContent = "O";
  playSound();

  if (checkWinner("O")) {
    statusText.textContent = "AI wins!";
    updateScore("O");
    highlightWinningCells("O");
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = "Player X's turn";
}

function checkWinner(player) {
  return winConditions.some(comb => {
    return comb.every(index => board[index] === player);
  });
}

function highlightWinningCells(player) {
  winConditions.forEach(comb => {
    if (comb.every(i => board[i] === player)) {
      comb.forEach(i => cells[i].classList.add('winner'));
    }
  });
}

function updateScore(player) {
  if (player === "X") {
    xScore++;
    xScoreEl.textContent = xScore;
  } else {
    oScore++;
    oScoreEl.textContent = oScore;
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
