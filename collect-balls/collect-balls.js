var gBoard = []; //[[],[],[],[],[]]
var bugPos; //{i:number,j:number}
var rowLength = 7; //number
const timerEl = document.querySelector(".time-count");
const gameEl = document.querySelector(".collect-balls-container");
const mainBugEl = document.querySelector(".main-bug-img");
const blackScreenEl = document.querySelector(".black-screen");
const startBtnEl = document.querySelector(".start-btn");
const scoreEl = document.querySelector(".score");
const time = "15:00";
var isPressed = false;
var isOver = false;
const BEST_SCORE_KEY = "collectBallsBestScore";
window.addEventListener("keydown", (ev) => {
  if (isOver) return;
  if (!isPressed) {
    const key = ev.key;
    switch (key) {
      case "ArrowUp":
      case "w":
        movePlayer("up");
        break;

      case "ArrowDown":
      case "s":
        movePlayer("down");
        break;

      case "ArrowRight":
      case "d":
        movePlayer("right");
        break;

      case "ArrowLeft":
      case "a":
        movePlayer("left");
        break;
    }
    isPressed = true;
  }
});
window.addEventListener("keyup", () => {
  isPressed = false;
});

//function that starts the game
function startGame() {
  updateScore(true);
  isOver = false;
  cleanBoard();
  blackScreenEl.hidden = true;
  startBtnEl.hidden = true;
  timerEl.innerText = time;

  renderPlayer();
  var counter = 0;
  const id = setInterval(() => {
    createEnemy();
    counter++;
    if (counter === rowLength) {
      clearInterval(id);
    }
  }, 1000);
  startTimer();
}

//function that cleans the board
function cleanBoard() {
  const children = gameEl.children;

  for (let i = 0; i < children.length; i++) {
    if (children[i].innerHTML) {
      children[i].removeChild(children[i].children[0]);
    }
  }
  const mainBugPlace = Math.ceil(rowLength / 2 - 1);
  bugPos = { i: mainBugPlace, j: mainBugPlace };
}

