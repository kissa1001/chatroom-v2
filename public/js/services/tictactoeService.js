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
    console.log('request sent from ' + data.sender);
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
    console.log(data.receiver + ' accepted your challenge. Now you move first!');
  })
  socket.on('game:decline', function(data){
    tttService.ttt.requesting = false;
    tttService.ttt.reqDeclined = true;
    console.log(data.receiver + ' declined your challenge :(');
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
      if(data.winner() !== undefined){
        if(data.winner() == data.players[0].name){
          alert(data.players[0].name + ' won!');
        }
        else{
          alert(data.players[1].name + ' won!');
        }
        tictactoe.board = [
          [null, null, null],
          [null, null, null],
          [null, null, null]
        ];
      }
  }
  socket.on('game:move', function(data){
    tictactoe.move(data.player, data.posX, data.posY);
    tttService.winnerCheck();
  })
}]);