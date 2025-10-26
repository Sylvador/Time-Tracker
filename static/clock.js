const INTERVAL = 1000

class Time {
    static deltaTime = 0;
    static lastTickTime = Date.now();

    static setDeltaTime() {
        const tickTime = Date.now();
        Time.deltaTime = tickTime - Time.lastTickTime;
        Time.lastTickTime = tickTime;
    }
}

const lastTimestampKey = 'timeTracker.lastTimestamp'
const timeElapsedKey = 'timeTracker.timeElapsed'
const timeStateKey = 'timeTracker.state'

const clockRef = document.getElementById('clock-time')
const timerBtnRef = document.getElementById('timer-btn')
const timerBtnTextRef = timerBtnRef.childNodes[1]

let timeElapsed = localStorage.getItem(timeElapsedKey)
timeElapsed = timeElapsed ? +timeElapsed : 0
let interval

const started = getTimestate()
if (started) {
    const lastTimestamp = +getItemFromStorage(lastTimestampKey)
    timeElapsed += (Date.now() - lastTimestamp)
    onStart()
} else {
    timerBtnRef.onclick = onStart
}
clockRef.textContent = msToHMS(timeElapsed)

function onStart() {
    Time.lastTickTime = Date.now()
    setTimestate(true)
    interval = setInterval(() => {
        Time.setDeltaTime()
        timeElapsed += Time.deltaTime
        clockRef.textContent = msToHMS(timeElapsed)
        localStorage.setItem(lastTimestampKey, Time.lastTickTime.toString())
        localStorage.setItem(timeElapsedKey, timeElapsed.toString())
    }, INTERVAL)

    timerBtnRef.onclick = onStop
    timerBtnTextRef.textContent = 'Stop'
}

function onStop() {
    setTimestate(false)
    clearInterval(interval)
    timerBtnRef.onclick = onStart
    timerBtnTextRef.textContent = 'Start'
}

function onReset() {
    timeElapsed = 0
    localStorage.setItem(timeElapsedKey, 0)
    clockRef.textContent = msToHMS(0)
    onStop()
}

function msToHMS(milliseconds) {
    // Calculate hours
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));

    // Calculate remaining milliseconds after extracting hours
    const remainingMsAfterHours = milliseconds % (1000 * 60 * 60);

    // Calculate minutes
    const minutes = Math.floor(remainingMsAfterHours / (1000 * 60));

    // Calculate remaining milliseconds after extracting minutes
    const remainingMsAfterMinutes = remainingMsAfterHours % (1000 * 60);

    // Calculate seconds
    const seconds = Math.floor(remainingMsAfterMinutes / 1000);

    // Pad single-digit values with a leading zero for formatting
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

/**
 * @param {boolean} state 
 */
function setTimestate(state) {
    localStorage.setItem(timeStateKey, state ? 'true' : 'false')
}

function getTimestate() {
    const value = localStorage.getItem(timeStateKey)
    if (!value) return false
    return JSON.parse(value)
}

/**
 * @param {string} key
 */
function getItemFromStorage(key) {
    const item = localStorage.getItem(key)
    if (item) {
        return JSON.parse(item)
    }
}