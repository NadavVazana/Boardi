var blackScreenEL = document.querySelector(".black-screen");
var chooseButtonsEL = document.querySelector(".choose-Buttons");
var winnerPEL = document.querySelector(".winnerP");
var playAgainPEL = document.querySelector(".play-again");
const xImg = document.createElement("img");
const oImg = document.createElement("img");
oImg.src = "../assets/images/o.svg";
xImg.src = "../assets/images/x.svg";
xImg.classList.add("x-image");
oImg.classList.add("o-image");
const playersInfo = {
  x: { img: xImg, sign: "x" },
  o: { img: oImg, sign: "o" },
};
let player = "x";
let isCpu = false;
let gBoard;
var turnsCount = 0;

// function that builds board
function buildBoard() {
  var board = [];
  for (let i = 0; i < 3; i++) {
    board.push([null, null, null]);
  }
  return board;
}

// function that switches from cpu to 2 players
function switchMethod(isPlayer) {
  isCpu = !isPlayer;
}

// function that cleans the visual board
function cleanBoard() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      var div = document.querySelector(`.${transPosToDiv({ x: i, y: j })}`);
      div.innerHTML = "";
    }
  }
}

// function that revealse the choose buttons
function showChooseBtns() {
  playAgainPEL.hidden = true;
  winnerPEL.hidden = true;
  chooseButtonsEL.hidden = false;
}

// function that starts the game
function startGame() {
  gBoard = buildBoard();
  blackScreenEL.hidden = true;
  chooseButtonsEL.hidden = true;
  turnsCount = 0;
}

// function that ends the game
function endGame() {
  player = "x";
  blackScreenEL.hidden = false;
  playAgainPEL.hidden = false;
  winnerPEL.hidden = false;
}

// function that checks if someone won after 5 turns
function checkCount() {
  if (turnsCount <= 3) {
    turnsCount++;
  } else {
    if (checkGameOver()) {
      endGame();
      return true;
    }
  }
}

// function that marks the div the user clicks and plays the cpu if needed
function mark(divInfo) {
  var div = document.querySelector(`.${divInfo.name}`);
  if (div.innerHTML) return;
  playTurn(divInfo);
  if (checkCount()) return;
  if (isCpu) {
    cpuPlay();
    checkCount();
  }
}

// function that adds to board and adds the image to the screen
function playTurn(divInfo) {
  var div = document.querySelector(`.${divInfo.name}`);
  div.innerHTML = playersInfo[player].img.outerHTML;
  addToBoard(player, divInfo.position);

  player = player === "x" ? "o" : "x";
}

// function that adds a mark on the board
function addToBoard(mark, position) {
  gBoard[position.x][position.y] = mark;
}

// functions that generates random free positions for cpu
function cpuRandom() {
  var options = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!gBoard[i][j]) {
        options.push({ x: i, y: j });
      }
    }
  }
  var chosenPosition = options[getRandomInt(0, options.length - 1)];
  printCpu(chosenPosition);
}

function cpuCheck(i, j) {
  if (gBoard[i][j]) {
    if (gBoard[i][j] !== player) {
      return true;
    }
    return null;
  } else {
    return false;
  }
}

function cpuMark(enemyCount, pos) {
  if (enemyCount === 2 && Object.values(pos).length) {
    printCpu(pos);
    return true;
  }
}

