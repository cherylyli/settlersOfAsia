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
        socket.on(event, function(data){
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
    

    // wait till both socket + my data are ready
    async.parallel([
	    function(callback) {
	        socket.on('connect', function(){
		    	callback(null);
		    });
	    },
	    function(callback) {
	        $(window).on('imready', function(im){
		    	callback(null, im.myObj);
		    });
	    }
	],

	// join room with his own username
	function(err, results) {
	    var me = results[1];
	    sock.emit('join-room', me.username);
	});



})();

