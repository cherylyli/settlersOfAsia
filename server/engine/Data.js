let DATA = module.exports = {};

let rooms = {};
let matches = {};


//----------------------Room---------------------------
DATA.getRoom = function (roomID) {
    return rooms[roomID];
}

DATA.existRoom = function (roomID) {
    return rooms.hasOwnProperty(roomID);
}

/**
 * add a new room to rooms list
 * @param roomID
 * @param room {Room}
 */
DATA.addRoom = function (roomID, room) {
    rooms[roomID] =  room;
}


//---------------------Games---------------------------

// DATA only stores games that is currently played in rooms.
// For saved game, it's in database.
// Load it to data when user wants to continue play it.
DATA.getMatch = function (roomID) {
    return matches[roomID];
}

/**
 *
 * @param roomID
 * @param match {Match}
 */
DATA.addGame = function (roomID, match) {
    matches[roomID] = match;
}