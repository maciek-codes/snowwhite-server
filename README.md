Snowwhite Game Server
=====================

Game server for Snow White game.

It handles socket connections between mobile clients and a PC client managing big display.


Installation
------------

It requires node.js (v.0.8.x) and npm. Clone the repository and call

`npm install`

Running
-------
You can start the server using
`npm start`

There is a simple client included to test socket connection. You can run it by calling
`node simple-client.js`


TODO
====

* Send JSON message from anroid to register mobile client
* Automatically connect to adhoc network
* INTEGRATE BRANCHES
* Send shakes


Gamek:

	class Gesture 
	{
		abstract serialie();
	}

	class Shake extends Gesture()
	{

	}

	Gesture gestureCaptures = GestureDetector.getGesture();


	void sendGesture(Gesture gesture)
	{
		output.write(gesture.serialize());
	}