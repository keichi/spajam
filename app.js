var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.use(express.static(__dirname + '/public'));

io.on("connection", function (socket) {
	socket.on("tsukkomi", function (data) {
		console.log("tsukkomi")
		io.sockets.emit("tsukkomi", {type:"tsukkomi","uid":data.uid});
	});

	socket.on("disconnect", function () {
	});
});
