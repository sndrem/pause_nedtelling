let countdown;
let imageCountDown;
let slider;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const imageContainer = document.querySelector(".image-container");
const cats = [100, 101, 200, 201, 202, 204, 206, 207, 300, 301, 302, 303, 304, 305, 307, 400, 401, 402, 403, 404, 405, 406, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 429, 431, 444, 450, 451, 500, 502, 503, 504, 506, 507, 508, 509, 511, 599];
const httpCat = "http://http.cat/";
const grid = new Array();

function getRandomCat() {
    const index = Math.floor(Math.random() * (cats.length - 0) + 0);
    return cats[index];
}

function chooseCat() {
    imageContainer.classList.remove('hidden');
    imageContainer.style.backgroundImage = `url(${httpCat + getRandomCat()})`;
}


function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown);
    clearInterval(imageCountDown);
    resetGrid();
    chooseCat();
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);
    const maxSecondsLeft = Math.round((then - Date.now()) / 1000);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop it!
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        // display it
        displayTimeLeft(secondsLeft);
    
    }, 1000);
}

function startCatGrid(blurTime) {
    clearInterval(imageCountDown);
    imageCountDown = setInterval(() => {
      unblur();
    }, blurTime); 
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
    startCatGrid(500);
}

function gridify() {
    var grid = Array.from(document.getElementsByClassName("not-touched"));
    grid.forEach(g => g.style.background = `white`);
}

function resetGrid() {
  chooseCat();
  var grid = Array.from(document.getElementsByTagName("td"));
  grid.forEach(g => {
        g.style.background = `white`;
        g.style.border = "1px solid black";
        g.className = "not-touched";
    });
  startCatGrid(slider.value);
}

function unblur() {
    // Unblur random element
    var grid = Array.from(document.getElementsByClassName("not-touched"));
    if(grid.length === 0) {
      clearInterval(imageCountDown);
      Array.from(document.querySelectorAll(".touched")).forEach(s => s.style.border = "none");
    } else {
        var index = Math.floor(Math.random() * ( grid.length - 0) + 0);
        grid[index].style.background = "none";
        grid[index].classList.remove("not-touched");    
        grid[index].classList.add("touched");    
    }
    
}

function updateSlider(e) {
    document.querySelector(".slider-value").innerHTML = `${parseInt(this.value) / 1000} sek. `;
    startCatGrid(this.value);
}

function drawTable() {
    var x = 30;
    var y = 20;
    var t = '<table cellspacing="0" border="1" cellpadding="0" class="grxd">';
    for (var i = 1; i <= (x * y); i++) {
        grid.push(i);
        t += (i == 1 ? '<tr>' : '');
        t += '<td style="cursor:pointer;" class="not-touched"></td>';
        if (i == (x * y)) {
            t += '</tr>';
        } else {
            t += (i % 30 === 0 ? '</tr><tr>' : '');
        }

    }

    t += '</table>';
    imageContainer.innerHTML = t;
    setupControllers();
}

function setupControllers() {
        const button = document.createElement("button");
    button.innerHTML = "Reset";

    slider = document.createElement("input");
    slider.type = "range";
    slider.min = "10";
    slider.max = "2500";
    slider.step = "25";
    slider.value = "250"; // Default value

    const sliderSpan = document.createElement("span");
    sliderSpan.className = "slider-value";
    sliderSpan.innerHTML = `${slider.value / 1000} sek.`;

    button.addEventListener("click", resetGrid);
    slider.addEventListener("change", updateSlider);

    imageContainer.appendChild(button);
    imageContainer.appendChild(slider);
    imageContainer.appendChild(sliderSpan);
}

drawTable();
gridify();

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mins = this.minutes.value;
    console.log(mins);
    timer(mins * 60);
    this.reset();
});