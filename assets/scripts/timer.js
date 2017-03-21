// Initialize Firebase
var config = {
  apiKey: "AIzaSyBTYpxYzbWRHpnFvjriSYRe0Oseh2YU2zM",
  authDomain: "pause-nedtelling.firebaseapp.com",
  databaseURL: "https://pause-nedtelling.firebaseio.com",
  storageBucket: "pause-nedtelling.appspot.com",
  messagingSenderId: "768344450137"
};
var lastPauseKey;
firebase.initializeApp(config);
//writeTimerData(getServerTime(), 5000, 1);
initPauseSession();

/*************** JSTIMER ************************/

function createTimer(durationMilliSec){
  clearInterval(countdown);

  const nowMilliSec = getServerTime();

  var now = new Date(nowMilliSec);
  const then = nowMilliSec + durationMilliSec;

  /*convert to seconds*/
  const durationSec = durationMilliSec / 1000;


  displayTimeLeft(durationSec);
  displayEndTime(then);

  const maxSecondsLeft = Math.round((then - Date.now())  / 1000);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now())  / 1000);
    // check if we should stop it!
    if (secondsLeft < 0) {
      updateTimer(0);
      removeUnselectable();
      clearInterval(countdown);
      return;
    }
    // display it
    displayTimeLeft(secondsLeft);

  }, 1000);

}
/*Ongoing timer is detected, creates a JS timer with the duration left*/
function createOnGoingTimer(start, stop, duration){

  addUnselectable();
  var timeLeft = stop - getServerTime();
  createTimer(timeLeft);
  resetGrid();
  startCatGrid(calculateTimeGrid(timeLeft));

}

function addUnselectable(){
  form.classList.add("unselectable");
  pauseSubheader.innerHTML = ("'Reset' for å starte en ny timer");

  links.forEach(function(el) {
    el.classList.add("unselectable")
  });
}

function removeUnselectable(){
  form.classList.remove("unselectable");
pauseSubheader.innerHTML = ("Pause");
  links.forEach(function(el) {
    el.classList.remove("unselectable")
  });
}
function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.round(seconds % 60);
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


/**************** FIREBASE FUNCTIONS ***********/


function initPauseSession(){
  var ref = firebase.database().ref('pause/');
  var pause;

  onValue = function(snapshot) {

    snapshot.forEach(function(childSnapshot) {
      lastPauseKey = childSnapshot.key;
      var childSnapshot = childSnapshot.val();
      console.log(childSnapshot.isOngoing);

      if(childSnapshot.isOngoing == 1){
        console.log("There is a pause going on");
        createOnGoingTimer(childSnapshot.start, childSnapshot.stop, childSnapshot.duration);


      } else {
        removeUnselectable();
        clearInterval(countdown);
        timerDisplay.innerHTML = "00:00"
        console.log("There is NOT a pause going on");

      }
    });

  }

  ref.orderByKey().limitToLast(1).on("value", onValue);

}


function writeTimerData(start, duration, isOngoing) {
  var pauseRef = firebase.database().ref('pause/');
  var newPause = pauseRef.push();
  newPause.set({
    start: start,
    duration: duration,
    stop: start + duration,
    isOngoing : isOngoing
  });
}


function updateTimer(isOnGoing) {
  firebase.database().ref('pause/' + lastPauseKey).update({
    isOngoing: isOnGoing
  });


}

function resetPauseOnDb(){
  var ref = firebase.database().ref('pause/');
  var pause;

  onValue = function(snapshot) {

    snapshot.forEach(function(childSnapshot) {
      lastPauseKey = childSnapshot.key;
      var childSnapshot = childSnapshot.val();
      console.log(childSnapshot.isOngoing);

      if(childSnapshot.isOngoing == 0){
        console.log(" Timer is ");


      }
    });

  }

  ref.orderByKey().limitToLast(1).on("value", onValue);

}

/** Returns the current servertime from the database
@return returns the servertime
**/
function getServerTime(){
  writeServerTime();

  var currentTimeRef = firebase.database().ref('serverTime/current/');
  var serverTime;
  onValue = function(snapshot) {
    serverTime = snapshot.val();
  };

  currentTimeRef.on("value", onValue);
  return serverTime;

}


/**
Writes the current servertime to database
@param callback //TODO: Not sure if necessary
*/
function writeServerTime(callback){
  updateServerTime();

  var currentTimeRef = firebase.database().ref('serverTime/current/');

  currentTimeRef.on("value", function(snapshot) {
    var serverTime = snapshot.val();
  }, function (error) {
    console.log("Error: " + error.code);
  });



  function updateServerTime(){
    firebase.database().ref('serverTime/').update({
      current: firebase.database.ServerValue.TIMESTAMP
    });
  }

}
