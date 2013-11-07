var net = require('net');

var host = '127.0.0.1';
var port = 1337;

var client = new net.Socket();

client.connect(port, host, function () {

    console.log('CONNECTED TO: ' + host + ':' + port);

    client.write('{ "clientType" : "mobile" }');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function (data) {
    
    console.log('DATA: ' + data);
    
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});