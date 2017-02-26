// self-made adapter for socket.io
(function(){

	// export module
	window.sock = {};

	// underlying socket
    var socket = io();

    // socket connected
    socket.on('connect', function(){
    	// socket id
    	sock.id = socket.id;
        console.log('[Socket] connected. ID:', sock.id);
    });

    // receive data
    sock.on = function(event, fn){
        socket.on(event, function(data1, data2){
            console.log('[Socket] got', event, data1, data2);
            fn(data1, data2);
        });
    };

    // emit data
    sock.emit = function(event, data1, data2){
    	socket.emit(event, data1, data2);
        console.log('[Socket] send', event, data1, data2);
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

