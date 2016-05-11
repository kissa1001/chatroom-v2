angular.module('chatroom')
.service('userService',['socket', function(socket){
  this.user = {};
  var self = this;
  this.join = function(userName){
    socket.emit('user:join',{userName:userName});
  };
  socket.on('user:join', function (data) {
    self.user.name = data.userName;
    self.user.loggedIn = true;
  });
}]);