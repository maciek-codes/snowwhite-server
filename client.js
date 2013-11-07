var Client = function Client(name, clientType) {
	this.clientType = clientType;
	this.clientName = name;
};

Client.prototype.getName = function() {
	return this.clientName;
};

Client.prototype.getClientType = function() {

	return this.clientType;
}

module.exports = Client;