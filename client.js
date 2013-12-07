var Client = function Client(address, port, clientType, socket) {
	this.clientType = clientType;
	this.address = address;
	this.port = port;
	this.socket = socket;
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

module.exports = Client;