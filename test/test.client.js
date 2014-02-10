var assert = require('assert'),
	Client = require('./../client.js');


describe("Client", function () {
	
	var testName = "129.123.023.001:3000";
	var type = "mobile";

	var testClient = new Client(testName, type);

	it('should have name', function(){

		assert.equal(testName, testClient.getName());
	});

	it('should have type', function() {
		assert.equal(type, testClient.getClientType());
	});
});