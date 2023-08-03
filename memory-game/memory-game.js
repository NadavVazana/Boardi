var gBoard = [];
const gAnimals = ["bunny", "bee", "chicken", "koala", "monkey", "tiger"];
const gAnimalsInfo = {};
var clicksCount = 0;
var winsCount = 0;
var gCount = 0;
var firstChoice;
var isImpossible = false;
const collectedCardsEL = document.querySelector(".collected-cards");
const blackScreenEL = document.querySelector(".black-screen");
const playAgainEL = document.querySelector(".play-again-btn");
const difficultyBtnsEL = document.querySelector(".difficulty-btns");
const gridItemEL = document.querySelectorAll(".grid-item");
const counterEL = document.querySelector(".tries");
const endMsgEL = document.querySelector(".end-game-msg");
var cheat = "";

//cheat that shows the table if writes eden
window.addEventListener("keydown", (ev) => {
  if (ev.key === "r") {
    cheat = "";
    return;
  }
  cheat += ev.key;
  if (cheat === "eden") {
    console.table(gBoard);
  }
});

//function that calls the createImgElements, activated when loading the page
function init() {
  createImgElements();
}

//function that create the img elements and add class to them
function createImgElements() {
  for (let i = 0; i < 6; i++) {
    var imgElement = document.createElement("img");
    imgElement.src = `../assets/images/${gAnimals[i]}.svg`;
    imgElement.classList.add(`${gAnimals[i]}-image`);
    gAnimalsInfo[gAnimals[i]] = { name: gAnimals[i], img: imgElement };
  }
}

// function that assigns cards to divs and removes them from gCards
function buildBoard() {
  var cards = [
    "bee",
    "bunny",
    "chicken",
    "koala",
    "monkey",
    "tiger",
    "bee",
    "bunny",
    "chicken",
    "koala",
    "monkey",
    "tiger",
  ];
  for (let i = 0; i < 4; i++) {
    var row = [];
    for (let j = 0; j < 3; j++) {
      var cardIndex = getRandomInt(0, cards.length);
      row.push(cards[cardIndex]);
      cards.splice(cardIndex, 1);
    }
    gBoard.push(row);
  }
}

buildBoard();

//function that starts the game
function startGame(tries) {
  blackScreenEL.hidden = true;
  gCount = tries;
  counterEL.innerHTML = gCount;
  if (tries === 6) {
    isImpossible = true;
  }
}

//function that resets the game
function resetGame() {
  gBoard = [];
  buildBoard();
  cheat = "";
  collectedCardsEL.innerHTML = "";
  gridItemEL.forEach((gridItemEL) => {
    gridItemEL.innerHTML = "";
  });
  difficultyBtnsEL.hidden = false;
  playAgainEL.hidden = true;
  endMsgEL.hidden = true;
  isImpossible = false;
}

//function that ends the game
function endGame(msg) {
  blackScreenEL.hidden = false;
  playAgainEL.hidden = false;
  winsCount = 0;
  difficultyBtnsEL.hidden = true;
  endMsgEL.innerHTML = msg;
  endMsgEL.hidden = false;
}

// function that adds the card name to the div
function cardClick(divName) {
  if (!Object.values(gAnimalsInfo).length || clicksCount === 2) return;
  var cardEL = document.querySelector(`.${divName}`);
  if (clicksCount === 1 && cardEL.innerHTML) return;
  var pos = JSON.parse(cardEL.dataset.position);
  var cardsAnimal = `${gBoard[pos.x][pos.y]}`;
  var animalImage = gAnimalsInfo[cardsAnimal].img.cloneNode(true);
  cardEL.appendChild(animalImage);
  clicksCount++;
  if (clicksCount === 1) {
    firstChoice = { element: cardEL, image: animalImage };
  }
  if (clicksCount === 2) {
    gCount--;
    counterEL.innerHTML = gCount;
    if (firstChoice.image.src === animalImage.src) {
      if (correctAnswer(animalImage)) return;
    } else {
      wrongAnswer(cardEL, animalImage);
    }
    if (gCount === 0) {
      endGame("You Lost...");
    }
  }
}

//function that resets choices and clickscount
function resetRound() {
  firstChoice = "";
  clicksCount = 0;
}

//function that apply the correct answer and check win
function correctAnswer(animalImage) {
  collectedCardsEL.appendChild(animalImage.cloneNode(true));
  resetRound();
  winsCount++;
  if (winsCount === 6) {
    endGame("You Won!");
    return true;
  }
}

//function that apply the wrong answer and check lost on impossible
function wrongAnswer(cardEL, animalImage) {
  setTimeout(() => {
    if (cardEL.innerHTML && firstChoice.element.innerHTML) {
      cardEL.removeChild(animalImage);
      firstChoice.element.removeChild(firstChoice.image);
    }
    resetRound();
  }, 1500);
  if (isImpossible) {
    endGame("You Lost...");
  }
}

// function that give a random number between max and min
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
