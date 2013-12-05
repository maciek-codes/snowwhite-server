var net = require('net'),
	querystring = require('querystring'),
	Client = require('./client')

var port = 1337;
var address = "0.0.0.0";

// Empty array of clients
var clients = [];

var os = require( 'os' );

// Get networking interfaces and find ip address
var networkInterfaces = os.networkInterfaces();
for(var inter in networkInterfaces)
{
	var indexes = networkInterfaces[inter];

	// Each interface might have two addresses
	for(var index in indexes)
	{
		var addressInfo = networkInterfaces[inter][index];

		// Ignore IPv6 and internal adapters
		if(addressInfo.family != 'IPv4' || addressInfo.internal == true)
			continue;

		// For now assume address begins with this:
		if(addressInfo.address.substring(0,7) != "192.168")
			continue;

		address = addressInfo.address;
	}
}

net.createServer(function (socket)
{
	var client = socket.remoteAddress + ":" + socket.remotePort;

	console.log("Connected: " + client);

	socket.on('data', function (rawdata) {

		var data = rawdata.toString('utf-8');

		console.log("Data: " + data);

		try
		{
			var clientData = JSON.parse();

			if(clientData.clientType != undefined)
			{
				var newClient = new Client(client, clientData.clientType);

				clients.push(newClient);
				console.log("I added " + newClient.getName() + " and it's a type " + newClient.getClientType());
			}
			socket.write(1);
		}
		catch(err)
		{
			console.log(err);
		}

	}).on('connect', function() {

		console.log(clients);

	}).on('close', function() {
		
		socket.write("Bye " + client.getName);
		clients.splice(clients.indexOf(client), 1);
		

	}).on('error', function (err){
		console.log(err);
	});

}).listen(port, address);

console.log("Listening on " + address + " port " + port);
