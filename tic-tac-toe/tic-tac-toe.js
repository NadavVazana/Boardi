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
  if (isCpu && player === "o") return;
  var div = document.querySelector(`.${divInfo.name}`);
  if (div.innerHTML) return;
  playTurn(divInfo);
  if (checkCount()) return;
  if (isCpu) {
    cpuPlay();
  }
}

// function that switches player
function switchPlayer() {
  player = player === "x" ? "o" : "x";
}

// function that adds to board and adds the image to the screen
function playTurn(divInfo) {
  var div = document.querySelector(`.${divInfo.name}`);
  div.innerHTML = playersInfo[player].img.outerHTML;
  addToBoard(player, divInfo.position);
  switchPlayer();
}

// function that adds a mark on the board
function addToBoard(mark, position) {
  gBoard[position.x][position.y] = mark;
}

// functions that generates random free positions for cpu
function cpuRandom() {
  console.log("random");
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

// function that checks if there is a mark in a position.
//if you check  for win, it returns true if it's cpu and returns null if it's the enemy
// if you check for blocking place, it returns true if it's enemy and returns null if it's the cpu
// returns false if div is empty
function cpuCheck(i, j, checkMethod) {
  if (gBoard[i][j]) {
    if (checkMethod === "win") {
      if (gBoard[i][j] === player) {
        return true;
      }
      return null;
    } else {
      if (gBoard[i][j] !== player) {
        return true;
      }
      return null;
    }
  }
  return false;
}

// function that checks row & columns for best placment for cpuPrint
//returns true if it found
function plannedCpu() {
  var rows = [];
  var columns = [];
  for (let i = 0; i < gBoard.length; i++) {
    //rows
    if (checkRows(i)) {
      rows.push({ position: i, place: gBoard[i] });
      // console.log("push row:", { position: i, place: gBoard[i] });
    }
    //columns
    if (checkColumns(i)) {
      columns.push({ place: buildColumns(i), position: i });
      // console.log("push columns:", { place: buildColumns(i), position: i });
    }
  }
  // console.log("rows", rows);
  // console.log("columns", columns);

  //if there is a best option in both rows and columns,
  //it checks wich one is best and prints it
  if (getBestOption(rows) && getBestOption(columns)) {
    var rowsAmount = getBestOption(rows).bestOption.amount;
    var columnsAmount = getBestOption(columns).bestOption.amount;
    if (rowsAmount < columnsAmount) {
      // console.log("best column better then row");
      printBestCpu(columns, "columns");
      return true;
    }
    // console.log("best row better then column");
    printBestCpu(rows, "rows");
    return true;
  }

  if (ifBestPrint(rows, "rows")) return true;
  if (ifBestPrint(columns, "columns")) return true;
}

//function that checks if there is a best option and prints if there is
function ifBestPrint(item, itemName) {
  if (getBestOption(item)) {
    printBestCpu(item, itemName);
    return true;
  }
}

//function that prints best option, according to if you send rows or columnns
function printBestCpu(item, itemName) {
  var bestOption = getBestOption(item);
  if (itemName === "rows") {
    console.log("printing best rows");
    printCpu({
      x: bestOption.bestOption.position,
      y: bestOption.indexes[getRandomInt(0, bestOption.indexes.length)],
    });
    return;
  }
  console.log("printing best columns");
  printCpu({
    x: bestOption.indexes[getRandomInt(0, bestOption.indexes.length)],
    y: bestOption.bestOption.position,
  });
}

//function that returns the column of the given i
function buildColumns(i) {
  return gBoard.map((row) => {
    return row[i];
  });
}

//returns an object with the best option in the item+the free indexes if
//there are objects in the item, else returns false
function getBestOption(items) {
  if (items.length) {
    var newItems = getNewItems(items);
    var bestOption = findBestOption(newItems);
    var indexes = [];

    bestOption.place.forEach((place, index) => {
      if (!place) {
        indexes.push(index);
      }
    });
    return { bestOption, indexes };
  }
  return false;
}

//returns array of items with previus value + amount of o's
function getNewItems(items) {
  return items.map((item) => {
    var counter = 0;
    item.place.forEach((innerItem) => {
      if (innerItem === "o") {
        counter++;
      }
    });
    return { ...item, amount: counter };
  });
}

// returns the option with the largest amount
function findBestOption(newItems) {
  var bestOption = newItems[0];
  newItems.forEach((item) => {
    if (bestOption.amount < item.amount) {
      bestOption = item;
    }
  });
  return bestOption;
}

// returns true if there are no x's on the row
function checkRows(i) {
  return !gBoard[i].some((item) => {
    return item === "x";
  });
}

// returns true if there are no x's on the column
function checkColumns(i) {
  return !buildColumns(i).some((item) => {
    return item === "x";
  });
}

//function that prints the cpu on position if the enemycount in row/column/diagonal is 2, and there is a free position
function cpuMark(enemyCount, pos) {
  if (enemyCount === 2 && Object.values(pos).length) {
    printCpu(pos);
    return true;
  }
}

//function that makes the best move for cpu and plays random if there is none
function cpuPlay() {
  if (isCorner() && turnsCount === 1) {
    printCpu({ x: 1, y: 1 });
    return;
  }
  if (cpuStrategic("win")) {
    console.log("strat win");
    return;
  }
  if (cpuStrategic("block")) {
    console.log("strat block");
    return;
  }
  if (plannedCpu()) {
    console.log("planned");
    return;
  }
  cpuRandom();
}

//function that checks if the player marked in one of the corners
function isCorner() {
  if (
    gBoard[0][0] === "x" ||
    gBoard[0][2] === "x" ||
    gBoard[2][0] === "x" ||
    gBoard[2][2] === "x"
  ) {
    return true;
  }
}

//function that marks cpu in a position to block the player or win game
function cpuStrategic(checkMethod) {
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
      if (cpuCheck(i, j, checkMethod)) {
        enemyInRow++;
      } else if (cpuCheck(i, j, checkMethod) !== null) {
        freePosR = { x: i, y: j };
      }
      // checks the colums
      if (cpuCheck(j, i, checkMethod)) {
        enemyInColumn++;
      } else if (cpuCheck(j, i, checkMethod) !== null) {
        freePosC = { x: j, y: i };
      }
      // checks diagonal 1
      if (cpuCheck(j, j, checkMethod)) {
        xInDiagonal1++;
      } else if (cpuCheck(j, j, checkMethod) !== null) {
        freePos1 = { x: j, y: j };
      }
      //   // checks diagonal 2
      if (cpuCheck(j, 2 - j, checkMethod)) {
        xInDiagonal2++;
      } else if (cpuCheck(j, 2 - j, checkMethod) !== null) {
        freePos2 = { x: j, y: 2 - j };
      }
    }
    if (cpuMark(enemyInRow, freePosR)) return true;
    if (cpuMark(enemyInColumn, freePosC)) return true;
    if (cpuMark(xInDiagonal1, freePos1)) return true;
    if (cpuMark(xInDiagonal2, freePos2)) return true;
  }
}

// function that prints the cpu move on the screen and gBoard
function printCpu(position) {
  setTimeout(() => {
    var div = document.querySelector(`.${transPosToDiv(position)}`);
    div.innerHTML = oImg.outerHTML;
    switchPlayer();
    addToBoard("o", position);
    checkCount();
    console.log("printing cpu");
  }, 500);
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
  //checking for winner in diagonals
  if (checkDia("x") || checkDia("o")) return true;

  //checking for winner in rows & columns
  for (let i = 0; i < 3; i++) {
    if (checkRowsCol("x", i) || checkRowsCol("o", i)) return true;
  }
  // checking if the board is full
  if (isBoardFull()) return true;
}

//function that checks if board is full
function isBoardFull() {
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
