
angular.module('chatroom', ['btford.socket-io', 'ui.bootstrap']);

angular.module('chatroom')
.factory('socket', function (socketFactory) {
  return socketFactory();
});

angular.module('chatroom')
.factory('tictactoe', function(){
  return new TicTacToe();
});

angular.module('chatroom')
.controller('logInCtrl', ['socket', '$scope','$rootScope', 'tictactoe',
  function logInCtrl(socket, $scope, $rootScope, tictactoe){
  //Log user in
  $scope.submit = function(event){
    event.preventDefault();
    socket.emit('init',{userName:$scope.userName});
    $rootScope.userName = $scope.userName;
  }
  socket.on('init', function (data) {
    $scope.userName = data.userName;
  });
}]);

angular.module('chatroom')
.controller('usersCtrl', ['socket','$scope','$rootScope', 'tictactoe',
  function usersCtrl (socket, $scope, $rootScope, tictactoe){
    this.select = function(user) {
      $rootScope.whisper = user;
    };
  //Display users
  socket.on('userNames', function(data){
    $rootScope.users = data;
    $rootScope.loggedIn = true;
  })
  

}]);

angular.module('chatroom')
.controller('chatCtrl', ['socket','$scope','$rootScope', 'tictactoe',
  function chatCtrl(socket, $scope,$rootScope, tictactoe){
  //Chat here
  $scope.messages = [];
  $scope.sendMsg = function(event){
    event.preventDefault();
    socket.emit('send:message', {
      message: $scope.message,
      target: $rootScope.whisper
    });
    if($rootScope.whisper){
      $scope.messages.push({
        user: $rootScope.userName,
        msg: 'w/ ' + $scope.message,
        whisper: true
      })
    }
    else{
      $scope.messages.push({
        user: $rootScope.userName,
        msg: 'p/ ' + $scope.message
      });
    }
    
    $scope.message = '';
  }
  socket.on('send:publicMsg', function (message) {
    $scope.messages.push({msg: 'p/ ' + message.msg, user: message.user, whisper: false});
  });
  socket.on('send:privateMsg', function(message){
    $scope.messages.push({msg: 'w/ ' + message.msg, user: message.user, whisper: true});
  })
}]);

angular.module('chatroom')
.controller('gameCtrl',['$scope', '$rootScope', 'socket', 'tictactoe',
  function($scope, $rootScope, socket, tictactoe){
    $scope.tictactoe = tictactoe;

      //Play request
      $rootScope.playRequest = function(e, user, data){
        e.preventDefault();
        $rootScope.whisper = user;
        socket.emit('playRequest', {sender:$rootScope.userName, target:$rootScope.whisper});
        console.log('sent request to ' + $rootScope.whisper);
        $rootScope.request = true;
        $rootScope.isSender = true;
        $rootScope.firstPlayer = true;
      }
      socket.on('playRequest', function(data){
        console.log('request sent from ' + data.sender);
        $rootScope.sender = data.sender;
        $rootScope.request = true;
        $rootScope.isReceiver = true;
        $rootScope.acceptChallenge = function(){
          $rootScope.request = false;
          $rootScope.reqAccepted = true;
          $rootScope.firstPlayer = false;
          console.log('You accepted chalenge! ' + data.sender + 'move first!');
          socket.emit('players', {
            players: {
              player1 : {
                name: data.sender,
                sign: 'X'
              },
              player2 : {
                name: data.target,
                sign: 'O'
              }
            }
          })
          socket.emit('challengeAccepted', {sender:data.sender, receiver: data.target});
        }; 
      });
      socket.on('challengeAccepted', function(){
        $rootScope.request = false;
        $rootScope.reqAccepted = true;
        console.log(data.receiver + 'accepted your challenge. Now you move first!');
      })
      socket.on ('players', function(data){
          if (data.players.player1) {
            tictactoe.players[0] = new Player(
              data.players.player1.name, data.players.player1.sign);
          }
          if (data.players.player2) {
            tictactoe.players[1] = new Player(
              data.players.player2.name, data.players.player2.sign);
          }
      })
      $rootScope.move = function(X,Y,data){
        console.log($rootScope.firstPlayer + ' is moving first!');
        data = tictactoe;
        if($rootScope.firstPlayer){
          socket.emit('move', {
            player: data.players[0].name,
            posX: X,
            posY: Y
          })
        }
        else{
          socket.emit('move', {
            player: data.players[1].name,
            posX: X,
            posY: Y
          })
        }
      };
      socket.on('move', function(data){
        tictactoe.move(data.player, data.posX, data.posY);
      })
    }]);
