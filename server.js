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
    })
});
io.on('disconnect', function(socket){
	console.log('Disconnected');
	_.without(userNames, function(userName){
		if(userName === socket.name){
			return true;
		}
	})
});

server.listen(8080);