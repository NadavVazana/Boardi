var gColors = [];
var gSelected = [];
var counter = 0;
var isRestart = true;
var blackScreenEL = document.querySelector(".black-screen");
var transScreenEL = document.querySelector(".trans-screen");
var lostEL = document.querySelector(".lost");
var record;
var scoreEL = document.querySelector(".game-info");
updateScore();

window.addEventListener("keydown", (ev) => {
  if (ev.code === "KeyR" && isRestart) {
    startGame();
  }
});

function restartInit() {
  isRestart = false;
  setTimeout(() => {
    isRestart = true;
  }, 2000);
}

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

function updateScore() {
  scoreEL.innerHTML = `Score: ${counter}`;
}

function chooseColor() {
  var color = getRandomColor();
  gColors.push(color);
  blinkColors();
}

function blinkColors() {
  for (let i = 0; i < gColors.length; i++) {
    blinkColor(gColors[i], i);
  }
}

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

function getColorEL(color) {
  return document.querySelector(`.${color}`);
}

function playSound(method) {
  console.log(JSON.parse(localStorage.getItem("isMute")));
  if (JSON.parse(localStorage.getItem("isMute"))) return;
  var audio = new Audio(`../assets/audio/simon/${method}.mp3`);
  audio.play();
}

function onClickColor(color) {
  if (gSelected.length === gColors.length) {
    return;
  }
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
  playSound(color);
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

function getRandomColor() {
  const colors = ["blue", "red", "yellow", "green"];
  return colors[getRandomInt(0, 4)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
