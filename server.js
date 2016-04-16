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
    })

    socket.on('send:message', function (data) {
    	socket.broadcast.emit('send:message', {
      		user: socket.userName,
      		msg: data.message
    	});
    	console.log(socket.userName + ' said '+ data.message);
  	});

  	socket.on('disconnect', function(){
		  console.log(socket.userName + ' disconnected');
		  userNames = _.without(userNames, socket.userName);
		  socket.emit('userNames', userNames);
    	socket.broadcast.emit('userNames', userNames);
	});
});
server.listen(8080);