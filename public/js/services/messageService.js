angular.module('chatroom')
.service('messageService',['socket', function(socket){
  this.messages = [];
  this.sendPublic = function(message){
    socket.emit('message:public', {
      msg: message
    });
  }
  this.sendPrivate = function(receiver,message){
    socket.emit('message:private', {
      msg: message,
      target: receiver
    });
  }
    var msgService = this;
    socket.on('message:public', function (message) {
      msgService.messages.push({msg: '/p ' + message.msg, sender: message.sender, whisper: false, time: new Date().toString()});
    });
    socket.on('message:private', function(message){
      msgService.messages.push({msg: '/w to '+ message.target + ': ' + message.msg, sender: message.sender,target:message.target, whisper: true, time: new Date().toString()});
    })
}]);