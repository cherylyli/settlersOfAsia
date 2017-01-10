// dependencies
var _       = require("underscore");
var async   = require('async');
var _h      = require('../api/helper_functions.js');
var Uuid    = require('uuid');
var User    = require('../../models/user.js');
var notify  = require('../api/notify.js');

module.exports = function(socket, user, roomId) {

    // send to current socket
    function send(event, data){
        socket.emit(event, data);
    }

    // send to current room
    function sendRoom(event, data){
        notify.room(roomId, event, data);
    }

    // - Send to specific user / array of users
    // notify.user('Jack', 'ADD_POINT', { point: 2 });
    // notify.user(['Jack', 'Emol', 'Max'], 'ADD_POINT', { point: 1 });

    // - Send to specific room
    // notify.room('123', 'SET_WINNER', { username: 'Emol' });


    /**
     *  All stuffs below will be called when a socket joins a room.
     *  socket : underlying socket object that's connected to this room
     *  user   : underlying user object
     *  roomId : current room socket is connected to
     */

    send('JOIN_ROOM_SUCCESS', 'welcome to room ' + roomId);




};