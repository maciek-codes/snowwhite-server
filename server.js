var net = require('net'),
	querystring = require('querystring'),
	Client = require('./client')

var port = 1337;
var address = "127.0.0.1";

// Empty array of clients
var clients = [];



net.createServer(function (socket)
{
	var client = socket.remoteAddress + ":" + socket.remotePort;

	console.log("Connected: " + client);

	socket.on('data', function (data) {

		console.log("Data: " + data);

		var clientData = JSON.parse(data);

		if(clientData.clientType != undefined)
		{
			var newClient = new Client(client, clientData.clientType);

			clients.push(newClient);
			console.log("I added " + newClient.getName() + " and it's a type " + newClient.getClientType());
		}

		socket.write("You said: " + data + " Thanks!");

	}).on('connect', function() {

		socket.write("Hi " + client);

		console.log(clients);

	}).on('close', function() {
		
		socket.write("Bye " + client.getName);
		clients.splice(clients.indexOf(client), 1);
		

	}).on('error', function (err){
		console.log("Error: " + err);
	});

}).listen(port, address);

