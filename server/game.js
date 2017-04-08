// dependencies
var _ = require("underscore");
var engine = require('./engine/engine.js');
let User = require('./engine/gameLogic/User.js');
var notify  = require('./api/notify.js');
let Commands = require('./engine/Commands.js');

// ------------------- helper functions -------------------

// debug
function debug() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift("[socket.io]");
    console.log.apply(this, args);
};


// ------------------------ models ------------------------


// ------------------------ socket ------------------------

// when a socket is connected
io.on('connection', function (socket) {
    // get underlying user
    var user = socket.user;
    if (!user) return debug('can not connect, must log in');
    debug(`user ${user.username} connected, id: ${socket.id}`);

    //add more attribute to user.
    User.createUser(user);

    // his username
    var username = user.username;

    // when a socket connects, he'll join a room of his username by default,
    // this is such that we can send him event using his username, instead of socket id
    socket.join('user:' + username);


    // ---------------------- Game stuffs ----------------------


    // join room
    socket.on('JOIN_ROOM', function (roomId) {
        if (socket.room == roomId) return;
        // set his current room
        socket.join(roomId, function () {
            socket.room = roomId;
            debug(`${username} joined room ${socket.room}`);
            // start the game engine for this socket
            engine(socket, user, roomId);
        });
    });

    // leave room
    function leaveRoom() {
        if (!socket.room) return;
        socket.leave(socket.room, function () {
            debug(`${username} left room ${socket.room}`);
            // FIXME: leave room
            // Commands.leaveRoom(username, socket.room);
            socket.room = null;
        });
    }

    // socket disconnect, leave room
    socket.on('disconnect', function () {
        debug(`${username} disconnected`);
        leaveRoom();
    });

    // explicitly leave room
    socket.on('LEAVE_ROOM', leaveRoom);

    


    // player chat
    socket.on('send-message', function(msgObj){
        msgObj.user = username;
        notify.room(socket.room, 'receive-message', msgObj);
    });

    // system message
    socket.on('send-sys-message', function(msgObj){
        msgObj.user = username;
        notify.room(socket.room, 'receive-sys-message', msgObj);
    });

});



