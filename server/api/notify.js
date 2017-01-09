// load up dependencies
var User = require('../../models/user.js');
var Notification = require('../../models/notification.js');
var _ = require('underscore');
var _h = require('../api/helper_functions.js');



// send to 1 user (given user id)
function emitUser(userId, event, data){
	GetSocketIds(userId, function(ids){
		_.each(ids, function(id){
			io.of('/').in(id).emit(event, data);
		});
	});
}


// send to 1 room (given socket/room id)
function emitRoom(room, event, data){
	io.of('/').in(room).emit(event, data);
}

// send to 1 or many users
function sendUser(users, event, data){
	users = _.isArray(users) ? users : [users];
	users.forEach(function(id){
		emitUser(id, event, data);
	});
}


// send to 1 or many rooms
function sendRoom(rooms, event, data){
	rooms = _.isArray(rooms) ? rooms : [rooms];
	rooms.forEach(function(id){
		emitRoom(id, event, data);
	});
}





var notify = {

	// send to user, given user id (support array)
	user: sendUser,

	// send to room, give socket/room id (support array)
	room: sendRoom,

	// send to all online sockets 
	allOnline: function(event, data){
		GetOnlineSockets(function(map){
			var sockets = _.keys(map);
			sendRoom(sockets, event, data)
		});
	},

	// send to all tutors
	tutors: function(email, sms){
		User.fetchAllTutors(null, ['_id', 'phone', 'email'], function(users){
			_.each(users, function(userData, userId){
				var email = userData.email;
				var phone = userData.phone;
				// send email + sms here ...
			});
        });
	}



};


// export our module
module.exports = notify;