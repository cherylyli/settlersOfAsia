$(document).ready(function(){

	socket.emit('test', 'hello');

	socket.on('test', function(data){
		alert('works!');
	});


});