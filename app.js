var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

#server.listen(80);
server.listen(3000);

app.use(express.static(__dirname + '/public'));

io.sockets.on("connection", function (socket) {
	socket.on("tsukkomi", function (data) {
		console.log("tsukkomi");
		io.sockets.emit("tsukkomi", {type:"tsukkomi","uid":data.uid});
	});

	socket.on("disconnect", function () {
	});
});
	
