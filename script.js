let playerScore = 0;
let computerScore = 0;
let roundNumber = 1;
let maxScore = 5;

const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const roundNumberEl = document.getElementById("roundNumber");
const maxScoreLabelEl = document.getElementById("maxScoreLabel");

const playerChoiceEl = document.getElementById("playerChoice");
const computerChoiceEl = document.getElementById("computerChoice");
const roundResultEl = document.getElementById("roundResult");
const statusBadgeEl = document.getElementById("statusBadge");

const choiceButtons = document.querySelectorAll(".choice-btn");
const modeButtons = document.querySelectorAll(".mode-btn");
const resetBtn = document.getElementById("resetBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const gameOverModal = new bootstrap.Modal(
  document.getElementById("gameOverModal")
);
const gameOverTitleEl = document.getElementById("gameOverTitle");
const gameOverMessageEl = document.getElementById("gameOverMessage");

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function toEmoji(choice) {
  if (choice === "rock") return "✊";
  if (choice === "paper") return "✋";
  if (choice === "scissors") return "✌️";
  return "—";
}

function playRound(playerChoice) {
  // If game already finished, ignore click
  if (playerScore >= maxScore || computerScore >= maxScore) return;

  const computerChoice = getComputerChoice();

  let resultText = "";
  let resultType = ""; // win / lose / draw

  if (playerChoice === computerChoice) {
    resultType = "draw";
    resultText = `Both chose ${playerChoice}. It's a draw.`;
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    resultType = "win";
    resultText = `${capitalize(playerChoice)} beats ${computerChoice}. You win this round!`;
    playerScore++;
  } else {
    resultType = "lose";
    resultText = `${capitalize(computerChoice)} beats ${playerChoice}. Computer wins this round.`;
    computerScore++;
  }

  playerChoiceEl.textContent = toEmoji(playerChoice);
  computerChoiceEl.textContent = toEmoji(computerChoice);

  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;

  roundNumber++;
  roundNumberEl.textContent = roundNumber;

  updateResultUI(resultType, resultText);
  checkGameOver();
}

function updateResultUI(type, text) {
  roundResultEl.textContent = text;
  roundResultEl.classList.remove("alert-success", "alert-danger", "alert-dark");

  if (type === "win") {
    roundResultEl.classList.add("alert-success");
  } else if (type === "lose") {
    roundResultEl.classList.add("alert-danger");
  } else {
    roundResultEl.classList.add("alert-dark");
  }
}

function checkGameOver() {
  if (playerScore >= maxScore || computerScore >= maxScore) {
    const playerWon = playerScore > computerScore;

    statusBadgeEl.textContent = "Finished";
    statusBadgeEl.classList.remove("bg-success");
    statusBadgeEl.classList.add(playerWon ? "bg-primary" : "bg-danger");

    gameOverTitleEl.textContent = playerWon ? "You win! 🎉" : "You lost 😅";
    gameOverMessageEl.textContent = playerWon
      ? `You reached ${playerScore} before the computer. Great job!`
      : `Computer reached ${computerScore} before you. Try a rematch!`;

    gameOverModal.show();
  }
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  roundNumber = 1;

  playerScoreEl.textContent = "0";
  computerScoreEl.textContent = "0";
  roundNumberEl.textContent = "1";
  playerChoiceEl.textContent = "—";
  computerChoiceEl.textContent = "—";

  roundResultEl.textContent = "Tap a move to start the game.";
  roundResultEl.className = "alert alert-dark bg-gradient border-0 text-center mb-0";

  statusBadgeEl.textContent = "In progress";
  statusBadgeEl.className = "badge bg-success bg-opacity-75";
}

function setMode(scoreToWin) {
  maxScore = scoreToWin;
  maxScoreLabelEl.textContent = maxScore;
  resetGame();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* Event listeners */
choiceButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const choice = btn.getAttribute("data-choice");
    playRound(choice);
  });
});

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const scoreToWin = Number(btn.getAttribute("data-score"));
    setMode(scoreToWin);
  });
});

resetBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", () => {
  resetGame();
  gameOverModal.hide();
});

// Initial setup
resetGame();
