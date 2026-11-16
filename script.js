const cells = Array.from(document.querySelectorAll(".cell"));
const statusText = document.querySelector("#status-text");
const turnDot = document.querySelector("#turn-dot");
const newGameButton = document.querySelector("#new-game");
const resetScoresButton = document.querySelector("#reset-scores");
const scoreElements = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
  draw: document.querySelector("#score-draw"),
};

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let roundOver = false;
let scores = { X: 0, O: 0, draw: 0 };

function updateStatus(message = `Player ${currentPlayer}'s turn`) {
  statusText.textContent = message;
  turnDot.classList.toggle("is-o", currentPlayer === "O");
}

function finishRound(message) {
  roundOver = true;
  cells.forEach((cell) => {
    cell.disabled = true;
  });
  updateStatus(message);
}

function playCell(index) {
  if (roundOver || board[index]) return;

  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "mark-x" : "mark-o");
  cell.disabled = true;
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, ${currentPlayer}`);

  const winningLine = winningLines.find((line) =>
    line.every((cellIndex) => board[cellIndex] === currentPlayer),
  );

  if (winningLine) {
    winningLine.forEach((cellIndex) => cells[cellIndex].classList.add("is-winner"));
    scores[currentPlayer] += 1;
    scoreElements[currentPlayer].textContent = scores[currentPlayer];
    finishRound(`Player ${currentPlayer} wins!`);
    return;
  }

  if (board.every(Boolean)) {
    scores.draw += 1;
    scoreElements.draw.textContent = scores.draw;
    finishRound("It's a draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function startNewRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  roundOver = false;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "is-winner");
    cell.setAttribute("aria-label", `Row ${row}, column ${column}`);
  });

  updateStatus();
  cells[0].focus();
}

function resetScores() {
  scores = { X: 0, O: 0, draw: 0 };
  Object.entries(scoreElements).forEach(([player, element]) => {
    element.textContent = scores[player];
  });
  startNewRound();
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => playCell(index));
});

newGameButton.addEventListener("click", startNewRound);
resetScoresButton.addEventListener("click", resetScores);
