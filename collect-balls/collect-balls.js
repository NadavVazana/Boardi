var gBoard = []; //[[],[],[],[],[]]
var bugPos; //{i:number,j:number}
var rowLength = 5; //number
const gameEl = document.querySelector(".collect-balls-container");
var isPressed = false;
const mainBugEl = document.querySelector(".main-bug-img");
window.addEventListener("keydown", (ev) => {
  if (!isPressed) {
    const key = ev.key;
    switch (key) {
      case "ArrowUp":
        movePlayer("up");
        break;

      case "ArrowDown":
        movePlayer("down");
        break;

      case "ArrowRight":
        movePlayer("right");
        break;

      case "ArrowLeft":
        movePlayer("left");
        break;
    }
    isPressed = true;
  }
});
window.addEventListener("keyup", () => {
  isPressed = false;
});

//function that renders the board
function renderBoard() {
  const containerEl = document.querySelector(".collect-balls-container");
  containerEl.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`;
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < rowLength; j++) {
      gameEl.innerHTML += `<div data-cell={"i":${i},"j":${j}} class="square"></div>`;
    }
  }
  //   console.log(JSON.parse(document.querySelector("[data-cell]").dataset.cell));
  renderPlayer();
  for (let i = 0; i < rowLength; i++) {
    createEnemy();
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

  console.table(gBoard);
  renderBoard();
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
  console.table(gBoard);
}

//function that updates the player on screen
function updatePos(position) {
  renderPlayer(bugPos);
  const newPos = { i: position.i, j: position.j };
  gBoard[bugPos.i][bugPos.j].content = "";
  gBoard[newPos.i][newPos.j].content = "main bug";
  bugPos = newPos;
  renderPlayer();
  console.table(gBoard);
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
      console.log(children[i]);
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
function updateScore() {
  const scoreEl = document.querySelector(".score");
  scoreEl.innerText = +scoreEl.innerText + 1;
}

// function that give a random number between min and max (not including max)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
