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