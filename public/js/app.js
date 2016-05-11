angular.module('chatroom', ['btford.socket-io']);

angular.module('chatroom')
.factory('socket', function (socketFactory) {
  return socketFactory();
});

angular.module('chatroom')
.factory('tictactoe', function(){
  return new TicTacToe();
});

// angular.module('chatroom')
// .factory('seabattle', function(){
// 	return new SeaBattle();
// })
