var net = require('net');
var keypress = require('keypress');
keypress(process.stdin);

var host = '192.168.173.1';
var port = 1337;

var stdin = process.openStdin(); 
require('tty').setRawMode(true); 
var client = new net.Socket();
var ballId_caught;
try{

client.connect(port, host, function () {

    console.log('CONNECTED TO: ' + host + ':' + port);

    client.write('{ "dest":0, "msg": {"type" : "hello", "client" : "mobile", "platform" : "Android"} }');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function (data) {
    
    console.log('DATA: ' + data);
	try {
			var originalMessage = JSON.parse(data);
			var message = originalMessage.msg;
			if (message.type == "incoming" || message.type == "started") {
				ballId_caught = message.ballId;
				console.log('test id ' + ballId_caught);

			}
	} catch(err) {
		console.log(err);
	}
     });
    

   

stdin.on('keypress', function (chunk, key) {
  process.stdout.write('Get Chunk: ' + chunk + '\n');
  if (key && key.ctrl && key.name == 'c') process.exit();
  if( key.name == 'c')  client.write('{ "dest":0, "msg": {"type" : "catch", "ballId" : ballId_caught, "sender" : 2} }');
  if( key.name == 't'){
	client.write('{ "dest":0, "msg": {"type" : "throw", "ballId" : '+ballId_caught+', "recipient" : 1} }');
	console.log('throw ball id ' + ballId_caught);

	}

});


// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});}catch(err)
		{
			console.log(err);
		}