angular.module('chatroom')
.directive('userList', function(){
  return {
    restrict : 'E',
    templateUrl: 'partials/user-list.html',
    scope: true,
    controller: ['userListService','userService','$scope','tictactoeService', function usersCtrl (userListService,userService, $scope,tictactoeService){
      $scope.userList = userListService;
      $scope.me = userService.user;
      this.select = function(user) {
        $scope.whisper = user;
        userListService.whisper = user;
      };

      $scope.tictactoeRequest = function(user){
        tictactoeService.request(userService.user.name, user);
      }
    }],
    controllerAs: 'usersCtrl'
  }
});