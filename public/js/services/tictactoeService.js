angular.module('chatroom')
.service('tictactoeService',['socket','tictactoe', function(socket,tictactoe){
  this.tictactoe = tictactoe;
  var tttService = this;
  this.ttt = {};

  this.player = {};

  this.request = function(sender,target){
    tttService.player.sender = sender;
    tttService.player.target = target;

    tttService.ttt.requesting = true;
    tttService.ttt.isReceiver = false;
    tttService.ttt.isSender = true;
    socket.emit('game:request', {
      sender:sender,
      target:target
    });
  }

  socket.on('game:request', function(data){
    tttService.ttt.requesting = true;
    tttService.ttt.isSender = false;
    tttService.ttt.isReceiver = true;
    tttService.player.sender = data.sender;
    tttService.player.target = data.target;
  });

  this.sendPlayers = function(sender,target){
    tttService.ttt.requesting = false;
    tttService.ttt.reqAccepted = true;
    tttService.ttt.showBoard = true;
    socket.emit('game:players', {
      players: {
        player1 : {
          name: sender,
          sign: 'X'
        },
        player2 : {
          name: target,
          sign: 'O'
        }
      }
    })
    socket.emit('game:accept', {sender:sender, receiver: target});
  }

  socket.on ('game:players', function(data){
    if (data.players.player1) {
      tictactoe.players[0] = new Player(
        data.players.player1.name, data.players.player1.sign);
    }
    if (data.players.player2) {
      tictactoe.players[1] = new Player(
        data.players.player2.name, data.players.player2.sign);
    }
  })

  this.gameDecline = function(sender,target){
    tttService.ttt.reqDeclined = true;
    tttService.ttt.requesting = false;
    socket.emit('game:decline', {sender:sender, receiver: target});
  }
  socket.on('game:accept', function(data){
    tttService.ttt.requesting = false;
    tttService.ttt.reqAccepted = true;
    tttService.ttt.showBoard = true;
  })
  socket.on('game:decline', function(data){
    tttService.ttt.requesting = false;
    tttService.ttt.reqDeclined = true;
  })

  this.player1Move = function(X,Y,player1){
    data = tictactoe;
    socket.emit('game:move', {
      player: player1,
      posX: X,
      posY: Y
    })
  }
  this.player2Move = function(X,Y,player2){
    data = tictactoe;
    socket.emit('game:move', {
      player:player2,
      posX: X,
      posY: Y
    })
  }


  this.winnerCheck = function(data){
    data = tictactoe;
    var board = tictactoe.board;
    if(data.winner() !== undefined){
      if(data.winner() == data.players[0].name){
        //document.getElementById('winner').innerHTML += 'The winner is ' + data.players[0].name;
        tttService.ttt.winner = data.players[1].name;
      }
      else{
        //document.getElementById('winner').innerHTML += 'The winner is ' + data.players[1].name;
        tttService.ttt.winner = data.players[1].name;
      }
        tttService.ttt.showBoard = false;
    }
    else if(!board[0].includes(null) && !board[1].includes(null) && !board[2].includes(null)){
      document.getElementById('winner').innerHTML += 'You both played really good. The result is tie';
      tttService.ttt.tie = true;
        tttService.ttt.showBoard = false;
    }
  }
  socket.on('game:move', function(data){
    tictactoe.move(data.player, data.posX, data.posY);
    tttService.winnerCheck();
  })
}]);