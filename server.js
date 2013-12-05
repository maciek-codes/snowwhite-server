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
	var client = socket.remoteAddress + ":" + socket.remotePort;

	console.log("Connected: " + client);

	socket.on('data', function (rawdata) {

		var data = rawdata.toString();

		console.log("Data: " + data);

		try
		{
			var clientData = JSON.parse(rawdata);

			if(clientData.clientType != undefined)
			{
				var newClient = new Client(client, clientData.clientType);

				clients.push(newClient);
				console.log("I added " + newClient.getName() + " and it's a type " + newClient.getClientType());
			}
			socket.write("1");
		}
		catch(err)
		{
			console.log(err);
		}

	}).on('connect', function() {

		console.log(clients);

	}).on('close', function() {
		
		//socket.write("Bye " + client.getName);
		console.log(client);
		clients.splice(clients.indexOf(client), 1);
		

	}).on('error', function (err){
		console.log(err);
	});

}
