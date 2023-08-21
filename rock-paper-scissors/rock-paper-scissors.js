const rock = document.querySelector(".rock");
const paper = document.querySelector(".paper");
const scissors = document.querySelector(".scissors");
const gMoves = [
  { name: "rock", element: rock, wins: "scissors" },
  { name: "paper", element: paper, wins: "rock" },
  { name: "scissors", element: scissors, wins: "paper" },
];
const cpuEl = document.querySelector(".cpu");
const blackScreenEl = document.querySelector(".black-screen");
const endMsgEl = document.querySelector(".end-msg");
const playAgainEl = document.querySelector(".play-again-btn");
var isGameOver = false;
var playerChoice;
var cpuChoice;

//function that starts game (hides blackscreen and start btn)
function startGame() {
  const startBtnEl = document.querySelector(".start-btn");
  blackScreenEl.hidden = true;
  startBtnEl.hidden = true;
  playAgainEl.hidden = false;
  isGameOver = false;
  cpuEl.innerText = "Choose your move:";
  if (playerChoice) {
    cleanElBg(playerChoice.element);
  }
  if (!rock.classList.contains("move-hover")) {
    console.log("hi");
    addHover();
  }
}

//function that playes a turn on player's click
function playTurn(move) {
  if (isGameOver) return;

  removeHover();
  markChoice(move);
  isGameOver = true;

  playerChoice = getObject(move);
  cpuChoice = cpuRandom();

  showCpuChoice(cpuChoice);

  console.log("playerChoice", playerChoice);
  console.log("cpuChoice", cpuChoice);
}

//function that finds the object with the name
function getObject(move) {
  const moveObject = gMoves.find((object) => {
    return object.name === move;
  });
  return moveObject;
}

//function that marks the players choice
function markChoice(move) {
  const moveObject = gMoves.find((object) => {
    return object.name === move;
  });

  const moveEl = moveObject.element;
  moveEl.style.backgroundColor = "rgb(162, 76, 243)";
}

//function that cleans the background color of element
function cleanElBg(element) {
  element.style.backgroundColor = "";
}

//function that presrnts cpuChoice to user and prevents it
function showCpuChoice(cpuChoice) {
  cpuEl.innerText = "";
  const choiceEl = cpuChoice.element;
  const choiceElClone = choiceEl.cloneNode(true);
  cleanElBg(choiceElClone);
  cpuEl.appendChild(choiceElClone);
  showEndScreen();
}

//function that shows end screen
function showEndScreen() {
  setTimeout(() => {
    blackScreenEl.hidden = false;
    endMsgEl.innerText = getMsg();
  }, 500);
}

//function that returns the msg to player
function getMsg() {
  if (cpuChoice.wins === playerChoice.name) {
    return "cpu won!";
  } else if (cpuChoice.name === playerChoice.name) {
    return "It's a tie!";
  } else {
    return "player won!";
  }
}

//function that chooses a random cpu move and returns the element of result
function cpuRandom() {
  const randomIndex = getRandomInt(0, gMoves.length);
  const randomMove = gMoves[randomIndex];
  return randomMove;
}

// function that give a random number between min and max (not including max)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//function that removes hover properties from all moves
function removeHover() {
  rock.classList.remove("move-hover");
  paper.classList.remove("move-hover");
  scissors.classList.remove("move-hover");
}

//function that adds hover properties to all moves
function addHover() {
  rock.classList.add("move-hover");
  paper.classList.add("move-hover");
  scissors.classList.add("move-hover");
}
