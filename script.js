let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const backgroundImage = document.querySelector(".background-image");
const cats = [100,101,200,201,202,204,206,207,300,301,302,303,304,305,307,400,401,402,403,404,405,406,408,409,410,411,412,413,414,415,416,417,418,420,421,422,423,424,425,426,429,431,444,450,451,500,502,503,504,506,507,508,509,511,599];
const httpCat = "http://http.cat/";

function getRandomCat() {
  console.log(cats.length);
  const index = Math.floor(Math.random() * (cats.length - 0) + 0);
  console.log(index);
  return cats[index];
}

function chooseCat() {
  unblur(100);
  backgroundImage.src = httpCat + getRandomCat();

}


function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);
  chooseCat();
  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);
  const maxSecondsLeft = Math.round((then - Date.now()) / 1000);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // display it
    displayTimeLeft(secondsLeft);
    const blur = percentBetween(secondsLeft, maxSecondsLeft, 0)
    unblur(blur)
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function percentBetween(secondsLeft, max, min) {
  const range = max - min;
  const startValue = secondsLeft - min;
  const percentage = (startValue * 100) / range; 
  return percentage;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

function unblur(blur) {
  backgroundImage.setAttribute("style", `filter: blur(${blur}px)`);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  console.log(mins);
  timer(mins * 60);
  this.reset();
});
