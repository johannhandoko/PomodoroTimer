const pomodoroTimer = document.querySelector('#pomodoro-timer')

const startButton = document.querySelector('#pomodoro-start')
const pauseButton = document.querySelector('#pomodoro-pause')
const stopButton = document.querySelector('#pomodoro-stop')

//additional variables throughout
let type = 'Work'
let timeSpentInCurrentSession = 0
let currentTaskLabel = document.querySelector('#pomodoro-clock-task')
let isCLockStopped = true

// updated variables
let updatedWorkSessionDuration
let updatedBreakSessionDuration

let workDurationInput = document.querySelector('#input-work-duration')
let breakDurationInput = document.querySelector('#input-break-duration')

workDurationInput.value = '25'
breakDurationInput.value = '5'

//Event listeners
    // START BUTTON
startButton.addEventListener('click', () => {
    toggleClock()
})

    // PAUSE BUTTON
pauseButton.addEventListener('click', () =>{
    toggleClock()
})

    // STOP BUTTON
stopButton.addEventListener('click', () => {
    toggleClock(true)
})

    //UPDATE WORK TIME
workDurationInput.addEventListener('input', () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
})

    //UPDATE PAUSE TIME
breakDurationInput.addEventListener('input', () => {
    updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value)
})

const minuteToSeconds = (mins) => {
    return mins * 60
}

let isClockRunning = false
// seconds = 25 min
let workSessionDuration = 1500
let currentTimeLeftInSession = 1500

// in seconds = 5min;
let breakSessionDuration = 300

//toggle function
const toggleClock = (reset) => {
  if (reset) {
    stopClock()
  } else {
    // new
    if (isClockStopped) {
      setUpdatedTimers()
      isClockStopped = false
    }
    if (isClockRunning === true) {
      // pause
      clearInterval(clockTimer)
      // update icon to the play one
      // set the value of the button to start or pause
      isClockRunning = false
    } else {
      // start
      clockTimer = setInterval(() => {
        stepDown()
        displayCurrentTimeLeftInSession()
      }, 1000)
      isClockRunning = true
    }
  }
}

// Stepdown function
const stepDown = () => {
  if (currentTimeLeftInSession > 0) {
    // decrease time left / increase time spent
    currentTimeLeftInSession--
    timeSpentInCurrentSession++
  } else if (currentTimeLeftInSession === 0) {
  timeSpentInCurrentSession = 0;
  // Timer is over -> if work switch to break, viceversa
  if (type === 'Work') {
    currentTimeLeftInSession = breakSessionDuration;
    displaySessionLog('Work');
    type = 'Break';
    setUpdatedTimers();
    // new
    currentTaskLabel.value = 'Break';
    currentTaskLabel.disabled = true;
  } else {
    currentTimeLeftInSession = workSessionDuration;
    type = 'Work';
    setUpdatedTimers();
    // new
    if (currentTaskLabel.value === 'Break') {
      currentTaskLabel.value = workSessionLabel;
    }
    currentTaskLabel.disabled = false;
    displaySessionLog('Break');
  }
}

// function stopClock()
const stopClock = () => {
    // updated to display a log when user stops timer
    displaySessionLog(type)
    clearInterval(clockTimer)
    isClockRunning = false
    currentTimeLeftInSession = workSessionDuration
    displayCurrentTimeLeftInSession()
    // new
    type = 'Work'
  }

  // displayCurrentTimeLeftInSession function
const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession
    let result = ''
    const seconds = secondsLeft % 60
    const minutes = parseInt(secondsLeft / 60) % 60
    let hours = parseInt(secondsLeft / 3600)
    // add leading zeroes if it's less than 10
    function addLeadingZeroes(time) {
        return time < 10 ? `0${time}` : time
    }
    if (hours > 0) result += `${hours}:`
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
    pomodoroTimer.innerText = result.toString()
}

clockTimer = setInterval(() => {
    stepDown()
    displayCurrentTimeLeftInSession()
}, 1000)

// displaySessionLog function
const displaySessionLog = (type) => {
    const sessionList = document.querySelector('#pomodoro-sessions')
    //append li to it
    const li = document.createElement('li')
    if (type === 'Work') {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work'
        workSessionLabel = sessionLabel
    } else {
        sessionLabel = 'Break'
    }
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`)
    li.appendChild(text)
    sessionsList.appendChild(li)
}

// setUpdatedTimers function
const setUpdatedTimers = () => {
  if (type === 'Work') {
    currentTimeLeftInSession = updatedWorkSessionDuration
      ? updatedWorkSessionDuration
      : workSessionDuration
    workSessionDuration = currentTimeLeftInSession
  } else {
    currentTimeLeftInSession = updatedBreakSessionDuration
      ? updatedBreakSessionDuration
      : breakSessionDuration
    breakSessionDuration = currentTimeLeftInSession
  }
}

const stopClock = () => {
  setUpdatedTimers()
  displaySessionLog(type)
  clearInterval(clockTimer)
  isClockStopped = true
  isClockRunning = false
  currentTimeLeftInSession = workSessionDuration
  displayCurrentTimeLeftInSession()
  type = 'Work'
  timeSpentInCurrentSession = 0
}

// clear the timer when play button is pressed
clearInterval(clockTimer)
