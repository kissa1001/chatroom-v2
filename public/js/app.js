
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
}]);

angular.module('chatroom')
.controller('usersCtrl', ['socket','$scope','$rootScope',function usersCtrl (socket, $scope, $rootScope){
  this.select = function(user) {
    console.log([$scope.user, user]);
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
    $scope.privateMsg = function(){
      console.log('privateMsg');
    }
  })
}]);

angular.module('chatroom')
.controller('chatCtrl', ['socket','$scope','$rootScope',function chatCtrl(socket, $scope,$rootScope){
  //Chat here
  $scope.messages = [];
  $scope.sendMsg = function(event){
    event.preventDefault();
    socket.emit('send:message', {
      message: $scope.message,
      target: $rootScope.whisper
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
