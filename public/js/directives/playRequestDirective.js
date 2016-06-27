angular.module('chatroom')
.directive('playRequest', function(){
  return {
    restrict : 'E',
    templateUrl: 'partials/play-request.html',
    scope: true,
    controller: ['$scope','userService', 'tictactoeService',
    function($scope,userService, tictactoeService){
      $scope.ttt = tictactoeService.ttt;
      $scope.player = tictactoeService.player;
      $scope.userService = userService;
      $scope.hideModal =false;
      $scope.gameAccept = function(){
        tictactoeService.sendPlayers($scope.player.sender,$scope.player.target);
      }; 
      
      $scope.gameDecline = function(){
        tictactoeService.gameDecline($scope.player.sender,$scope.player.target);
        }; 
    }],
    controllerAs: 'playRequestCtrl'
  }
});