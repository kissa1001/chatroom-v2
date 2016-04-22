var socket_io = require('socket.io');
var http = require('http');
var express = require('express');
var _ = require('underscore');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var userNames=[];

io.on('connection', function (socket) {
  console.log('Connection detected');
  socket.on('init', function(data){
    userNames.push(data.userName);
    socket.userName = data.userName;
    console.log(data.userName + ' connected');
    socket.emit('userNames', userNames);
    socket.broadcast.emit('userNames', userNames);
  });

  socket.on('send:message', function (data) {
    if (data.target) {
      targetSocket = _.findWhere(io.sockets.connected, {userName: data.target});
      if (targetSocket) {
        targetSocket.emit('send:privateMsg', {
          user: socket.userName,
          msg: data.message
        });
      }
    } else {
      socket.broadcast.emit('send:publicMsg', {
        user: socket.userName,
        msg: data.message
      });
      console.log(socket.userName + ' publicly said '+ data.message);
    }
  });

  socket.on('playRequest', function(data){
    if (data.target) {
      targetSocket = _.findWhere(io.sockets.connected, {userName: data.target});
      if (targetSocket) {
        targetSocket.emit('playRequest', data);
      }
    } 
    else {
      console.log('Error');
    }
  });
  socket.on('challengeAccepted', function(data){
    if (data.sender) {
      senderSocket = _.findWhere(io.sockets.connected, {userName: data.sender});
      if (senderSocket) {
        senderSocket.emit('challengeAccepted', data);
      }
    } 
    else {
      console.log('Error');
    }
    console.log(data.receiver + ' accepted challenge');
  })
  socket.on('challengeDeclined', function(data){
    if (data.sender) {
      senderSocket = _.findWhere(io.sockets.connected, {userName: data.sender});
      if (senderSocket) {
        senderSocket.emit('challengeDeclined', data);
      }
    } 
    else {
      console.log('Error');
    }
  })
  socket.on('players', function(data){
    socket.broadcast.emit('players', data);
    socket.emit('players', data);
  });
  socket.on('move', function(data){
    socket.broadcast.emit('move', data);
    socket.emit('move', data);
  });
  socket.on('disconnect', function(){
    console.log(socket.userName + ' disconnected');
    userNames = _.without(userNames, socket.userName);
    socket.emit('userNames', userNames);
    socket.broadcast.emit('userNames', userNames);
  });
});
server.listen(8080);
