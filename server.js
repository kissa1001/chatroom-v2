var socket_io = require('socket.io');
var http = require('http');
var express = require('express');
var _ = require('underscore');
var UserManager = require('./usermanager.js');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var userNames=[];
var usermanager = new UserManager();


io.on('connection', function (socket) {
  console.log('Connection detected');
  socket.on('user:join', function(data){
    var usersocket = usermanager.addUser(data.userName, socket);
    if (!usersocket) {
       socket.emit('user:error');
    } else {
      socket.emit('user:join', {userName:usersocket.userName});
      io.sockets.emit('user:list', usermanager.getNames());
    }
  });

  socket.on('user:queryList', function(){
    socket.emit('user:list', usermanager.getNames());
  });

  socket.on('message:public', function(data){
      console.log(data);
      io.sockets.emit('message:public', {
        sender: socket.userName,
        msg: data.msg
      });
  });

  socket.on('message:private', function (data){
      targetSocket = usermanager.getUser(data.target);
      if (targetSocket) {
        var message = {
          sender: socket.userName,
          msg: data.msg,
          target: data.target
        };
        targetSocket.emit('message:private', message);
        socket.emit('message:private', message);
      }
  });

  socket.on('game:request', function(data){
    var targetSocket = usermanager.getUser(data.target);
    if (targetSocket) {
      targetSocket.emit('game:request', data);
    } else {
      console.log('Game Request Error');
      socket.emit('game:request:error');
    }
  });
  socket.on('game:accept', function(data){
      senderSocket = usermanager.getUser(data.sender);
      if (senderSocket) {
        senderSocket.emit('game:accept', data);
      } else {
        console.log('Game Accept Error');
        socket.emit('game:accept:error');
      }
  });

  socket.on('game:decline', function(data){
      senderSocket = usermanager.getUser(data.sender);
      if (senderSocket) {
        senderSocket.emit('game:decline', data);
      }
      else {
        socket.emit('game:decline:error');
        console.log('Game Decline Error');
      }
  });

  socket.on('game:players', function(data){
    io.sockets.emit('game:players', data);
  });

  socket.on('game:move', function(data){
    io.sockets.emit('game:move', data);
  });

  socket.on('disconnect', function(){
    usermanager.removeUser(socket);
    io.sockets.emit('user:list', usermanager.getNames());
  });
});
server.listen(process.env.PORT || 8080);
