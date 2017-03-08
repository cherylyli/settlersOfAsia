let DATA = module.exports = {};

let rooms = {};
let users = {};
let matches = {};

DATA.rooms = rooms;
DATA.users = users;
DATA.matches = matches;

//----------------------Room---------------------------
DATA.getRoom = function (roomID) {
    return rooms[roomID];
}

DATA.existRoom = function (roomID) {
    return rooms.hasOwnProperty(roomID);
}

/**
 * add a new room to rooms list
 * @param room {Room}
 */
DATA.addRoom = function (room) {
    rooms[room.id] =  room;
}

/*
 * @param userName {String}
 */
DATA.getUser = function (userName) {
    return users[userName];
}

/**
 * add a new user to users list
 * @param user {User}
 */
DATA.addUser = function (user) {
    users[user.name] = user;
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
DATA.addMatch = function (roomID, match) {
    matches[roomID] = match;
}


DATA.getPlayer = function (userName, roomID) {
    let match = DATA.getMatch(roomID);
    return match.getPlayer(userName);
}