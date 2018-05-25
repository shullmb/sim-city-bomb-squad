console.log("javascript running");
  
// set up global variables
var startingTime = 30;
var remainingTime = 0;
var gameOver = false;
var wiresToCut = [];
var successSong = null;

var delay = null; // set to null -- because it will eventually hold an object -- want it to be falsey if nothing in here;
var timer = null;

var wiresCut = {
  blue: false,
  green: false,
  red: false,
  white: false,
  yellow: false
};

var checkforWin = function() {
  return wiresToCut.length ? false : true ; 
}

var endGame = function(win) {
  clearTimeout(delay);
  clearInterval(timer);
  gameOver = true;
  // activate reset button
  document.getElementsByTagName('button')[0].disabled = false;
  if (win) {
    // we won
    console.log('you saved the city!');
    document.getElementsByClassName('timerbox')[0].classList.add('green');
    document.querySelector('.timerbox p').textContent = 'DEACTIVATED';
    document.getElementsByClassName('timerbox')[0].classList.remove('red');
    var yay = document.getElementById('yay');
    yay.addEventListener('ended',function(){
      successSong.play();
    });
    yay.play();
  } else {
    // we lost
    console.log('boom!');
    document.getElementById('explode').play();
    document.body.classList.remove('unexploded');
    document.body.classList.add('exploded');
  }
}

var updateClock = function() {
  remainingTime--;
  if (remainingTime <= 0) {
    endGame(false);
  }
  document.querySelector('.timerbox p').textContent = "00:00:" + remainingTime;
}

var cutWire = function() {
  if (!wiresCut[this.id] && !gameOver){
    // do the wire cutting and game checking here
    document.getElementById('buzz').play();
    this.src = 'img/cut-' + this.id + '-wire.png';
    wiresCut[this.id] = true;
    // check for correct wire
    var wireIndex = wiresToCut.indexOf(this.id);
    if ( wireIndex > -1 ) {
      //this is where the good cut logic goes
      console.log(this.id + ' was correct');
      wiresToCut.splice(wireIndex,1);
      if (checkforWin()) {
       endGame(true); 
      };
    } else {
      // this is where the bad cut logic goes
      console.log(this.id + ' was incorrect');
      delay = setTimeout( function(){
        endGame(false)}, 750);
    }
  }
}

var initGame = function() {
  // this empties wires to cut array
  wiresToCut.length = 0;
  // reset timer
  remainingTime = startingTime;
  for(let wire in wiresCut) {
    var rand = Math.random();
    if ( rand > 0.5 ) {
      wiresToCut.push(wire);
    }
  }
  console.log(wiresToCut);
  document.getElementsByTagName('button')[0].disabled = true;
  document.getElementById('siren').play();
  timer = setInterval(updateClock, 1000);
}

var reset = function() {
  gameOver = false;
  var wireImages = document.getElementsByClassName('wirebox')[0].children; //returns an arraylike object
  for (let i = 0; i < wireImages.length; i++){
    wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
  }
  //reset background
  document.body.classList.remove('exploded');
  document.body.classList.add('unexploded');
  //reset clock color
  document.querySelector('.timerbox p').textContent = 'WARNING';
  document.getElementsByClassName('timerbox')[0].classList.add('red');
  document.getElementsByClassName('timerbox')[0].classList.remove('green');

  clearTimeout(delay);
  clearInterval(timer);

  successSong.pause();
  successSong.currentTime = 0;

  for (let wire in wiresCut){
    wiresCut[wire] = false;
  }
  initGame();
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");
  for (let wire in wiresCut) {
    document.getElementById(wire).addEventListener('click', cutWire);
  }
  document.getElementsByTagName('button')[0].addEventListener('click', reset);
  successSong = document.getElementById('success');
  initGame();

});

