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
let fs = require("fs");

let DATA = require('./Data.js');
let Commands = require('./Commands.js');

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







    //-----------------------------Room, game config-------------------------------

    //User joins room.
    //There is no createRoom event, just check roomId.
    //If there is a #roomId room exist (and able to join), joins the room
    //If there is the room does not exist, create the room, player becomes the owner of the room, and are asked to specify the map parameters.


    if(DATA.existRoom(roomId)){
        let room = Commands.joinRoom(user, DATA.getRoom(roomId));
        send('JOIN_ROOM_SUCCESS', room);
    }

    //create new room
    else{

        //Data format for MAP_CONFIG:
        //{savedGameID: String, scenario:Sting}
        //Either savedGameID or scenario is undefined
        got('MAP_CONFIG', function (data) {
            let room = Commands.makeNewRoom(user, roomId, data.savedGameID, data.scenario);
            Commands.startGame(room);
            fs.writeFile("match.json", JSON.stringify(room), function (err) {
                if (err) throw err;
            })
            send('JOIN_ROOM_SUCCESS', room);
        });
    }







    //--------------------------------Commands---------------------------------------
/**
    got(CREATE)
    got(LOAD_SAVED_GAME, function () {

    })

    got(CREAT_NEW_GAME, function () {
        
    })
    /**
    
    got('TradeRequest', function () {
        let playersAcceptOffer = [];
        //send to other players in your room
        let otherPlayersInRoom = []; //TODO: write a helper method to send messages to the rest ppl in the room

        let trade = {'offer':[], 'request':[], 'requester': user.username};
        notify(otherPlayersInRoom, 'TradeRequest', trade);
        let repliedNum = 0;
/**
        got('TradeAccept', function (accept) {
            repliedNum ++;
            if (accept) playersAcceptOffer.push(user.username);
            if (repliedNum == otherPlayersInRoom.length) notify.user(trade.requester, 'TradeRequest', playersAcceptOffer);
        })
    })**/


};