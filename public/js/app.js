angular.module('chatroom', ['btford.socket-io','ngAnimate']);

angular.module('chatroom')
.factory('socket', function (socketFactory) {
  return socketFactory();
});

angular.module('chatroom')
.factory('tictactoe', function(){
  return new TicTacToe();
});

