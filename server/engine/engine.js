// all the commands user can make during game is defined here!
// By commands I mean system input and output message defined in environment
// This is based on environment and operation model


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



    //--------------------------------Commands---------------------------------------

    got(CREATE)
    got(LOAD_SAVED_GAME, function () {

    })

    got(CREAT_NEW_GAME, function () {
        
    })
    
    
    got('TradeRequest', function () {
        let playersAcceptOffer = [];
        //send to other players in your room
        let otherPlayersInRoom = []; //TODO: write a helper method to send messages to the rest ppl in the room

        let trade = {'offer':[], 'request':[], 'requester': user.username};
        notify(otherPlayersInRoom, 'TradeRequest', trade);
        let repliedNum = 0;

        got('TradeAccept', function (accept) {
            repliedNum ++;
            if (accept) playersAcceptOffer.push(user.username);
            if (repliedNum == otherPlayersInRoom.length) notify.user(trade.requester, 'TradeRequest', playersAcceptOffer);
        })
    })


};