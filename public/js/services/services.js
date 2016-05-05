angular.module('chatroom')
.service('userService',['socket', function(socket){
  this.user = {};
  var self = this;
  this.join = function(userName){
    socket.emit('user:join',{userName:userName});
  };
  socket.on('user:join', function (data) {
    self.user.name = data.userName;
    self.user.loggedIn = true;
  });
}]);

angular.module('chatroom')
.service('userListService',['socket', function(socket){
  this.users = [];
  this.query =  function(){
    socket.emit('user:queryList');
  }
  var service=this;
  socket.on('user:list', function(data){
    console.log(data);
    service.users = data;
  })
  this.whisper = false;
}]);

angular.module('chatroom')
.service('messageService',['socket', function(socket){
  this.messages = [];
  this.sendPublic = function(message){
    socket.emit('message:public', {
      msg: message
    });
  }
  this.sendPrivate = function(receiver,message){
    socket.emit('message:private', {
      msg: message,
      target: receiver
    });
  }
    var msgService = this;
    socket.on('message:public', function (message) {
      msgService.messages.push({msg: '/p ' + message.msg, sender: message.sender, whisper: false, time: new Date().toString()});
    });
    socket.on('message:private', function(message){
      msgService.messages.push({msg: '/w to '+ message.target + ': ' + message.msg, sender: message.sender,target:message.target, whisper: true, time: new Date().toString()});
    })
}]);

angular.module('chatroom')
.service('tictactoeService',['socket','tictactoe', function(socket,tictactoe){
  this.game = {};

  this.request = function(sender,target){
    this.game.requesting = true;
    socket.emit('game:request', {
      sender:sender, 
      target:target
    });
  }

  var tttService = this;

  socket.on('game:request', function(data){
    tttService.game.requesting = true;
    tttService.game.isReceiver = true;
    console.log('request sent from ' + data.sender);
  });

  this.sendPlayers = function(sender,target){
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
  this.gameDecline = function(sender,target){
    socket.emit('game:decline', {sender:sender, receiver: target});
  }
  socket.on('game:accept', function(data){
    console.log(data.receiver + ' accepted your challenge. Now you move first!');
  })
  socket.on('game:decline', function(data){
    console.log(data.receiver + ' declined your challenge :(');
  })
}]);

angular.module('chatroom')
.service('seabattleService',['socket','tictactoe', function(socket,tictactoe){
  
}]);