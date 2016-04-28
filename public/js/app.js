angular.module('chatroom', ['btford.socket-io']);

angular.module('chatroom')
.factory('socket', function (socketFactory) {
  return socketFactory();
});

angular.module('chatroom')
.factory('tictactoe', function(){
  return new TicTacToe();
});

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
}]);

angular.module('chatroom')
.directive('loginPage', function(){
  return {
    restrict : 'E',
    templateUrl: 'partials/login-page.html',
    scope: true,
    controller: ['$scope', 'userService', function logInCtrl($scope, userService){
      //Log user in
      $scope.me = userService.user;
      $scope.submit = function(event){
        event.preventDefault();
        userService.join($scope.userName);
      }
    }],
    controllerAs: 'logInCtrl'
  }
});

angular.module('chatroom')
.directive('userList', function(){
  return {
    restrict : 'E',
    templateUrl: 'partials/user-list.html',
    scope: true,
    controller: ['userListService','userService','$scope', function usersCtrl (userListService,userService, $scope){
      $scope.users = userListService.users;
      $scope.me = userService.user;
      this.select = function(user) {
        $rootScope.whisper = user;
      };
    }],
    controllerAs: 'usersCtrl'
  }
});

angular.module('chatroom')
.directive('chatBlock', function(){
  return {
    restrict : 'E',
    templateUrl: 'partials/chat-block.html',
    scope: true,
    controller: ['socket','$scope','$rootScope', 'tictactoe', function chatCtrl(socket, $scope,$rootScope, tictactoe){
      //Chat here
      $scope.messages = [];
      $scope.sendMsg = function(event){
        event.preventDefault();
        socket.emit('message:public', {
          user: $rootScope.userName,
          message: $scope.message
        });
        socket.emit('message:private', {
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
      socket.on('message:public', function (message) {
        $scope.messages.push({msg: 'p/ ' + message.msg, user: message.user, whisper: false});
      });
      socket.on('message:private', function(message){
        $scope.messages.push({msg: 'w/ ' + message.msg, user: message.user, whisper: true});
      })
    }],
    controllerAs: 'chatCtrl'
  }
});

angular.module('chatroom')
.directive('ticTacToe', function(){
  return {
    restrict : 'E',
    templateUrl: 'partials/tic-tac-toe.html',
    scope: true,
    controller: ['$scope', '$rootScope', 'socket', 'tictactoe',
    function($scope, $rootScope, socket, tictactoe){
      $scope.tictactoe = tictactoe;

      //Play request
      $rootScope.playRequest = function(e, user, data){
        e.preventDefault();
        $rootScope.whisper = user;
        socket.emit('game:request', {sender:$rootScope.userName, target:$rootScope.whisper});
        console.log('sent request to ' + $rootScope.whisper);
        $rootScope.request = true;
        $rootScope.isSender = true;
        $rootScope.firstPlayer = true;
      }
      socket.on('game:request', function(data){
        console.log('request sent from ' + data.sender);
        $rootScope.sender = data.sender;
        $rootScope.request = true;
        $rootScope.isReceiver = true;
        $rootScope.acceptChallenge = function(){
          $rootScope.request = false;
          $rootScope.reqAccepted = true;
          $rootScope.firstPlayer = false;
          console.log('You accepted chalenge. Now ' + data.sender + ' move first!');
          socket.emit('game:players', {
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
          socket.emit('game:accept', {sender:data.sender, receiver: data.target});
        }; 
        $rootScope.declineChallenge = function(){
          $rootScope.request = false;
          $rootScope.reqDeclined = true;
          socket.emit('game:decline', {sender:data.sender, receiver: data.target});
          console.log('You declined the challenge!');
        }
      });
      socket.on('game:accept', function(data){
        $rootScope.request = false;
        $rootScope.reqAccepted = true;
        console.log(data.receiver + ' accepted your challenge. Now you move first!');
      })
      socket.on('game:decline', function(data){
        $rootScope.request = false;
        $rootScope.reqDeclined = true;
        console.log(data.receiver + ' declined your challenge :(');
      })
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
      $rootScope.move = function(X,Y,data){
        data = tictactoe;
        if($rootScope.firstPlayer){
          socket.emit('game:move', {
            player: data.players[0].name,
            posX: X,
            posY: Y
          })
        }
        else{
          socket.emit('game:move', {
            player: data.players[1].name,
            posX: X,
            posY: Y
          })
        }
      };
      winnerCheck = function(data){
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
      };
      socket.on('game:move', function(data){
        tictactoe.move(data.player, data.posX, data.posY);
        winnerCheck();
      })
    }],
    controllerAs: 'tictactoeCtrl'
  }
});