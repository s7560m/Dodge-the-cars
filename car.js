var game = document.getElementById('game');
var context = game.getContext('2d');

function drawBox(x, y, sizeX, sizeY) {
  context.fillStyle = "black";
  context.fillRect(x, y, sizeX, sizeY);
}
// Car constructor
// Input initialPosition as array
function Car(maxSpeed, initialPosition, initialSpeed, maxSideSpeed, brakeStrength, accelerationStrength) {
  // -------------------------
  // Private variables/methods
  // -------------------------
  var me = this;
  var sideSpeed = 0;
  var SIDESPEEDPROPER = 25;

  // ------------------------
  // Public variables/methods
  // ------------------------
  me.currentPosition = initialPosition;
  me.speed = initialSpeed;
  me.disallowAcceleration = function(override) {
    if (me.speed >= maxSpeed) return true;
    else if (override) return true;
    else return false;
  }
  // Methods Car inherits
  me.accelerateForward = function() {
    if (!me.disallowAcceleration()) {
      me.speed += accelerationStrength;
    }
  }
  me.accelerateBackward = function() {
    if (me.speed >= 0 + 5 /*buffer speed*/) me.speed -= brakeStrength;
  }
  me.moveForward = function() {
    var x = 0;
    me.currentPosition[x] += me.speed;
  }
  me.increaseSideSpeed = function(dir) {
    if (sideSpeed < maxSpeed) {
      switch(dir) {
        case -1:
          sideSpeed += (bounds()) ? speed * dir : 0;
          break;
        case 1:
          sideSpeed += (bounds()) ? speed * dir : 0;
      }
    }
  }
  me.moveSideways = function() {
    var y = 1;
    me.currentPosition[y] += sideSpeed;
  }
  me.show = function() {
    var x = 0, y = 1;
    drawBox(me.currentPosition[x], me.currentPosition[y], 25, 25);
  }
  me.reset = function() {
    location.reload();
  }
  me.moveSidewaysProper = function(dir) {
    var y = 1;
    me.currentPosition[y] += SIDESPEEDPROPER * dir;
    if (me.currentPosition[y] < game.height / 2 - 25) {
      while(me.currentPosition[y] < game.height / 2 - 25) me.currentPosition[y] += 25;
    }
    else if (me.currentPosition[y] > game.height / 2 + 25) {
      while(me.currentPosition[y] > game.height / 2 + 25) me.currentPosition[y] -= 25;
    }
  }
  me.increaseSlowly = function() {
    me.speed += 0.01;
  }
}
var nesan = new Car(100, [game.width / 2, game.height / 2], 0, 20, 5, 0.5);
function handler(e) {
  switch(e.keyCode) {
    case 82:
      nesan.reset();
  }
}
function handler2(e) {
  switch(e.keyCode) {
    case 37:
    case 38:
      nesan.moveSidewaysProper(-1);
      break;
    case 39:
    case 40:
      nesan.moveSidewaysProper(1);
      break;
    case 67:
      enableAI = !enableAI;
      break;
  }
}
var counter = 0;
var NPCCars = [];
function spawnRandomCars(probability, maxRange) {
  var rnd = Math.floor(Math.random() * maxRange + 1);
  var sideways = 25 * Math.floor(Math.random() * 3 + 1) - 25;
  if (rnd === probability) NPCCars.push(new Car(80, [counter + game.width, game.height / 2 - 25 + sideways], 90, 20, 5, 0.5))
  counter++;
}
// Meant to pan camera's focus onto controller car
// primaryCar's the main controller
// Input secondaryCars as array of car objects
function centerPosition(primaryCar, secondaryCars) {
  var x = 0;
  primaryCar.currentPosition[x] -= primaryCar.speed;
  for (var i = 0; i < secondaryCars.length; i++) {
    secondaryCars[i].currentPosition[x] -= primaryCar.speed;
  }
}
var score = 0;
function getScore() {
  score += 0.1;
  context.font = "30px Verdana"
  context.fillText(Math.floor(score), game.width - 100, 100);
}

function drawBoundaries() {
  context.fillStyle = "black";
  context.fillRect(0, game.height/2 + 53, game.width, 5);
  context.fillRect(0, game.height/2 - 33, game.width, 5);
}
var tempDir2 = 0;
var enableAI = false;
function AI() {
  var x = 0, y = 1;
  var tempDir = 0;
  if (NPCCars[0] !== undefined && enableAI) {
    for (var i = 0; i < NPCCars.length; i++) {
      if (nesan.currentPosition[x] > NPCCars[i].currentPosition[x] - 100 && nesan.currentPosition[x] < NPCCars[i].currentPosition[x] - 25 && nesan.currentPosition[y] === NPCCars[i].currentPosition[y]) {
        switch(nesan.currentPosition[y]) {
          case game.height/2 + 25:
            tempDir = -1;
            break;
          case game.height/2 - 25:
            tempDir = 1;
            break;
          case game.height/2:
            tempDir = (tempDir2 !== 0) ? tempDir2 : 1;
            break;
        }
      }
    }
  }
  tempDir2 = tempDir;
  nesan.moveSidewaysProper(tempDir);
}
function update() {
  var x = 0, y = 1;
  context.clearRect(0, 0, game.width, game.height);
  nesan.accelerateForward();
  nesan.moveForward();
  AI();
  nesan.moveSideways();
  nesan.show();
  nesan.increaseSlowly();
  if (NPCCars[0] !== undefined) {
    for (var i = 0; i < NPCCars.length; i++) {
      NPCCars[i].moveForward();
      NPCCars[i].show();
      if (NPCCars[i].currentPosition[y] === nesan.currentPosition[y] && (NPCCars[i].currentPosition[x] > nesan.currentPosition[x] && NPCCars[i].currentPosition[x] < nesan.currentPosition[x] + 20)) {
        alert("Oh shit you crashed");
        location.reload();
      }
    }
  }
  centerPosition(nesan, NPCCars);
  getScore();
  drawBoundaries();
  window.addEventListener("keydown", handler);
  window.addEventListener("keydown", handler2);
  spawnRandomCars(10, 40);
}
setInterval(update, 1000/60);
