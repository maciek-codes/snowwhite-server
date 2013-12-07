var net = require('net'),
	querystring = require('querystring'),
	read = require('read'),
	os = require('os'),
	Client = require('./client')

var port = 1337;
var address = "0.0.0.0";

// Empty array of clients
var clients = [];

// Get networking interfaces and find ip address
var networkInterfaces = os.networkInterfaces();
var addressesToChoose = [];

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

		addressesToChoose.push(addressInfo.address);
	}
}

console.log("Availiable addresses: ");
var i = 1;
for(var addr in addressesToChoose)
{
	console.log(i +". " + addressesToChoose[addr])
	i++;
}

console.log("Press key to choose:");

read({ prompt : 'Choice: ' }, function (err, choice) {

	if(err) {
		return;
	}

	if(isNaN(choice) || choice < 1 || choice > addressesToChoose.length) {
		console.error("Wrong choice!");
		return;
	}
	process.stdin.destroy();
	address = addressesToChoose[choice-1];
	
	console.log("You chose: " + address);

	net.createServer(createServerCallBack).
		listen(port, address);

	console.log("Listening on " + address + " port " + port);
});

function createServerCallBack(socket)
{
	var clientAddress = socket.remoteAddress;
	var clientPort = socket.remotePort;

	console.log("Connected: " + clientAddress + ":" + clientPort);

	socket.on('data', function (rawdata) {

		var data = rawdata.toString();

		console.log("Data: " + data);

		try
		{
			var originalMessage = JSON.parse(rawdata);

			var messageDestination = originalMessage.dest;
			var sender = originalMessage.sender;
			var message = originalMessage.msg;

			if(messageDestination == 0) {
				// Message is to the server only

				if(message.type == "hello")
				{
					var clientType = message.client;

					// Remember this client
					clients.push(new Client(clientAddress, clientPort, clientType, socket));
					console.log(clients);

					// Send confirmation of successful registration
					socket.write("1");
				}
				return;

			} else if(messageDestination == 1) {

				// Send it to PC client
				var pcClient;
				for(var i = 0; i < clients.length; i++) {
					
					if(clients[i].type != "pc")
						continue;
					
					pcClient = clients[i];
					break;
				}

				pcClient.socket.write(JSON.stringify(originalMessage));

			} else if(messageDestination == -1) {
				
				// Send to EVERYONE
				for(var i = 0; i < clients.length; i++) {

					if(clients[i].type == "pc")
						continue;

					clients[i].socket.write(JSON.stringify(originalMessage));
				}

			} else {
				// Send it to mobile client
				clients[messageDestination].socket.write(JSON.stringify(originalMessage));
			}
		}
		catch(err)
		{
			console.log(err);
		}

	}).on('connect', function() {

		console.log(clients);

	}).on('close', function() {
		
		for(var i = 0; i < clients.length; i++) {
			if(clients[i].getAddress() == clientAddress && clients[i].getPort() == clientPort)
			{
				clients.splice(i, 1);
			}
		}

	}).on('error', function (err){
		console.log(err);
	});

}
