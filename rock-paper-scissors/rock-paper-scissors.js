const rock = document.querySelector(".rock");
const paper = document.querySelector(".paper");
const scissors = document.querySelector(".scissors");
const gMoves = [
  { name: "rock", element: rock, wins: "scissors" },
  { name: "paper", element: paper, wins: "rock" },
  { name: "scissors", element: scissors, wins: "paper" },
];
const cpuLoad = ["CPU is choosing.", "CPU is choosing..", "CPU is choosing..."];
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
    cleanEl(playerChoice.element);
  }
}

//function that playes a turn on player's click
function playTurn(move) {
  if (isGameOver) return;
  markChoice(move);
  isGameOver = true;

  playerChoice = getObject(move);
  cpuChoice = cpuRandom();

  cpuLoader(cpuChoice);

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
function cleanEl(element) {
  element.style.backgroundColor = "blueviolet";
}

//function that present the cpu load to user and then shows the result
function cpuLoader(cpuChoice) {
  cpuEl.innerText = "";
  var i = 0;
  var time = 0;
  const intevalId = setInterval(() => {
    if (time != 7) {
      currText = cpuLoad[i];
      cpuEl.innerText = currText;
      if (i === 2) {
        i = 0;
      } else {
        i++;
      }
      time++;
    } else {
      cpuEl.innerText = "";
      showCpuChoice(cpuChoice);
      clearInterval(intevalId);
    }
  }, 1000);
}

//function that presrnts cpuChoice to user and prevents it
function showCpuChoice(cpuChoice) {
  const choiceEl = cpuChoice.element;
  const choiceElClone = choiceEl.cloneNode(true);
  cleanEl(choiceElClone);
  cpuEl.appendChild(choiceElClone);
  showEndScreen();
}

//function that shows end screen
function showEndScreen() {
  setTimeout(() => {
    blackScreenEl.hidden = false;
    endMsgEl.innerText = getMsg();
  }, 1500);
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
