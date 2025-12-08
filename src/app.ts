// @ts-nocheck

import { Time } from './utils';

const INTERVAL = 1000;

const lastTimestampKey = 'timeTracker.lastTimestamp';
const timeElapsedKey = 'timeTracker.timeElapsed';
const timeStateKey = 'timeTracker.state';

const clockRef = document.getElementById('clock-time');

const editInputRef = document.getElementById('edit-input');
const editBtnRef = document.getElementById('edit-btn');

const timerBtnRef = document.getElementById('timer-btn');
const timerBtnTextRef = timerBtnRef.childNodes[1];

let timeElapsed = localStorage.getItem(timeElapsedKey);
timeElapsed = timeElapsed ? +timeElapsed : 0;
let interval;

const started = getTimestate();
if (started) {
    const lastTimestamp = +getItemFromStorage(lastTimestampKey);
    timeElapsed += Date.now() - lastTimestamp;
    onStart();
} else {
    timerBtnRef.onclick = onStart;
}
clockRef.textContent = msToHMS(timeElapsed);

function onStart() {
    Time.lastTickTime = Date.now();
    setTimestate(true);
    interval = setInterval(() => {
        Time.setDeltaTime();
        timeElapsed += Time.deltaTime;
        updateTime(timeElapsed);
    }, INTERVAL);

    timerBtnRef.onclick = onStop;
    timerBtnTextRef.textContent = 'Stop';
}

function updateTime(newTimeElapsed) {
    clockRef.textContent = msToHMS(newTimeElapsed);
    localStorage.setItem(lastTimestampKey, Time.lastTickTime.toString());
    localStorage.setItem(timeElapsedKey, newTimeElapsed.toString());
    timeElapsed = newTimeElapsed;
}

function onStop() {
    setTimestate(false);
    clearInterval(interval);
    timerBtnRef.onclick = onStart;
    timerBtnTextRef.textContent = 'Start';
}

function onReset() {
    timeElapsed = 0;
    localStorage.setItem(timeElapsedKey, 0);
    clockRef.textContent = msToHMS(0);
    onStop();
}

function onEdit() {
    const state = editInputRef.getAttribute('state');
    if (state === 'inactive') {
        if (getTimestate()) {
            onStop();
        }
        clockRef.setAttribute('state', 'inactive');
        editInputRef.value = clockRef.textContent;
        editInputRef.setAttribute('state', 'active');
        editBtnRef.childNodes[1].textContent = 'Save';
    } else {
        editInputRef.setAttribute('state', 'inactive');
        clockRef.setAttribute('state', 'active');
        const time = hmsToMM(editInputRef.value);
        updateTime(time);
        editBtnRef.childNodes[1].textContent = 'Edit';
    }
}

/**
 * @param {number} milliseconds
 */
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
 * @param {string} timeStr
 */
function hmsToMM(timeStr) {
    const [hoursStr, minsStr, secsStr] = timeStr.split(':');

    const hours = parseInt(hoursStr);
    const mins = parseInt(minsStr);
    const secs = parseInt(secsStr);

    const time = hours * 60 * 60 * 1000 + mins * 60 * 1000 + secs * 1000;

    return time;
}

/**
 * @param {boolean} state
 */
function setTimestate(state) {
    localStorage.setItem(timeStateKey, state ? 'true' : 'false');
}

function getTimestate() {
    const value = localStorage.getItem(timeStateKey);
    if (!value) return false;
    return JSON.parse(value);
}

/**
 * @param {string} key
 */
function getItemFromStorage(key) {
    const item = localStorage.getItem(key);
    if (item) {
        return JSON.parse(item);
    }
}
