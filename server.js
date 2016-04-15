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
    	userNames.push(data.name);
    	socket.name = data.name;
    	console.log(data.name + ' connected');
    	socket.emit('userNames', userNames);
    	socket.broadcast.emit('userNames', userNames);
    })

    socket.on('send:message', function (data) {
    	socket.broadcast.emit('send:message', {
      		user: name,
      		text: data.message
    	});
    	console.log(socket.name + ' said '+ data.message);
  	});

  	socket.on('disconnect', function(){
		console.log(socket.name + ' Disconnected');
		userNames = _.without(userNames, socket.name);
		socket.emit('userNames', userNames);
    	socket.broadcast.emit('userNames', userNames);
	});
});
server.listen(8080);