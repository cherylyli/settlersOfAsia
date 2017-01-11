// load up dependencies
var _ = require('underscore');


// ------------------- helper functions -------------------

// debug




var notify = {

	// send to user, given user id (support array)
	user: function (users, event, data){
		users = _.isArray(users) ? users : [users];
		users.forEach(function(username){
			io.to(username).emit(event, data);
		});
		console.log(`[notify ${users.join(', ')	}]`, event, data);
	},

	// send to room, give room id (support array)
	room: function (room, event, data){
		io.to(room).emit(event, data);
		console.log(`[notify room ${room}]`, event, data);
	}



};


// export our module
module.exports = notify;