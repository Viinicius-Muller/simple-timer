'use strict'

const form = document.querySelector('form')
const start = document.querySelector('.start')
const alternate = document.querySelector('.alternate')
const minutes = document.querySelector('.minutes')
const seconds = document.querySelector('.seconds')
const showTime = document.querySelector('.showTime')
const pop = new Audio('./pop.mp3')



let newTimer;
let totalSeconds;
let state = false;

start.addEventListener('click', function(e) {
    e.preventDefault();
    //  Check value
    if (isNaN(+minutes.value) || isNaN(+seconds.value)) return;

    //  Pause
    if(state) {
        clearInterval(newTimer);
        seconds.value = String(totalSeconds % 60).padStart(2,0);
        minutes.value = String(Math.trunc(totalSeconds / 60)).padStart(2,0);
        start.textContent = 'Resume'
        state = false;
        return;
    }

    //  Resume / Reset
    clearInterval(newTimer);
    totalSeconds = +minutes.value * 60 + +seconds.value;
    if (totalSeconds <= 0) return;
    start.textContent = 'Pause'
    showTime.textContent = `${String(Math.trunc(totalSeconds / 60)).padStart(2,0)}:${String(totalSeconds % 60).padStart(2,0)}`
    state = true;

    //  Start timer
    newTimer = setInterval(() => {
        totalSeconds -= 1;
        if (totalSeconds === 0) {
            //Reset config
            state = false;
            showTime.textContent = '00:00';
            start.textContent = 'Start';
            pop.play();
            clearInterval(newTimer);
        }
        showTime.textContent = `${String(Math.trunc(totalSeconds / 60)).padStart(2,0)}:${String(totalSeconds % 60).padStart(2,0)}`;
    }, 1000)
})


function stopTimer(e){
    e.preventDefault();
    state = false;
    clearInterval(newTimer);
    start.textContent = 'Start';
    seconds.value = '00'
    minutes.value = '00'
    showTime.textContent = '00:00';
}

alternate.addEventListener('click', stopTimer)