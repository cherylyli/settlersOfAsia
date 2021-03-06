// all the commands user can make during game is defined here!
// By commands I mean system input and output message defined in environment
// This is based on environment and operation model


// dependencies
var _       = require("underscore");
var async   = require('async');
var _h      = require('../api/helper_functions.js');
var Uuid    = require('uuid');
var User    = require('../../models/user.js');
var Game    = require('../../models/game.js');
var notify  = require('../api/notify.js');
var fs = require("fs"); // Has to be installed first with “npm install fs”
let CircularJSON = require('circular-json');
let testGame = require('../testGames.js');
// let fakeRoom = require('../test.js');


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

    // send to everyone in current room, except sender
    function broadcast(event, data){
        socket.broadcast.to(roomId).emit(event, data);
        console.log(`[broadcast room ${roomId}]`, event, data);
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

    /**
     * TODO: for now all the command just send the whole room object back.
     * May change this later (if I am still willing to refactor the code then):P
     */


    //User joins room.
    //There is no createRoom event, just check roomId.
    //If there is a #roomId room exist (and able to join), joins the room
    //If there is the room does not exist, create the room, player becomes the owner of the room, and are asked to specify the map parameters.


    if(DATA.existRoom(roomId)){
        Commands.joinRoom(user, roomId);
        let cloneRoom = _.clone(DATA.getRoom(roomId));
        cloneRoom['newUser'] = user.username;
        result = CircularJSON.stringify(cloneRoom);

        // TODO: TESTING!!!
        send('JOIN_ROOM_SUCCESS', result);
       // send('JOIN_ROOM_SUCCESS', CircularJSON.stringify(fakeRoom.room));
       //  sendRoom('GAME_START', CircularJSON.stringify(fakeRoom.room));



        //notify other users in the room about the new player
        // TODO: TESTING!!
        broadcast('NEW_PLAYER_JOINED', result);

        //if now we have 4 players, game start
        console.log(Object.keys(DATA.getRoom(roomId).users).length);
        if(Object.keys(DATA.getRoom(roomId).users).length == 3){
            let currentPlayer = Commands.startGame(roomId);
            result = CircularJSON.stringify( DATA.getRoom(roomId));
            sendRoom('GAME_START', result);
            // sendRoom('GAME_START', CircularJSON.stringify(fakeRoom.room));


            notify.user(currentPlayer, 'TAKE_TURN');

        }
    }

    //create new room
    else{


        //Data format for MAP_CONFIG:
        //{savedGameID: String, scenario:Sting}
        //Either savedGameID or scenario is undefined
        got('MAP_CONFIG', function (data) {
            if (!_.isObject(data)) return;

            let room = Commands.makeNewRoom(user, data.roomId, data.savedGameID, data.gameScenario, data.roomName);

            result = CircularJSON.stringify( DATA.getRoom(data.roomId));


            send('JOIN_ROOM_SUCCESS', result);
            // send('JOIN_ROOM_SUCCESS', CircularJSON.stringify(fakeRoom.room));
            // sendRoom('GAME_START', CircularJSON.stringify(fakeRoom.room));

        });

    }
/**
    got('rollDice', function (data) {

        Commands.rollDice(roomId);
        send('rollDiceAck', CircularJSON.stringify( DATA.getMatch(roomId)));
    });

    got('buildEstablishment', function (data) {
        Commands.buildEstablishment(user.username, roomId, data.position, data.establishmentLV);
        send('buildEstablishmentAck', CircularJSON.stringify( DATA.getMatch(roomId)))
    });
**/


/**
    got('lol', function(){
        broadcast('hehe')
    })
**/

    //let normalCommand = ['rollDice'];
    _.each(Commands, function(fn, commandName){
        got(commandName, function(data){
            fn(user.username, roomId, data);
            send(commandName + 'Ack' + 'Owner');
            sendRoom(commandName + 'Ack', CircularJSON.stringify(DATA.getRoom(roomId)));
        });
    });


    got('TEST_GAME', function (gameID) {
        let gameRoom = testGame.startTestGame(gameID);
           send('TEST_GAME_ACK', gameRoom);
    });






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