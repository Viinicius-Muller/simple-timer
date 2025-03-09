'use strict'

const regular = document.getElementById('regular');
const timeBased = document.getElementById('timeBased');
const regularTimerDiv = document.querySelector('.timer--regular')
const hourTimerDiv = document.querySelector('.timer--date')

//  Regular Timer
const start = document.querySelector('.start');
const alternate = document.querySelector('.alternate');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const showTime = document.querySelector('.showTime');
const pop = new Audio('./pop.mp3');

//  Date Hour Timer
const timeForm = document.getElementById('time--form');
const timeInput = document.getElementById('time');
const timer2 = document.querySelector('.timer--2');


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
        start.textContent = 'Resume';
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
    clearInterval(newTimer);
    
    state = false;
    start.textContent = 'Start';
    seconds.value = '00'
    minutes.value = '00'
    showTime.textContent = '00:00';
    totalSeconds = 0;
}

alternate.addEventListener('click', stopTimer)

//  timeForm
timeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (+timeInput.value == false) return;
    
    clearInterval(newTimer);
    const newArr = timeInput.value.split(':');
    const [hour,min] = newArr

    totalSeconds = 0;
    totalSeconds = (hour * 60 * 60) + (min * 60);

    const newDate = new Date();
    const dateSeconds = (newDate.getHours() * 60 * 60 + newDate.getMinutes() * 60 + newDate.getSeconds())

    totalSeconds = totalSeconds > dateSeconds ? totalSeconds - dateSeconds : (24 * 60 * 60 - dateSeconds + totalSeconds);

    const str = `${String(Math.trunc(totalSeconds / 60 / 60)).padStart(2,0)}:${String(Math.trunc(totalSeconds / 60 % 60)).padStart(2,0)}:${String(totalSeconds % 60).padStart(2,0)}`
    timer2.textContent = str;

    //  Start timer
    newTimer = setInterval(() => {
        totalSeconds -= 1;
        if (totalSeconds === 0) {
            //Reset config
            state = false;
            timer2.textContent = '00:00';
            pop.play();
            clearInterval(newTimer);
        }
        timer2.textContent = `${String(Math.trunc(totalSeconds / 60 / 60)).padStart(2,0)}:${String(Math.trunc(totalSeconds / 60 % 60)).padStart(2,0)}:${String(totalSeconds % 60).padStart(2,0)}`;
    }, 1000);
})

function resetConfig() {
    clearInterval(newTimer);
    state = false;
    totalSeconds = 0;

    //  Reset first timer
    start.textContent = 'Start';
    seconds.value = '00'
    minutes.value = '00'
    showTime.textContent = '00:00';

    //  Reset second timer
    timer2.textContent = '00:00';
    timeInput.value = '00:00'
}

regular.addEventListener('click', function() {
    resetConfig();
    regularTimerDiv.classList.remove('hidden');
    hourTimerDiv.classList.add('hidden')
})

timeBased.addEventListener('click', function() {
    resetConfig();
    regularTimerDiv.classList.add('hidden');
    hourTimerDiv.classList.remove('hidden')
})


//  background-color: #3AA3A0; | background-color: #FD49A0;