
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
.controller('logInCtrl', ['socket', '$scope','$rootScope',
  function logInCtrl(socket, $scope, $rootScope){
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
.controller('usersCtrl', ['socket','$scope','$rootScope',
  function usersCtrl (socket, $scope, $rootScope){
  this.select = function(user) {
    if ($rootScope.whisper !== user) {
      // if not selected, select it.
      $rootScope.whisper = user;
    } else {
      // if already selected, then de-select it.
      $rootScope.whisper = false;
    }
  };
  //Display users
  socket.on('userNames', function(data){
    $rootScope.users = data;
    $rootScope.loggedIn = true;
  })
  //Play request
  $scope.playRequest = function(){
    socket.emit('playRequest', {userName:$scope.userName, target:$rootScope.whisper});
  }
  $rootScope.request = false;
  socket.on('playRequest', function(data){
    console.log('request sent from ' + data.userName);
    $rootScope.userName = data.userName;
    $rootScope.request = true;
    
  })
}]);

angular.module('chatroom')
.controller('chatCtrl', ['socket','$scope','$rootScope',
  function chatCtrl(socket, $scope,$rootScope){
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
      socket.on('players', function(data){
        if (data.players.player1) {
          tictactoe.players[0] = new Player(
            data.players.player1.name, data.players.player1.sign);
        }
        if (data.players.player2) {
          tictactoe.players[1] = new Player(
            data.players.player2.name, data.players.player2.sign);
        }
      });
      $scope.move = function(X,Y){
        console.log(tictactoe.players);
        tictactoe.move($rootScope.player.name, X, Y);
      };
    }]);
