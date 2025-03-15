"use strict";

//  Base DOM Elements
const regular = document.getElementById("regular");
const timeBased = document.getElementById("timeBased");
const regularTimerDiv = document.querySelector(".timer--regular");
const hourTimerDiv = document.querySelector(".timer--date");

//  Regular Timer
const start = document.querySelector(".start");
const stopB = document.querySelector(".stop");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
const showTime = document.querySelector(".showTime");

//  Date Hour Timer
const timeForm = document.getElementById("time--form");
const timeInput = document.getElementById("time");
const timer2 = document.querySelector(".timer--2");
const submitButton = document.querySelector(".submit-btton");

//  Initial Values
let newTimer;
let totalSeconds;
let state = false;

//  Sound Values
let volume = 1;
let sfx = new Audio(`./sounds/clockbeepsfx.mp3`);
sfx.volume = volume;

let mute = false;

class App {
  constructor() {
    regular.addEventListener("click", this._swapToRegular.bind(this));
    timeBased.addEventListener("click", this._swapToDate.bind(this));
  }

  // Both timers reset
  _resetConfig() {
    clearInterval(newTimer);
    state = false;
    totalSeconds = 0;

    //  Reset first timer
    start.textContent = "Start";
    seconds.value = "00";
    minutes.value = "00";
    showTime.textContent = "00:00";

    //  Reset second timer
    submitButton.value = "Start";
    submitButton.style.background = "#3AA3A0";
    timer2.textContent = "00:00";
    timeInput.value = "00:00";
  }

  _swapToRegular() {
    this._resetConfig();
    regularTimerDiv.classList.remove("hidden");
    hourTimerDiv.classList.add("hidden");
  }

  _swapToDate() {
    this._resetConfig();
    regularTimerDiv.classList.add("hidden");
    hourTimerDiv.classList.remove("hidden");
  }
}

class RegularTimer extends App {
  constructor() {
    super();
    start.addEventListener("click", this._startTimer.bind(this));
    stopB.addEventListener("click", this._resetConfig);
  }

  _startTimer() {
    //  Check value
    if (isNaN(+minutes.value) || isNaN(+seconds.value)) return;

    //  Pause
    if (state) {
      clearInterval(newTimer);
      seconds.value = String(totalSeconds % 60).padStart(2, 0);
      minutes.value = String(Math.trunc(totalSeconds / 60)).padStart(2, 0);
      start.textContent = "Resume";
      state = false;
      return;
    }

    //  Resume / Reset
    clearInterval(newTimer);

    totalSeconds = +minutes.value * 60 + +seconds.value;
    if (totalSeconds <= 0) return;

    start.textContent = "Pause";
    showTime.textContent = `${String(Math.trunc(totalSeconds / 60)).padStart(
      2,
      0
    )}:${String(totalSeconds % 60).padStart(2, 0)}`;
    state = true;

    //  Start timer
    newTimer = setInterval(() => {
      totalSeconds -= 1;
      if (totalSeconds === 0) {
        //  Reset config
        this._resetConfig();
        if (!mute) sfx.play();
      }
      showTime.textContent = `${String(Math.trunc(totalSeconds / 60)).padStart(
        2,
        0
      )}:${String(totalSeconds % 60).padStart(2, 0)}`;
    }, 1000);
  }
}

class DateTimer extends App {
  constructor() {
    super();
    timeForm.addEventListener("submit", this._startTimer.bind(this));
  }

  _startTimer(e) {
    e.preventDefault();

    if (+timeInput.value == false) return;
    if (state === true) {
      this._resetConfig();
      return;
    }

    state = true;
    submitButton.value = "Stop";
    submitButton.style.background = "#FD49A0";

    clearInterval(newTimer);
    const [hour, min] = timeInput.value.split(":");

    totalSeconds = hour * 60 * 60 + min * 60;

    const newDate = new Date();
    const dateSeconds =
      newDate.getHours() * 60 * 60 +
      newDate.getMinutes() * 60 +
      newDate.getSeconds();

    // Check if date is today or tomorrow
    totalSeconds =
      totalSeconds > dateSeconds
        ? totalSeconds - dateSeconds
        : 24 * 60 * 60 - dateSeconds + totalSeconds;

    const str = `${String(Math.trunc(totalSeconds / 60 / 60)).padStart(
      2,
      0
    )}:${String(Math.trunc((totalSeconds / 60) % 60)).padStart(2, 0)}:${String(
      totalSeconds % 60
    ).padStart(2, 0)}`;
    timer2.textContent = str;

    //  Start timer
    newTimer = setInterval(() => {
      totalSeconds -= 1;
      if (totalSeconds === 0) {
        //Reset config
        this._resetConfig();
        if (!mute) sfx.play();
      }
      timer2.textContent = `${String(
        Math.trunc(totalSeconds / 60 / 60)
      ).padStart(2, 0)}:${String(Math.trunc((totalSeconds / 60) % 60)).padStart(
        2,
        0
      )}:${String(totalSeconds % 60).padStart(2, 0)}`;
    }, 1000);
  }
}

const app = new App();
const regularTimer = new RegularTimer();
const dateTimer = new DateTimer();

// Settings
const changeSoundButton = document.querySelector(".change-sound");
const volumeSlider = document.getElementById("volume");
const sound_list = document.querySelector(".sounds-list");
const muteButton = document.getElementById("mute");

const soundsElements = document.querySelectorAll(".sounds-bg");

changeSoundButton.addEventListener("click", function () {
  sound_list.classList.toggle("hidden");
});

function muteAlert() {
  mute = !mute;
}

function adjustVolume() {
  //Sets volume values
  const value = +volumeSlider.value;
  volume = value / 100;
  sfx.volume = volume;
}

function setNewSfx(e) {
  let obj;
  if (!e.target.id) {
    obj = e.target.parentElement;
  } else obj = e.target;
  sfx = new Audio(`./sounds/${obj.id}.mp3`);
  sfx.volume = volume;

  if (document.querySelector(".active-sfx"))
    document.querySelector(".active-sfx").classList.remove("active-sfx");
  obj.classList.add("active-sfx");
}

soundsElements.forEach((el) => {
  el.addEventListener("click", setNewSfx);
});

volumeSlider.addEventListener("change", adjustVolume);

muteButton.addEventListener("input", muteAlert);
