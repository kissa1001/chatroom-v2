angular.module('chatroom')
.service('userListService',['socket', function(socket){
  this.users = [];
  this.query =  function(){
    socket.emit('user:queryList');
  }
  var service=this;
  socket.on('user:list', function(data){
    service.users = data;
  })
  this.whisper = false;
}]);