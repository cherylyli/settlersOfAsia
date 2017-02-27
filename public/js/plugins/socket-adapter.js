// self-made adapter for socket.io
(function(){

	// export module
	window.sock = {};

	// underlying socket
    var socket = io();

    // duck-typing check if object is room
    function isRoom(room){
        if (!_.isObject(room)) return false;
        var fields = ['users', 'id', 'state', 'owner'];
        for (var i=0; i<fields.length; i++){
            if (_.isUndefined(room[fields[i]])) return false;
        }
        return true;
    }

    // socket connected
    socket.on('connect', function(){
    	// socket id
    	sock.id = socket.id;
        console.log('[Socket] connected. ID:', sock.id);
    });

    // receive data 
    sock.on = function(event, fn){
        socket.on(event, function(data){
            // parse data
            if (_.isString(data)) data = CircularJSON.parse(data);
            // if data is room object, do additional operation
            if (isRoom(data)) {
                data = update(data);
            }
            // return data
            console.log('[Socket] got', event, data);
            fn(data);
        });
    };

    // emit data
    sock.emit = function(event, data){
    	socket.emit(event, data);
        console.log('[Socket] send', event, data);
    };

    // disconnect
    sock.disconnect = function(){
    	socket.disconnect();
        console.log('[Socket] disconnected.');
    };

    // original socket object
    sock.raw = socket;

    // when page closes, disconnect socket
    window.onbeforeunload = function(e){
        sock.emit('disconnect');
    };




})();

