var timers = [];
var alertSound = new Audio("https://pixabay.com/sound-effects/alarm-clock-short-6402/"); // Replace 'alert.mp3' with your alert sound file
alertSound.preload = 'auto';

function setTimer() {
  var hours = document.getElementById('hours').value || 0;
  var minutes = document.getElementById('minutes').value || 0;
  var seconds = document.getElementById('seconds').value || 0;

  var totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

  if (totalSeconds <= 0) {
    alert("Please enter a valid duration for the timer.");
    return;
  }

  timers.push({
    id: Date.now(),
    duration: totalSeconds,
    startTime: new Date().getTime(),
    isUp: false,
  });

  updateTimersList();
  resetInputFields();
}

function updateTimersList() {
  var timersContainer = document.getElementById('timers');
  timersContainer.innerHTML = '';

  if (timers.length === 0) {
    timersContainer.innerHTML = '<p>You have no timers currently!</p>';
    return;
  }

  timers.forEach(function (timer) {
    var remainingTime = Math.max(0, timer.duration - ((new Date().getTime() - timer.startTime) / 1000));

    var timerElement = document.createElement('div');
    timerElement.className = 'timer';

    if (remainingTime > 0) {
      timerElement.innerHTML = `
        <div>
          Timer ${formatTime(remainingTime)}
        </div>
        ${timer.isUp ? '' : `<button class="delete-button" onclick="deleteTimer(${timer.id})">Delete</button>`}
      `;
    } else {
      if (!timer.isUp) {
        playAlertSound();
        timer.isUp = true;
      }

      timerElement.innerHTML = `
        <div>
          Timer is up!
        </div>
      `;
    }

    timersContainer.appendChild(timerElement);
  });

  // Clear expired timers
  timers = timers.filter(timer => timer.duration - ((new Date().getTime() - timer.startTime) / 1000) > 0);
}

function deleteTimer(id) {
  timers = timers.filter(timer => timer.id !== id);
  updateTimersList();
}

function formatTime(timeInSeconds) {
  var hours = Math.floor(timeInSeconds / 3600);
  var minutes = Math.floor((timeInSeconds % 3600) / 60);
  var seconds = Math.floor(timeInSeconds % 60);

  return `${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(seconds)}`;
}

function formatDigit(digit) {
  return digit < 10 ? '0' + digit : digit;
}

function resetInputFields() {
  document.getElementById('hours').value = '';
  document.getElementById('minutes').value = '';
  document.getElementById('seconds').value = '';
}

function playAlertSound() {
  alertSound.currentTime = 0;
  alertSound.play();
}

// Update timers every second
setInterval(updateTimersList, 1000);