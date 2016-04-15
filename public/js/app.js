
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
    socket.emit('init',{name:$scope.name});
  }
	socket.on('init', function (data) {

  });
  socket.on('userNames', function(data){
    $rootScope.users = data;
    console.log(data);
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
  $scope.sendMsg = function(event){
    event.preventDefault();
    socket.emit('send:message', $scope.message);
    console.log('sending msg');
  }
	socket.on('send:message', function (message) {
    	$scope.messages.push(message);
  });
 	// socket.on('user:join', function (data) {
  //   $scope.messages.push({
  //     user: 'chatroom',
  //     text: 'User ' + data.name + ' has joined.'
  //   });
  //   $scope.users.push(data.name);
  // 	socket.on('user:left', function (data) {
  //   		$scope.messages.push({
  //     		user: 'chatroom',
  //     		text: 'User ' + data.name + ' has left.'
  //   		});
  //   		var i, user;
  //   		for (i = 0; i < $scope.users.length; i++) {
  //     	user = $scope.users[i];
  //     		if (user === data.name) {
  //       		$scope.users.splice(i, 1);
  //       		break;
  //     		}
  //   		}
  // 	});
  // });

}]);

$(function() {

});