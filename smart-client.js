var net = require('net');
var keypress = require('keypress');
keypress(process.stdin);

var host = '192.168.173.1';
var port = 1337;

var stdin = process.openStdin(); 
require('tty').setRawMode(true); 
var client = new net.Socket();

var players;
var myId;

try {

    client.connect(port, host, function () {
    
        console.log('CONNECTED TO: ' + host + ':' + port);
    
        client.write('{ "dest":0, "msg": {"type" : "hello", "client" : "mobile", "platform" : "Node Smart Client"} }');
    
    });
    
    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
    client.on('data', function (data) {
        
        console.log('DATA: ' + data);
        
    	try {
    	   
    			var originalMessage = JSON.parse(data);
    			var message = originalMessage.msg;
    			if (message.type == "incoming") {
    			 
    			    // Randomly decide whether to catch the ball
    			    var r = Math.random();
    			    if (r < 0.8) {
    			        client.write('{ "dest":0, "msg": {"type" : "catch", "ballId" : '+ message.ballId + ', "sender" : ' + message.sender + '} }');
    			    }
    			    
    			}
    			else if (message.type == "catchResult") {
    			 
    			    var throwTo;
    			    do {
    			        throwTo = players[Math.floor(Math.random() * (players.length - 0 + 1)) + 0];
    			    } while (throwTo.id == myId);
    			    client.write('{ "dest":0, "msg": {"type" : "throw", "ballId" : '+ message.ballId +', "recipient" : ' + throwTo.id + '} }');
    			    
    			}
    			else if (message.type == "newBall") {
    			 
    			    var throwTo;
    			    do {
    			        throwTo = players[Math.floor(Math.random() * (players.length - 0 + 1)) + 0];
    			    } while (throwTo.id == myId);
    			    client.write('{ "dest":0, "msg": {"type" : "throw", "ballId" : '+ message.ballId +', "recipient" : ' + throwTo.id + '} }');
    			    
    			}
    			else if (message.type == "update" || message.type == "ready") {
    			 
    			    players = message.players;
    			 
    			}
    			else if (message.type == "helloResult") {
    			 
    			    myId = message.clientId;
    			 
    			}
    			
    	} catch(err) {
    		console.log(err);
    	}
    });
        
    
    // Add a 'close' event handler for the client socket
    client.on('close', function() {
        console.log('Connection closed');
    });
    
    // Picks up Ctrl+C keypress to quit client with disconnect message
    stdin.on('keypress', function (chunk, key) {
        
          if (key && key.ctrl && key.name == 'c') {
    		   client.write('{ "dest" : 0,  "msg" : { "type" : "goodbye" } }');
               process.exit();
          }
        
    });
    
}


catch(err) {
    
    console.log(err);
    
}