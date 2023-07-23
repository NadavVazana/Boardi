var blackScreenEL = document.querySelector(".black-screen");
var p1Sec = 5;
var p2Sec = 5;
var p1millSec = 0;
var p2millSec = 0;
var p1SecEL = document.querySelector(".p1-sec");
var p2SecEL = document.querySelector(".p2-sec");
var p2MillEL = document.querySelector(".p2-mill");
var p1MillEL = document.querySelector(".p1-mill");
var p1Interval;
var p2Interval;
var isP1Stop = false;
var isP2Stop = false;
var player1 = document.querySelector(".player-1");
var player2 = document.querySelector(".player-2");
var playAgainEL = document.querySelector(".play-again");
var isInfoUp = false;
var infoEL = document.querySelector(".info-card");
var startBtnEL = document.querySelector(".start-btn");

// multiple touch support
player1.addEventListener("touchend", (ev) => {
  stopTimer(1);
});

// multiple touch support
player2.addEventListener("touchend", (ev) => {
  stopTimer(2);
});

// keyboard keys stop the timer (a= player1 l = player 2)
window.addEventListener("keydown", (ev) => {
  if (ev.code === "KeyA") {
    stopTimer(1);
  }
  if (ev.code === "KeyL") {
    stopTimer(2);
  }
});

// function that resets the timers and starts the game
function startGame() {
  p1Sec = 5;
  p2Sec = 5;
  p1millSec = 0;
  p2millSec = 0;
  player1.style.backgroundColor = "transparent";
  player2.style.backgroundColor = "transparent";
  isP1Stop = false;
  isP2Stop = false;
  blackScreenEL.hidden = true;
  startBtnEL.hidden = true;
  startP1Timer();
  startP2Timer();
}

// function that runs the timer of player1 and stops at -5
function startP1Timer() {
  p1Interval = setInterval(() => {
    if (p1millSec === 0) {
      p1millSec = 99;
      p1Sec--;
      if (p1Sec === -5) {
        p1millSec = 0;
        updateTime();
        isP1Stop = true;
        if (isP2Stop) {
          checkWin();
        }
        clearInterval(p1Interval);
        return;
      }
      updateTime();
      return;
    }
    p1millSec--;
    updateTime();
  }, 10);
}

// function that runs the timer of player2 and stops at -5
function startP2Timer() {
  p2Interval = setInterval(() => {
    if (p2millSec === 0) {
      p2millSec = 99;
      p2Sec--;
      if (p2Sec === -5) {
        p2millSec = 0;
        updateTime();
        isP2Stop = true;
        if (isP1Stop) {
          checkWin();
        }
        clearInterval(p2Interval);
        return;
      }
      updateTime();
      return;
    }
    p2millSec--;
    updateTime();
  }, 10);
}

// function that updates the innerHTML of the timers
function updateTime() {
  p1SecEL.innerHTML = `${p1Sec}:`;
  p2SecEL.innerHTML = `${p2Sec}:`;
  p1MillEL.innerHTML = p1millSec < 10 ? `0${p1millSec}` : p1millSec;
  p2MillEL.innerHTML = p2millSec < 10 ? `0${p2millSec}` : p2millSec;
}

// function that stops the timer on given player and checks winner if both players stoped
function stopTimer(playerNum) {
  playerNum === 1 ? clearInterval(p1Interval) : clearInterval(p2Interval);
  if (playerNum === 1) {
    isP1Stop = true;
  } else {
    isP2Stop = true;
  }

  if (isP1Stop && isP2Stop) {
    checkWin();
  }
}

// function that checks who won and presents on screen
function checkWin() {
  if (p1Sec === -5 && p2Sec === -5) {
    player1.style.backgroundColor = "red";
    player2.style.backgroundColor = "red";
    showEndScreen();
    return;
  }
  var winner = "";
  var loser = "";
  p1Sec = Math.abs(p1Sec);
  p2Sec = Math.abs(p2Sec);
  if (p1Sec > p2Sec) {
    winner = "player-2";
    loser = "player-1";
  } else if (p1Sec < p2Sec) {
    winner = "player-1";
    loser = "player-2";
  } else if (p1millSec > p2millSec) {
    winner = "player-2";
    loser = "player-1";
  } else if (p1millSec < p2millSec) {
    winner = "player-1";
    loser = "player-2";
  } else {
    player1.style.backgroundColor = "#ACBCFF";
    player2.style.backgroundColor = "#ACBCFF";
    showEndScreen();
    return;
  }
  showEndScreen();
  document.querySelector(`.${winner}`).style.backgroundColor = "green";
  document.querySelector(`.${loser}`).style.backgroundColor = "red";
}

// function that revealse black screen and play again button
function showEndScreen() {
  blackScreenEL.hidden = false;
  if (startBtnEL.hidden) {
    playAgainEL.hidden = false;
  }
}

// function that stops the game
function stopGame() {
  clearInterval(p1Interval);
  clearInterval(p2Interval);
  showEndScreen();
}

// function that reveals the info card on info-img click
function onInfoClick() {
  if (!isInfoUp) {
    infoEL.hidden = false;
    isInfoUp = true;
    blackScreenEL.style.cursor = "pointer";
    infoEL.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    stopGame();
  } else {
    blackScreenEL.style.cursor = "unset";
    infoEL.hidden = true;
    isInfoUp = false;
  }
}

// function that closes info-card on black screen click
function blackScreenClick() {
  if (!isInfoUp) {
    return;
  }
  blackScreenEL.style.cursor = "unset";
  infoEL.hidden = true;
  isInfoUp = false;
}
