var Client = function Client(address, port, clientType, socket, id, arrayPos) {
	this.clientType = clientType;
	this.address = address;
	this.port = port;
	this.socket = socket;
	this.id = id;
	this.arrayPos = arrayPos;
};

Client.prototype.getAddress = function() {
	return this.address;
};


Client.prototype.getPort = function() {
	return this.port;
}

Client.prototype.getClientType = function() {
	return this.clientType;
}

Client.prototype.getSocket = function() {
	return this.socket;
}

Client.prototype.getId = function() {
	return this.id;
}

Client.prototype.getArrayPos = function() {
	return this.arrayPos;
}

Client.prototype.setArrayPos = function(pos) {
	this.arrayPos = pos;
}

module.exports = Client;