//function that makes the best move for cpu and plays random if there is none
function cpuPlay() {
  for (let i = 0; i < 3; i++) {
    var enemyInRow = 0;
    var freePosR = {};
    var enemyInColumn = 0;
    var freePosC = {};
    var xInDiagonal1 = 0;
    var freePos1 = {};
    var xInDiagonal2 = 0;
    var freePos2 = {};

    for (let j = 0; j < 3; j++) {
      // checks the rows
      if (cpuCheck(i, j)) {
        enemyInRow++;
      } else if (cpuCheck(i, j) !== null) {
        freePosR = { x: i, y: j };
      }
      // checks the colums
      if (cpuCheck(j, i)) {
        enemyInColumn++;
      } else if (cpuCheck(j, i) !== null) {
        freePosC = { x: j, y: i };
      }
      // checks diagonal 1
      if (cpuCheck(j, j)) {
        xInDiagonal1++;
      } else if (cpuCheck(j, j) !== null) {
        freePos1 = { x: j, y: j };
      }
      //   // checks diagonal 2
      if (cpuCheck(j, 2 - j)) {
        xInDiagonal2++;
      } else if (cpuCheck(j, 2 - j) !== null) {
        freePos2 = { x: j, y: 2 - j };
      }
    }

    if (enemyInRow === 2 && Object.values(freePosR).length) {
      console.log(freePosR);
      printCpu(freePosR);
      return;
    }
    if (enemyInColumn === 2 && Object.values(freePosC).length) {
      console.log(freePosC);
      printCpu(freePosC);
      return;
    }
    if (xInDiagonal1 === 2 && Object.values(freePos1).length) {
      console.log(freePos1);
      printCpu(freePos1);
      return;
    }

    if (xInDiagonal2 === 2 && Object.values(freePos2).length) {
      console.log(freePos2);
      printCpu(freePos2);
      return;
    }
    // if (cpuMark(enemyInRow, freePosR)) return;
    // cpuMark(enemyInColumn, freePosC);
  }
  console.log("random");
  cpuRandom();
}

// function that prints the cpu move on the screen and gBoard
function printCpu(position) {
  var div = document.querySelector(`.${transPosToDiv(position)}`);
  div.innerHTML = oImg.outerHTML;
  player = player === "x" ? "o" : "x";
  addToBoard("o", position);
}

// function that checks if player won in diagonals
function checkDia(mark) {
  if (
    (gBoard[0][0] === mark && gBoard[1][1] === mark && gBoard[2][2] === mark) ||
    (gBoard[0][2] === mark && gBoard[1][1] === mark && gBoard[2][0] === mark)
  ) {
    winnerPEL.innerHTML = `${mark} won!`;
    return true;
  }
}

// function that checks if player won in rows & columns
function checkRowsCol(mark, i) {
  if (
    (gBoard[i][0] === mark && gBoard[i][1] === mark && gBoard[i][2] === mark) ||
    (gBoard[0][i] === mark && gBoard[1][i] === mark && gBoard[2][i] === mark)
  ) {
    winnerPEL.innerHTML = `${mark} won!`;
    return true;
  }
}

// function that checks if someone won
function checkGameOver() {
  console.log("checking");
  //checking for winner in diagonals

  if (checkDia("x")) {
    return true;
  }
  if (checkDia("o")) {
    return true;
  }

  //checking for winner in rows & columns
  for (let i = 0; i < 3; i++) {
    if (checkRowsCol("x", i)) {
      return true;
    }
    if (checkRowsCol("o", i)) {
      return true;
    }
  }
  // checking if the board is full
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!gBoard[i][j]) return;
    }
  }

  winnerPEL.innerHTML = "Game Over";
  return true;
}

// function that translates from gBoard position to divName
function transPosToDiv(position) {
  if (position.x === 0 && position.y === 0) {
    return "square1";
  }
  if (position.x === 0 && position.y === 1) {
    return "square2";
  }
  if (position.x === 0 && position.y === 2) {
    return "square3";
  }
  if (position.x === 1 && position.y === 0) {
    return "square4";
  }
  if (position.x === 1 && position.y === 1) {
    return "square5";
  }
  if (position.x === 1 && position.y === 2) {
    return "square6";
  }
  if (position.x === 2 && position.y === 0) {
    return "square7";
  }
  if (position.x === 2 && position.y === 1) {
    return "square8";
  }
  return "square9";
}

// function that give a random number between max and min
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
