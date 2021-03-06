## Description

A little Pong Game Server using socket.io and express.

## Running the server

Make sure that you have NodeJS (0.12.0) installed. 



    $ node index.js

This will launch the server and you can access it at [http://localhost:3000][1].

There is a WebSocket open that you can connect to at the same address.

## Events to listen for:

Here are the different events that the server sends to connected clients.

### players

Returns the currently connected players. Is sent out every time a player connects or disconnects.

Sample response:

    {
      players: {
        ["Trudy", "Anne"]
      }, 
      numPlayers: 2
    }

### message

A message from a player that is broadcasted to everyone connected (including the sender).

Sample response:

    {message: "hello world", player: "Christian"}

### step

This describes the current state of the game. This message will be broadcasted frequently, currently 30 times per seconds. 

Sample response:

    {
      ball: {x:10, y: 300, x_speed: 3, y_speed: 5},
      playerPaddle: {x:106, y: 400},
      remotePlayerPaddle: {x:100, y: 0}
    }

TODO: Add game plan bounds.

## Message to emit:

These messages can be sent to the server.

### add player

Used to login at the server. The game will not start until this is received for two players.

    {playername: "Christian"}

### message

A chat message to be broadcasted to other players. The server will keep track of who is the sender.

    {message: "hello world"}

### move

A command to move the players paddle. This is the only way for the client to influence the game. The server will return the effects of the move in the next step broadcast. The server may handle moves it wants, so don't rely on client side logic for this.

    {
      paddle: {
        x: 10, 
        y:0
      }
    }

Yes, it's possible to change the paddle in two dimensions. Some would consider this cheating.

  [1]: http://localhost:3000

