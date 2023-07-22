var muteImgEL;

function onAppLoad() {
  muteImgEL = document.querySelector(".mute-img");
  if (muteImgEL) {
    muteImgEL.src = getMuteImg();
  }
  if (!localStorage.getItem("isMute")) {
    localStorage.setItem("isMute", false);
  }
}

function getMuteImg() {
  if (JSON.parse(localStorage.getItem("isMute"))) {
    return "../assets/images/mute.svg";
  }
  return "../assets/images/unmute.svg";
}

function moveTo(game) {
  window.location.href = `${game}/${game}.html`;
}

function returnHome() {
  window.location.href = "../index.html";
}

function toggleMute() {
  const isMute = localStorage.getItem("isMute");
  localStorage.setItem("isMute", !JSON.parse(isMute));
  muteImgEL.src = getMuteImg();
}
