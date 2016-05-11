angular.module('chatroom')
.directive('playRequest', function(){
  return {
    restrict : 'E',
    templateUrl: 'partials/play-request.html',
    scope: true,
    controller: ['$scope','userService', 'userListService', 'tictactoeService',
    function($scope,userService, userListService, tictactoeService){
      $scope.ttt = tictactoeService.ttt;
      $scope.player = tictactoeService.player;

      $scope.gameAccept = function(){
        console.log('You accepted chalenge. Now ' + $scope.player.sender + ' move first!');
        tictactoeService.sendPlayers($scope.player.sender,$scope.player.target);
      }; 
      
      $scope.gameDecline = function(){
        console.log('You declined the challenge!');
        tictactoeService.gameDecline($scope.player.sender,$scope.player.target);
        }; 
    }],
    controllerAs: 'playRequestCtrl'
  }
});