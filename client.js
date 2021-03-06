
function userBrowser() {
  var ua = navigator.userAgent.toLowerCase();
  if(ua.indexOf("firefox") >-1) { return "Firefox"; }
  if(ua.indexOf("chrome") >-1) { return "Chrome"; }
  if(ua.indexOf("phone") >-1) { return "phone"; }
  return "unknown-browser";
}

var socket = io();

// Canvas
var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

// Player
var player = new Player();

// RemotePlayer
var remoteplayer = new RemotePlayer();

// Ball
var ball = new Ball(0, 0);

// Controls

var keysDown = {};

var step = function() {
  update();
  render();
};

var update = function() {
  player.update();
  ball.update(player.paddle, remoteplayer.paddle);
};

var render = function() {
  context.fillStyle = "#DDDDEE";
  context.fillRect(0, 0, width, height);
  player.render();
  remoteplayer.render();
  ball.render();
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#0000FF";
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(175, 580, 50, 10);
}

function RemotePlayer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      socket.emit('move', {paddle: {x:-4.0, y:0} } );
    } else if (value == 39) { // right arrow
      socket.emit('move', {paddle: {x:4.0, y:0} } );
    } else {
      socket.emit('move', {paddle: {x:0, y:0} } );
    }
  }
};


RemotePlayer.prototype.render = function() {
  this.paddle.render();
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#000000";
  context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
  // from server
};

$('form').submit(function(){
  socket.emit('message', {message:$('#m').val()});
  $('#m').val('');
  return false;
});

$(function() {
  $(".canvasContainer").append(canvas);
  window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });
  window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });
  $(".leftButton").on("click", function(){
      socket.emit('move', {paddle: {x:-20.0, y:0} } );
    console.log("left");
  });
  $(".rightButton").on("click", function(){
    console.log("right");
      socket.emit('move', {paddle: {x:20.0, y:0} } );
  });

  var name = "Testuser-"+userBrowser()
  console.log("Connecting as "+name);
  socket.emit('add player', {playername: name} );
  socket.on('message', function(data){
    $('#messages').append($('<li>').text(data.player+"> "+data.message));
  });
  socket.on('players', function(data){
    var playersString = ""
    if(data.numPlayers===2) {
      // game on!
      
      $(".spinner").hide();
    }
    for (var i in data.players) {
    console.log("Player: "+data.players[i]);
      playersString+=" "+data.players[i];
    }
    $('#players').text("Players: "+playersString);
  });
  socket.on('step', function(gameState){
    console.log(gameState);
    ball.x = gameState.ball.x;
    ball.y = gameState.ball.y;
    player.paddle.x = gameState.playerPaddle.x;
    player.paddle.y = gameState.playerPaddle.y;
    remoteplayer.paddle.x = gameState.remotePlayerPaddle.x;
    remoteplayer.paddle.y = gameState.remotePlayerPaddle.y;
    step();
  });
});
