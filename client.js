var Client = function Client(name, clientType) {
	this.clientType = clientType;
	this.clientName = name;

	this.getClientType = function() {

		return this.clientType;
	}

	this.getName = function() {
		return this.clientName;
	}
};

module.exports = Client;