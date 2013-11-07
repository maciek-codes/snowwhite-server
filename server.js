var net = require('net'),
	querystring = require('querystring');

var port = 1337;
var address = "127.0.0.1";


net.createServer(function (socket)
{
	console.log("Created socket at: " + socket.remoteAddress + ":" + socket.remotePort);

	socket.on('data', function (data) {

		console.log("Data: " + data);

		socket.write("You said: " + data + " Thanks!");

	}).on('connect', function(){

		socket.write("Hi!");

	}).on('close', function() {

		console.log("Done");

	}).on('error', function (err){
		console.log("Error: " + err);
	});

}).listen(port, address);

