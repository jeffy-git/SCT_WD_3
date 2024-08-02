const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.getElementById("winningMessageText");
const restartButton = document.getElementById("restartButton");
const userButton = document.getElementById("userButton");
const computerButton = document.getElementById("computerButton");
const playerScoreElement = document.getElementById("playerScore");
const computerScoreElement = document.getElementById("computerScore");

let isCircleTurn;
let isPlayingWithComputer = false;
let playerScore = 0;
let computerScore = 0;

userButton.addEventListener("click", () => {
  isPlayingWithComputer = false;
  startGame();
  hidePlayOptions();
});

computerButton.addEventListener("click", () => {
  isPlayingWithComputer = true;
  startGame();
  hidePlayOptions();
});

restartButton.addEventListener("click", () => {
  resetScores();
  showPlayOptions();
  startGame();
});

function startGame() {
  isCircleTurn = false; // X starts first
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.add("hidden");
  playerScoreElement.classList.add("hidden");
  computerScoreElement.classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  // If playing with computer, make the computer move immediately if it's the computer's turn
  if (isPlayingWithComputer && isCircleTurn) {
    setTimeout(computerMove, 500); // Delay to simulate thinking
  }
}

function handleClick(e) {
  const cell = e.target;
  if (cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS))
    return; // Ignore if already filled

  const currentClass = isCircleTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    isCircleTurn = !isCircleTurn; // Toggle turn
    setBoardHoverClass();
    if (isPlayingWithComputer) {
      setTimeout(computerMove, 500); // Delay for computer's move
    }
  }
}

function computerMove() {
  const availableCells = [...cellElements].filter((cell) => {
    return (
      !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    );
  });
  if (availableCells.length === 0) return; // No moves left

  // Choose a random cell for the computer
  const randomCell =
    availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, O_CLASS);
  randomCell.removeEventListener("click", handleClick);

  if (checkWin(O_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    isCircleTurn = !isCircleTurn; // Toggle turn
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    const winner = isCircleTurn ? "O's" : "X's";
    winningMessageTextElement.innerText = `${winner} Wins!`;

    // Update scores
    if (isCircleTurn) {
      computerScore++;
    } else {
      playerScore++;
    }
  }

  // Update and display scores
  playerScoreElement.innerText = `Player: ${playerScore}`;
  computerScoreElement.innerText = `Computer: ${computerScore}`;
  playerScoreElement.classList.remove("hidden");
  computerScoreElement.classList.remove("hidden");

  winningMessageElement.classList.remove("hidden");
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  board.classList.add(isCircleTurn ? O_CLASS : X_CLASS);
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function hidePlayOptions() {
  userButton.classList.add("hidden");
  computerButton.classList.add("hidden");
}

function showPlayOptions() {
  userButton.classList.remove("hidden");
  computerButton.classList.remove("hidden");
}

function resetScores() {
  playerScore = 0;
  computerScore = 0;
  playerScoreElement.innerText = `Player: ${playerScore}`;
  computerScoreElement.innerText = `Computer: ${computerScore}`;
  playerScoreElement.classList.add("hidden");
  computerScoreElement.classList.add("hidden");
}
