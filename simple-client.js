var net = require('net');
var keypress = require('keypress');
keypress(process.stdin);

var host = '192.168.3.1';
var port = 1337;

var stdin = process.openStdin(); 
require('tty').setRawMode(true); 
var client = new net.Socket();
try{

client.connect(port, host, function () {

    console.log('CONNECTED TO: ' + host + ':' + port);

    client.write('{ "dest":0, "msg": {"type" : "hello", "client" : "mobile", "platform" : "Android"} }');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function (data) {
    
    console.log('DATA: ' + data);
     });
    

   

stdin.on('keypress', function (chunk, key) {
  process.stdout.write('Get Chunk: ' + chunk + '\n');
  if (key && key.ctrl && key.name == 'c') process.exit();
  if( key.name == 'c')  client.write('{ "dest":0, "msg": {"type" : "catch", "sender" : 2} }');
  if( key.name == 't')  client.write('{ "dest":0, "msg": {"type" : "throw", "recipient" : 1} }');

});


// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});}catch(err)
		{
			console.log(err);
		}