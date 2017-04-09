/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/9/17.
 */
let enums = require('./Enum.js');
let User = {} = module.exports;
let DATA = require('../Data.js');
let Room = require('./Room.js');

User.createUser = function (user) {

    user.name = user.username;
    user.state = enums.PlayerState.LOBBY;
    user.roomID = null;
    user.player = null;



    user.joinGameRoom = function (room) {
        /**
        if (!user.checkJoinGameRoom(room)){
            alert("Unable to join room!");
            return;
        }**/

        room.addUser(user);
        user.roomID = room.id;
        user.state = enums.PlayerState.GAME_ROOM;

    };

    /**
     *
     */
    user.leaveRoom = function () {
        let room = DATA.getRoom(this.roomID);
        this.player = null;
        this.roomID = null;
        this.state = enums.PlayerState.LOBBY;
        let roomID = this.roomID;

        if (!room) return;


        delete room.users[this.name];
        if (Object.keys(room.users) == 0){
            //delete the room if there is only one player in the room -> last player left
            DATA.rooms[roomID] = undefined;
            return;
        }

        //there r still other users in the room
        if (room.owner == user.name){
            if (!room || !room.users) return;
            room.owner = Object.keys(room.users)[0];
            //maybe notify the owner that he is the new owner of the room
        }
    };

    /**
    user.checkJoinGameRoom = function (room) {
        //not full && user in lobby
        if ((user.state == enums.PlayerState.LOBBY) && !room.isFull()) return true;
        return false;
    }**/


    DATA.addUser(user);
    return user;
}

User.joinGameRoom = function (user, room) {
    /**
     if (!user.checkJoinGameRoom(room)){
            alert("Unable to join room!");
            return;
        }**/

    Room.addUser(room, user);
    user.roomID = room.id;
    user.state = enums.PlayerState.GAME_ROOM;

};

/**
 *
 */
User.leaveRoom = function (user) {
    let room = DATA.getRoom(user.roomID);
    user.player = null;
    user.roomID = null;
    user.state = enums.PlayerState.LOBBY;
    let roomID = user.roomID;

    if (!room) return;


    delete room.users[user.name];
    if (Object.keys(room.users) == 0){
        //delete the room if there is only one player in the room -> last player left
        DATA.rooms[roomID] = undefined;
        return;
    }

    //there r still other users in the room
    if (room.owner == user.name){
        if (!room || !room.users) return;
        room.owner = Object.keys(room.users)[0];
        //maybe notify the owner that he is the new owner of the room
    }
};

/**
 user.checkJoinGameRoom = function (room) {
        //not full && user in lobby
        if ((user.state == enums.PlayerState.LOBBY) && !room.isFull()) return true;
        return false;
    }**/
