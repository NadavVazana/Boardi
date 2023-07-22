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

// multiple touch support
player1.addEventListener("touchend", (ev) => {
  stopTimer(1);
});

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

function startGame() {
  p1Sec = 5;
  p2Sec = 5;
  p1millSec = 0;
  p2millSec = 0;
  player1.style.backgroundColor = "transparent";
  player2.style.backgroundColor = "transparent";
  isP1Stop = false;
  isP2Stop = false;
  var startBtnEL = document.querySelector(".start-btn");
  blackScreenEL.hidden = true;
  startBtnEL.hidden = true;
  startP1Timer();
  startP2Timer();
}

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

function updateTime() {
  p1SecEL.innerHTML = `${p1Sec}:`;
  p2SecEL.innerHTML = `${p2Sec}:`;
  p1MillEL.innerHTML = p1millSec < 10 ? `0${p1millSec}` : p1millSec;
  p2MillEL.innerHTML = p2millSec < 10 ? `0${p2millSec}` : p2millSec;
}

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

function checkWin() {
  if (p1Sec === -5 && p2Sec === -5) {
    document.querySelector(".player-1").style.backgroundColor = "red";
    document.querySelector(".player-2").style.backgroundColor = "red";
    playAgainEL.hidden = false;
    blackScreenEL.hidden = false;
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
    document.querySelector(".player-1").style.backgroundColor = "#ACBCFF";
    document.querySelector(".player-2").style.backgroundColor = "#ACBCFF";
    playAgainEL.hidden = false;
    blackScreenEL.hidden = false;
    return;
  }
  blackScreenEL.hidden = false;
  playAgainEL.hidden = false;
  document.querySelector(`.${winner}`).style.backgroundColor = "green";
  document.querySelector(`.${loser}`).style.backgroundColor = "red";
}
