// dependencies
var _ = require("underscore");




// socket connected
io.on('connection', function (socket) {

    socket.on('test', function(data){
    	console.log('received:', data);
    	socket.emit('test', data);
    });




});