var net = require('net');
var keypress = require('keypress');
keypress(process.stdin);

var host = '192.168.1.20'; //'192.168.1.5'; /*Replace with '127.0.0.1' for localhost*/
var port = 1337;

var stdin = process.openStdin();
require('tty').setRawMode(true);
var client = new net.Socket();

var players;
var myId;
var powerUps = [];

var alreadyAppliedPowerUp = 0;

function processMessage(data) {

	try {

			var originalMessage = JSON.parse(data);
			var message = originalMessage.msg;

	        if(message.type != "isalive") {

	           console.log("< Processing message >");
	           console.log(data);

	        }

			if (message.type == "incoming") {

			    // Randomly decide whether to catch the ball
			    var r = Math.random();
			    if (r < 0.7) {
			        setTimeout(function() {

  			           console.log('   < Sending message >');
  			           console.log('   { "dest":0, "msg": {"type" : "catch", "ballId" : ' + message.ballId +  ', "tag" : "' + message.catchLocation  + '", "sender" : ' + message.sender + '} }');
  			           nextTag = message.catchLocation;
  			           client.write('{ "dest":0, "msg": {"type" : "catch", "ballId" : ' + message.ballId +  ', "tag" : "' + message.catchLocation + '", "sender" : ' + message.sender + '} }');
  			           alreadyAppliedPowerUp = data.indexOf('appliedPowerUps');
			        }, Math.random() * 1000);
			    }

			}
			else if (message.type == "catchResult") {

			    if(message.result == 1) {
			        var throwTo;
    			    do {
    			        throwTo = players[Math.floor(Math.random() * (players.length))];
    			    } while (throwTo.id == myId);
    			    setTimeout(function() {
        			    console.log('   < Sending message >');
        			    var powerUpMsg = "";
        			    if(powerUps.length > 0 && alreadyAppliedPowerUp == -1) {
        			         powerUpMsg = ', "appliedPowerUps": { "type": "' + powerUps.pop() + '", "strength" : 1 } ';
        			    }
                        var speedMsg = ', "speed":' + Math.ceil(Math.random() * 100);
        			    console.log('   { "dest":0, "msg": {"type" : "throw", "ballId" : '+ message.ballId +', "recipient" : ' + throwTo.id + speedMsg + powerUpMsg + '} }');
        			    client.write('{ "dest":0, "msg": {"type" : "throw", "ballId" : '+ message.ballId + ', "recipient" : ' + throwTo.id + speedMsg + powerUpMsg + '} }');
                    }, Math.random() * 5000);
			    }

			}
			else if (message.type == "awardedPowerUp") {

			    powerUps.push(message.powerUp);

			}
			else if ((message.type == "newBall" && message.id == myId) || (message.type == "started" && message.startPlayer == myId)) {

			    var throwTo;
			    do {
			        throwTo = players[Math.floor(Math.random() * (players.length))];
			    } while (throwTo.id == myId);
          setTimeout(function() {
              console.log('   < Sending message >');
              var speedMsg = ', "speed":' + Math.ceil(Math.random() * 100);
              console.log('   { "dest":0, "msg": {"type" : "throw", "ballId" : '+ message.ballId +', "recipient" : ' + throwTo.id + speedMsg + '} }');
              client.write('{ "dest":0, "msg": {"type" : "throw", "ballId" : '+ message.ballId +', "recipient" : ' + throwTo.id + speedMsg + '} }');
                }, Math.random() * 5000);

			}
			else if (message.type == "update" || message.type == "ready") {

			    players = message.players;
			    console.log("< Player update >");
			    console.log(players);

			}
			else if (message.type == "removedFromGame") {
			    process.exit();
			}
			else if (message.type == "helloResult") {

			    myId = message.clientId;

			}

	} catch(err) {
		console.log(err);
	}
}


try {

	var MacId = Math.floor(Math.random() * (10000000000000));
    client.connect(port, host, function () {

      console.log('< Connected to ' + host + ':' + port + ' >');
      console.log('   < Sending message >');

      var icon =  Math.floor(Math.random()*10);
      var name =  "Sir Example " + icon;

      var message = {
        dest: 0,
        msg: {
          type: "hello",
          client: "mobile",
          platform: "Node Smart Client",
          uniqueId: MacId.toString()
        }
      };
      
      var messageString = JSON.stringify(message);

	    console.log("Sending hello: " + messageString);
      client.write(messageString);
    });

    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
    client.on('data', function (data) {

        //console.log('DATA: ' + data);

        var ii;

        var brackets = 0;
        var string = '';

        var dString = data.toString();

        for(ii=0; ii<dString.length; ii++) {
            string += dString.charAt(ii);
            if(dString.charAt(ii) == '{') brackets++;
            if(dString.charAt(ii) == '}') brackets--;
            if(brackets == 0) {
                processMessage(string);
                string = '';
            }
        }
    });

    // Add a 'close' event handler for the client socket
    client.on('close', function() {
        console.log('Connection closed');
    });

    // Picks up Ctrl+C keypress to quit client with disconnect message
    stdin.on('keypress', function (chunk, key) {
      if (key) {
        if (key.name == 'g') {
          console.log('< Sending message >');
          console.log('{ "dest" : 0,  "msg" : { "type" : "goodbye" } }');
          client.write('{ "dest" : 0,  "msg" : { "type" : "goodbye" } }');
          //process.exit();
        } else if(key.name == 's') {
          console.log('< Sending message >');
          console.log('{ "dest" : 0,  "msg" : { "type" : "startGame" } }');
          client.write('{ "dest" : 0,  "msg" : { "type" : "startGame" } }');
        } else if (key.ctrl && key.name == 'c') {
    		  process.exit();
    	  }
      }
    });

}


catch(err) {

    console.log(err);

}
