var net = require('net'),
	querystring = require('querystring'),
	read = require('read'),
	os = require('os'),
	Client = require('./client')

var port = 1337;
var address = "0.0.0.0";

// Empty array of clients
var clients = [];
var mobileClientCount = 0;

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

	// Don't timeout
	socket.setKeepAlive(true);

	// Disable "Nagle" algorithm for buffering
	socket.setNoDelay(true);

	// Set encoding to ASCII
	socket.setEncoding("ascii");

	socket.on('data', function (rawdata) {
		
		var data = rawdata.toString();
		
		try {

			var originalMessage = JSON.parse(rawdata);
			var messageDestination = originalMessage.dest;
			var message = originalMessage.msg;

			if(messageDestination == 0) {
				// Message is to the server only

				if(message.type == "hello") {
					var clientType = message.client;
					var nextIndex = clients.length + 1;

					var clientId = -1;

					if(clientType == "pc") {
						clientId = 1;
					} else {

						var takenIds = [];

						for(var i = 0; i < clients.length; ++i) {
							if(clients[i].getClientType() != "mobile")
								continue;

							takenIds.push(clients[i].getId());
						}

						var desiredId = 2;

						while(clientId < 0) {

							// This id is free, take it
							if(takenIds.indexOf(desiredId) == -1) {
								clientId = desiredId;
							} else {
								desiredId++;
							}
						}
					}


					var newClientObj = new Client(clientAddress, clientPort, clientType, socket, 
						clientId, nextIndex);

					// Add new client to the array
					var newLength = clients.push(newClientObj);
					
					// Print out new clients
					console.log("Connected new client with id " + newClientObj.getId() +
						" of type " + newClientObj.getClientType() +
						" address: " + newClientObj.getAddress() + " on port: " + newClientObj.getPort());

					// Send confirmation of successful registration
					if(clientType == "mobile") {
						var response = {
							dest: clientId,
							sender: 0,
							msg : {
								type: "yourId",
								id: clientId
							}
						};

						socket.write(JSON.stringify(response));
					}
				}
				return;

			} else if(messageDestination == 1) {

				// Send it to PC client
				var pcClient;

				for(var i = 0; i < clients.length; i++) {
					
					if(clients[i].getClientType() != "pc")
						continue;
					
					pcClient = clients[i];
					break;
				}

				if(pcClient === undefined) {
					console.error("PC client must be connected.");
					return;
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
				var currenClient = clients[arrayPos.getArrayPos()];
				currenClient.socket.write(JSON.stringify(originalMessage));
			}
		}
		catch(err)
		{
			console.log(err);
		}
	}).on('connect', function() {

	}).on('close', function() {
		
		var clientId = -1;
		for(var i = 0; i < clients.length; i++) {
			if(clients[i].getAddress() == clientAddress && clients[i].getPort() == clientPort) {
				clientId = i;
			}
		}

		if(clientId >= 0 && clientId < clients.length) {

			// Log disconnecting client
			console.log("Client with id " + clientId + " disconnected.");

			// Decrement position in array of elements after this client id
			for(var i = clientId; i < clients.length; ++i) {
				var oldPosition = clients[i].getArrayPos();
				oldPosition--;
				clients[i].setArrayPos(oldPosition);
			}

			// Remove client from the array
			clients.splice(clientId, 1);
		}

	}).on('error', function (err){
		console.log(err);
	});
}

