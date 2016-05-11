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