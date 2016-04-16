
angular.module('chatroom', ['btford.socket-io']);

angular.module('chatroom')
.factory('socket', function (socketFactory) {
  return socketFactory();
});

angular.module('chatroom')
.controller('logInCtrl', ['socket', '$scope','$rootScope',function logInCtrl(socket, $scope, $rootScope){
	//Log user in
  $scope.submit = function(event){
    event.preventDefault();
    socket.emit('init',{userName:$scope.userName});
    $rootScope.userName = $scope.userName;
  }
	socket.on('init', function (data) {
    $scope.userName = data.userName;
  });
  socket.on('userNames', function(data){
    $rootScope.users = data;
    $scope.loggedIn = true;
  })

}]);

angular.module('chatroom')
.controller('chatUICtrl', ['socket','$scope','$rootScope',function chatUICtrl (socket, $scope, $rootScope){
	//Display users
}]);

angular.module('chatroom')
.controller('chatCtrl', ['socket','$scope','$rootScope',function chatCtrl(socket, $scope,$rootScope){
	//Chat here
  $scope.messages = [];
  $scope.sendMsg = function(event){
    event.preventDefault();
    socket.emit('send:message', {
      message: $scope.message
    });
    $scope.messages.push({
        user: $rootScope.userName, 
        msg: $scope.message
    });
    $scope.message = '';
  }
	socket.on('send:message', function (message) {
    $scope.messages.push(message);
  });

}]);

$(function() {

});