//function that renders the board
function renderBoard() {
  timerEl.innerText = time;
  const containerEl = document.querySelector(".collect-balls-container");
  containerEl.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`;
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < rowLength; j++) {
      gameEl.innerHTML += `<div data-cell={"i":${i},"j":${j}} class="square"></div>`;
    }
  }
}

//function that build gBoard
function buildGborad() {
  const mainBugPlace = Math.ceil(rowLength / 2 - 1);

  for (let i = 0; i < rowLength; i++) {
    var row = [];

    for (let j = 0; j < rowLength; j++) {
      row.push({ position: { i, j }, content: "" });
    }
    gBoard.push(row);
  }
  gBoard[mainBugPlace][mainBugPlace].content = "main bug";
  bugPos = { i: mainBugPlace, j: mainBugPlace };

  renderBoard();
}

//function that starts the timer
function startTimer() {
  var currTime = parseInt(timerEl.innerText);
  const timerId = setInterval(() => {
    currTime = (currTime - 0.01).toFixed(2);
    timerEl.innerText = currTime;
    if (Math.ceil(currTime) === 5) {
      timerEl.style.color = "red";
    }
    if (Math.ceil(currTime) === 0) {
      endGame();
      clearInterval(timerId);
    }
  }, 10);
}

//function that ends the game
function endGame() {
  updateBestScore();
  isOver = true;
  const playAgainBtnEl = document.querySelector(".play-again-btn");
  const endMsgEl = document.querySelector(".end-msg");
  blackScreenEl.hidden = false;
  playAgainBtnEl.hidden = false;
  endMsgEl.hidden = false;
}

//function that moves the player accourding to arrows
function movePlayer(direction) {
  switch (direction) {
    case "up":
      if (bugPos.i - 1 >= 0) {
        eatEnemy({ i: bugPos.i - 1, j: bugPos.j });
        updatePos({ i: bugPos.i - 1, j: bugPos.j });
      }
      break;

    case "down":
      if (bugPos.i + 1 < rowLength) {
        eatEnemy({ i: bugPos.i + 1, j: bugPos.j });
        updatePos({ i: bugPos.i + 1, j: bugPos.j });
      }
      break;

    case "right":
      if (bugPos.j + 1 < rowLength) {
        eatEnemy({ i: bugPos.i, j: bugPos.j + 1 });
        updatePos({ i: bugPos.i, j: bugPos.j + 1 });
      }
      break;

    case "left":
      if (bugPos.j - 1 >= 0) {
        eatEnemy({ i: bugPos.i, j: bugPos.j - 1 });
        updatePos({ i: bugPos.i, j: bugPos.j - 1 });
      }
      break;
  }
}

//function that updates the player on screen
function updatePos(position) {
  renderPlayer(bugPos);
  const newPos = { i: position.i, j: position.j };
  gBoard[bugPos.i][bugPos.j].content = "";
  gBoard[newPos.i][newPos.j].content = "main bug";
  bugPos = newPos;
  renderPlayer();
}

//function that renders the player in the new pos
function renderPlayer(position) {
  const children = gameEl.children;

  var imgElement = document.createElement("img");
  imgElement.src = "../assets/images/main-bug.svg";

  for (let i = 0; i < children.length; i++) {
    const currPosition = JSON.parse(children[i].dataset.cell);

    if (position) {
      if (position.i === currPosition.i && position.j === currPosition.j) {
        children[i].removeChild(children[i].children[0]);
      }
      continue;
    }

    if (currPosition.i === bugPos.i && currPosition.j === bugPos.j) {
      children[i].appendChild(imgElement);
    }
  }
}

//function that creates enemy in a random pos and renders it
function createEnemy() {
  var enemyI = getRandomInt(0, rowLength);
  var enemyJ = getRandomInt(0, rowLength);

  while (
    gBoard[enemyI][enemyJ].content === "main bug" ||
    gBoard[enemyI][enemyJ].content === "enemy"
  ) {
    enemyI = getRandomInt(0, rowLength);
    enemyJ = getRandomInt(0, rowLength);
  }

  gBoard[enemyI][enemyJ].content = "enemy";
  renderEnemy({ i: enemyI, j: enemyJ });
}

//function that renders the enemy on screen
function renderEnemy(position) {
  const children = gameEl.children;

  var imgElement = document.createElement("img");
  imgElement.src = "../assets/images/small-bug.svg";

  for (let i = 0; i < children.length; i++) {
    const currPosition = JSON.parse(children[i].dataset.cell);

    if (currPosition.i === position.i && currPosition.j === position.j) {
      children[i].appendChild(imgElement);
    }
  }
}

//function that eats enemy
function eatEnemy(position) {
  const children = gameEl.children;

  for (let i = 0; i < children.length; i++) {
    const currPosition = JSON.parse(children[i].dataset.cell);

    if (
      position.i === currPosition.i &&
      position.j === currPosition.j &&
      children[i].innerHTML
    ) {
      children[i].removeChild(children[i].children[0]);
      updateScore();
      setTimeout(() => {
        createEnemy();
      }, 1500);
      return;
    }
  }
}

//function that updates the score
function updateScore(isReset) {
  if (isReset) {
    scoreEl.innerText = 0;
    return;
  }
  scoreEl.innerText = +scoreEl.innerText + 1;
}

//function that checks best score, and updates it to the div
function updateBestScore() {
  const bestScoreEl = document.querySelector(".best-score");
  const bestScore = getLocalStorage(BEST_SCORE_KEY);
  const currScore = +scoreEl.innerText;
  if (bestScore) {
    if (currScore > bestScore) {
      insertLocalStorage(BEST_SCORE_KEY, currScore);
    }
  } else {
    insertLocalStorage(BEST_SCORE_KEY, currScore);
  }

  bestScoreEl.innerText = getLocalStorage(BEST_SCORE_KEY);
}

// function that give a random number between min and max (not including max)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//function that inserts to local storage
function insertLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

//function that gets item from local storage
function getLocalStorage(key) {
  return localStorage.getItem(key);
}
