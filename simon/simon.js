var gColors = [];
var gSelected = [];
var counter = 0;
var isRestart = true;
var blackScreenEL = document.querySelector(".black-screen");
var transScreenEL = document.querySelector(".trans-screen");
var lostEL = document.querySelector(".lost");
var record;
var scoreEL = document.querySelector(".game-score");
updateScore();

// function that restarts the game if the key R is pressed
window.addEventListener("keydown", (ev) => {
  if (ev.code === "KeyR" && isRestart) {
    startGame();
  }
});

// function that prevents the game from restarting multiple times in a row
function restartInit() {
  isRestart = false;
  setTimeout(() => {
    isRestart = true;
  }, 2000);
}

// function that starts the game and updates the score and record
function startGame() {
  restartInit();
  counter = 0;
  record = localStorage.getItem("record");
  updateScore();
  if (!record) {
    localStorage.setItem("record", 0);
  }
  playSound("start");
  gColors = [];
  gSelected = [];
  var startBtnEL = document.querySelector(".start-btn");
  startBtnEL.hidden = true;
  blackScreenEL.hidden = true;
  lostEL.hidden = true;
  setTimeout(() => {
    chooseColor();
  }, 1500);
}

// function that updates the score according to the counter
function updateScore() {
  scoreEL.innerHTML = `Score: ${counter}`;
}

// function that chooses a random color
function getRandomColor() {
  const colors = ["blue", "red", "yellow", "green"];
  return colors[getRandomInt(0, 4)];
}

// function that gets a random number
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// function pushes the selected color to the gColors array and blinks all the colors in gColors
function chooseColor() {
  var color = getRandomColor();
  gColors.push(color);
  blinkColors();
}

// function that blinks all the colors in gColors
function blinkColors() {
  for (let i = 0; i < gColors.length; i++) {
    blinkColor(gColors[i], i);
  }
}

// function that blinks a given color and lets the player play if all the colors are done blinking
function blinkColor(color, index) {
  setTimeout(() => {
    var colorEL = getColorEL(color);
    colorEL.classList.add("full-opacity");
    playSound(color);
    setTimeout(() => {
      colorEL.classList.remove("full-opacity");
      if (index + 1 === gColors.length) {
        transScreenEL.hidden = true;
      }
    }, 500);
  }, index * 800);
}

// function that gets a color and returns it's element
function getColorEL(color) {
  return document.querySelector(`.${color}`);
}

// function that plays an selected sound unless the sound is muted
function playSound(method) {
  if (JSON.parse(localStorage.getItem("isMute"))) return;
  var audio = new Audio(`../assets/audio/simon/${method}.mp3`);
  audio.play();
}

// function that changes clicked color opacity, pushes it to gSelected.
// if the player already choose all colors it returns
//if player choose wrong it looses the game
function onClickColor(color) {
  if (gSelected.length === gColors.length) {
    return;
  }
  playSound(color);
  var colorEL = getColorEL(color);
  colorEL.classList.add("full-opacity");
  setTimeout(() => {
    colorEL.classList.remove("full-opacity");
  }, 120);
  gSelected.push(color);
  for (let i = 0; i < gSelected.length; i++) {
    if (gSelected[i] !== gColors[i]) {
      lostEL.hidden = false;
      blackScreenEL.hidden = false;
      playSound("lost");
      if (counter > record) {
        localStorage.setItem("record", counter);
      }
      var bestScore = JSON.parse(localStorage.getItem("record"));
      document.querySelector(".record").innerHTML = `Best Score: ${bestScore}`;
      return;
    }
  }
  if (gSelected.length === gColors.length) {
    counter++;
    updateScore();
    transScreenEL.hidden = false;
    setTimeout(() => {
      gSelected = [];
      chooseColor();
    }, 700);
  }
}
