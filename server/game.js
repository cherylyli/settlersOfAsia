// dependencies
var _ = require("underscore");




// ------------------- helper functions -------------------

// debug 
function debug(){
	var args = Array.prototype.slice.call(arguments);
	args.unshift("[socket.io]");
	console.log.apply(this, args);
};




// ------------------------ models ------------------------

var rooms = {

};




// ------------------------ socket ------------------------

// when a socket is connected
io.on('connection', function(socket){
	var user = socket.user;
	if (!user) return debug('can not connect, must log in');
	debug(`user ${user.username} connected, id: ${socket.id}`);

	var username = user.username;

	// join room
	socket.on('join-room', function(roomId){
		socket.join(roomId, function(){
			socket.room = roomId;
			debug(`${username} joined room ${socket.room}`);
		});
	});

	// leave room
	function leaveRoom(){
		socket.leave(socket.room, function(){
			debug(`${username} left room ${socket.room}`);
		});
	}


	// socket disconnect, leave room
	socket.on('disconnect', function(){
		debug(`${username} disconnected`);
		leaveRoom();
	});

	// explicitly leave room
    socket.on('leave-room', leaveRoom)

});



