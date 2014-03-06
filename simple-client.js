var net = require('net');
var keypress = require('keypress');
keypress(process.stdin);

var host = '127.0.0.1';
var port = 1337;

var stdin = process.openStdin(); 
require('tty').setRawMode(true); 
var client = new net.Socket();
var ballId_caught;
var sender;
var players;
var myId;
var ballId = 1;
var powerUps = [];

var alreadyAppliedPowerUp = 0;
try{
var MacId =  process.argv[2];
client.connect(port, host, function () {

    console.log('CONNECTED TO: ' + host + ':' + port);

    console.log('   < Sending message >');
	    console.log('   { "dest":0, "msg": {"type" : "hello", "client" : "mobile", "platform" : "Node Smart Client","uniqueId" : ' + MacId + '} }');
        client.write('{ "dest":0, "msg": {"type" : "hello", "client" : "mobile", "platform" : "Node Smart Client", "uniqueId" :"' + MacId + '"} }');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function (data) {
    
    console.log('DATA: ' + data);
	try {
			var originalMessage = JSON.parse(data);
			var message = originalMessage.msg;
			if (message.type == "incoming" || message.type == "started" ) {
				ballId_caught = message.ballId;
				ballId = message.ballId;
				sender =message.sender;
				console.log('test id ' + ballId_caught);
			}
			else if(message.type =="newBall"){
					ballId = message.ballId;
			}
	} catch(err) {
		console.log(err);
	}
     });
    

   

stdin.on('keypress', function (chunk, key) {
  process.stdout.write('Get Chunk: ' + chunk + '\n');
  if (key && key.ctrl && key.name == 'c') process.exit();
  if( key.name == 'c') {
	console.log('   < Sending message >');
			        console.log('   { "dest":0, "msg": {"type" : "catch", "ballId" : '+ ballId + ', "sender" : ' + sender + '} }');
			        client.write('{ "dest":0, "msg": {"type" : "catch", "ballId" : '+ballId + ', "sender" : ' + sender + '} }');
			        alreadyAppliedPowerUp = data.indexOf('appliedPowerUps');
  }
  if( key.name == 't'){
	 console.log('   < Sending message >');
        			    var powerUpMsg = "";
        			    if(powerUps.length > 0 && alreadyAppliedPowerUp == -1) {
        			         powerUpMsg = ', "appliedPowerUps": { "type": "' + powerUps.pop() + '", "strength" : 1 } ';
        			    }
                  var speedMsg = ', "speed":' + Math.ceil(Math.random() * 100);
                  var throwTo = 1;
        			    console.log('   { "dest":0, "msg": {"type" : "throw", "ballId" : '+ ballId +', "recipient" : ' + throwTo + speedMsg + powerUpMsg + '} }');
        			    client.write('{ "dest":0, "msg": {"type" : "throw", "ballId" : '+ ballId +', "recipient" : ' + throwTo + speedMsg + powerUpMsg + '} }');

	}

});


// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});}catch(err)
		{
			console.log(err);
		}