'use strict'

const form = document.querySelector('form')
const button = document.querySelector('button')
const minutes = document.querySelector('.minutes')
const seconds = document.querySelector('.seconds')
const showTime = document.querySelector('.showTime')

let newTimer;


let totalSeconds;
let totalMs;

button.addEventListener('click', function(e) {
    clearInterval(newTimer);
    e.preventDefault();
    totalSeconds = +minutes.value * 60 + +seconds.value;
    totalMs = +minutes.value * 60 * 1000 + +seconds.value * 1000;
    console.log(totalSeconds, totalMs);

    newTimer = setInterval(() => {
        if (totalSeconds === 0) {
            showTime.textContent = `${String(Math.trunc(totalSeconds / 60)).padStart(2,0)}:${String(totalSeconds % 60).padStart(2,0)}`
            clearInterval(newTimer)
        }
        showTime.textContent = `${String(Math.trunc(totalSeconds / 60)).padStart(2,0)}:${String(totalSeconds % 60).padStart(2,0)}`;
        totalSeconds -= 1;
    }, 1000)
})

