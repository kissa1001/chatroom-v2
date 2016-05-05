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
      $scope.userList = userListService;
      $scope.me = userService.user;
      this.select = function(user) {
        $scope.whisper = user;
        userListService.whisper = user;
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
    controller: ['$scope','userService', 'userListService','messageService', function chatCtrl($scope,userService, userListService, messageService){
      //Chat here
      $scope.messages = messageService.messages;
      $scope.sendMsg = function(e){
        e.preventDefault();
        if(userListService.whisper){
          messageService.sendPrivate(userListService.whisper, $scope.message);
        }   
        else{
          messageService.sendPublic($scope.message);
        }

        $scope.message = '';
      }
    }],
    controllerAs: 'chatCtrl'
  }
});

angular.module('chatroom')
.directive('playRequest', function(){
  return {
    restrict : 'A',
    templateUrl: 'partials/play-request.html',
    scope: true,
    controller: ['$scope','userService', 'userListService', 'tictactoeService','seabattleService',
    function($scope,userService, userListService, tictactoeService, seabattleService){
      $scope.game = tictactoeService.game;
      console.log($scope.game);
      $scope.tictactoeRequest = function(e){
        e.preventDefault();
        tictactoeService.request(userService.user.name,userListService.whisper);
        tictactoeService.game.requesting = true;
        $scope.isSender = true;
        console.log('sent request to ' + userListService.whisper);
      };

      $scope.gameAccept = function(){
        tictactoeService.sendPlayers(userService.user.name,userListService.whisper);
        console.log('You accepted chalenge. Now ' + sender + ' move first!');
      }; 
      
      $scope.gameDecline = function(){
        tictactoeService.gameDecline(userService.user.name,userListService.whisper);
        console.log('You declined the challenge!');
        }; 
    }],
    controllerAs: 'playRequestCtrl'
  }
});


// angular.module('chatroom')
// .directive('ticTacToe', function(){
//   return {
//     restrict : 'E',
//     templateUrl: 'partials/tic-tac-toe.html',
//     scope: true,
//     controller: ['$scope','userService', 'userListService', 'tictactoeService',
//     function($scope,userService, userListService, tictactoeService){
//       $scope.tictactoe = tictactoe;

//       //Play request
//       $rootScope.playRequest = function(e, user, data){
//         e.preventDefault();
//         $rootScope.whisper = user;
//         socket.emit('game:request', {sender:$rootScope.userName, target:$rootScope.whisper});
//         console.log('sent request to ' + $rootScope.whisper);
//         $rootScope.request = true;
//         $rootScope.isSender = true;
//         $rootScope.firstPlayer = true;
//       }
//       socket.on('game:request', function(data){
//         console.log('request sent from ' + data.sender);
//         $rootScope.sender = data.sender;
//         $rootScope.request = true;
//         $rootScope.isReceiver = true;
//         $rootScope.acceptChallenge = function(){
//           $rootScope.request = false;
//           $rootScope.reqAccepted = true;
//           $rootScope.firstPlayer = false;
//           console.log('You accepted chalenge. Now ' + data.sender + ' move first!');
//           socket.emit('game:players', {
//             players: {
//               player1 : {
//                 name: data.sender,
//                 sign: 'X'
//               },
//               player2 : {
//                 name: data.target,
//                 sign: 'O'
//               }
//             }
//           })
//           socket.emit('game:accept', {sender:data.sender, receiver: data.target});
//         }; 
//         $rootScope.declineChallenge = function(){
//           $rootScope.request = false;
//           $rootScope.reqDeclined = true;
//           socket.emit('game:decline', {sender:data.sender, receiver: data.target});
//           console.log('You declined the challenge!');
//         }
//       });
//       socket.on('game:accept', function(data){
//         $rootScope.request = false;
//         $rootScope.reqAccepted = true;
//         console.log(data.receiver + ' accepted your challenge. Now you move first!');
//       })
//       socket.on('game:decline', function(data){
//         $rootScope.request = false;
//         $rootScope.reqDeclined = true;
//         console.log(data.receiver + ' declined your challenge :(');
//       })
//       socket.on ('game:players', function(data){
//         if (data.players.player1) {
//           tictactoe.players[0] = new Player(
//             data.players.player1.name, data.players.player1.sign);
//         }
//         if (data.players.player2) {
//           tictactoe.players[1] = new Player(
//             data.players.player2.name, data.players.player2.sign);
//         }
//       })
//       $rootScope.move = function(X,Y,data){
//         data = tictactoe;
//         if($rootScope.firstPlayer){
//           socket.emit('game:move', {
//             player: data.players[0].name,
//             posX: X,
//             posY: Y
//           })
//         }
//         else{
//           socket.emit('game:move', {
//             player: data.players[1].name,
//             posX: X,
//             posY: Y
//           })
//         }
//       };
//       winnerCheck = function(data){
//         data = tictactoe;
//         if(data.winner() !== undefined){
//           if(data.winner() == data.players[0].name){
//             alert(data.players[0].name + ' won!');
//           }
//           else{
//             alert(data.players[1].name + ' won!');
//           }
//           tictactoe.board = [
//           [null, null, null],
//           [null, null, null],
//           [null, null, null]
//           ];
//         }
//       };
//       socket.on('game:move', function(data){
//         tictactoe.move(data.player, data.posX, data.posY);
//         winnerCheck();
//       })
//     }],
//     controllerAs: 'tictactoeCtrl'
//   }
// });