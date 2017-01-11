// dependencies
var _ = require("underscore");
var engine = require('./engine/engine.js');



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
    // get underlying user
	var user = socket.user;
	if (!user) return debug('can not connect, must log in');
	debug(`user ${user.username} connected, id: ${socket.id}`);

    // his username
	var username = user.username;

    // when a socket connects, he'll join a room of his username by default,
    // this is such that we can send him event using his username, instead of socket id
    socket.join(username);


    // ---------------------- Game stuffs ----------------------

	// join room
	socket.on('JOIN_ROOM', function(roomId){
        if (socket.room == roomId) return;
        // set his current room
		socket.join(roomId, function(){
			socket.room = roomId;
            // start the game engine for this socket
            engine(socket, user, roomId);
			debug(`${username} joined room ${socket.room}`);
		});
	});

	// leave room
	function leaveRoom(){
        if (!socket.room) return;
		socket.leave(socket.room, function(){
			debug(`${username} left room ${socket.room}`);
            socket.room = null;
		});
	}

	// socket disconnect, leave room
	socket.on('disconnect', function(){
		debug(`${username} disconnected`);
		leaveRoom();
	});

	// explicitly leave room
    socket.on('LEAVE_ROOM', leaveRoom);





});



