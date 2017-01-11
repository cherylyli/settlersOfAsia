// dependencies
var _       = require("underscore");
var async   = require('async');
var _h      = require('../api/helper_functions.js');
var Uuid    = require('uuid');
var User    = require('../../models/user.js');
var notify  = require('../api/notify.js');

module.exports = function(socket, user, roomId) {

    // send to user
    function send(event, data){
        socket.emit(event, data);
        console.log(`[notify ${user.username}]`, event, data);
    }

    // receive from user
    function got(event, fn){
        socket.on(event, function(data){
            console.log(`[got from ${user.username}]`, event, data);
            fn(data);
        });
    }

    // send to everyone in current room
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

    got('LOL', function(){

    });



};