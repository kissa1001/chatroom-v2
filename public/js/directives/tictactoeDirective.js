angular.module('chatroom')
.directive('ticTacToe', function(){
  return {
    restrict : 'E',
    templateUrl: 'partials/tic-tac-toe.html',
    scope: true,
    controller: ['$scope','userService', 'userListService', 'tictactoeService',
    function($scope,userService, userListService, tictactoeService){
      $scope.tictactoe = tictactoeService.tictactoe;
      $scope.ttt = tictactoeService.ttt;
      $scope.move = function(X,Y,data){
        data = tictactoeService.tictactoe;

        if(userService.user.name == data.players[0].name){
          tictactoeService.player1Move(X,Y,data.players[0].name);
        }
        else{
          tictactoeService.player2Move(X,Y,data.players[1].name);
        } 
      };
    }],
    controllerAs: 'tictactoeCtrl'
  }
});