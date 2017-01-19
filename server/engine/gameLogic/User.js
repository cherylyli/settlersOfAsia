/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/9/17.
 */
let enums = require('./Enum.js');
let User = module.exports = {};

User.createUser = function (user) {
    //let user = {};

    user.name = user.username;
    user.state = enums.PlayerState.LOBBY;
    user.roomID = null;



    user.joinGameRoom = function (room) {
        if (!user.checkJoinGameRoom(room)){
            alert("Unable to join room!");
            return;
        }

        room.addUser(user.name);
        user.roomID = room.id;
        user.state = enums.PlayerState.GAME_ROOM;

    }

    user.checkJoinGameRoom = function (room) {
        //not full && user in lobby
        if ((user.state == enums.PlayerState.LOBBY) && !room.isFull()) return true;
        return false;
    }


    return user;
}