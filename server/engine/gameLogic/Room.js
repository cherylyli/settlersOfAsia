/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
const MIN_PLAYER_NUM = 3;
const MAX_PLAYER_NUM = 4;

let enums = require('./Enum.js');
let Player = require('./Player.js');
let Match = require('./Match.js');
let DATA = require('../Data.js');
let fs = require("fs");
let CircularJSON = require('circular-json');

let Room = {} = module.exports;


var savedPath = './data/savedGame';

Room.savedGame = function(roomId, room){
    fs.writeFileSync(`${savedPath}/${roomId}.json`, CircularJSON.stringify(room), 'utf8');
};

Room.fetchAllSaved = function(){
    return fs.readdirSync(savedPath)
        .filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
        .map(file => {
            return CircularJSON.parse(fs.readFileSync(`${savedPath}/${file}`, 'utf8'))
        });
};

Room.fetchSaved = function(roomId){
    return CircularJSON.parse(fs.readFileSync(`${savedPath}/${roomId}.json`, 'utf8'));
};


// Room.savedGame('a', {a:1})
// Room.savedGame('b', {b:1})
// Room.savedGame('c', {c:1})



Room.createRoom = function (savedGameID, RoomID, creatorName, gameScenario, roomName) {
    let gameRoom = {};

    if (savedGameID) {
        gameRoom = Room.fetchSaved(savedGameID);
        gameRoom.savedGame = true;
        DATA.addMatch(gameRoom.id, gameRoom.match);

        // DATA.addRoom(gameRoom);
    }
    else {
        gameRoom.id = RoomID;
        gameRoom.state = enums.GameRoomState.Waiting;   //after game starts, gameRoom.state = match.state
        gameRoom.owner = creatorName;
        gameRoom.users = {};    //key: userName (string), value: player data (Player object)
        //gameRoom.Users = {};    //user objects
        gameRoom.match = null;
        gameRoom.gameScenario = gameScenario;
        gameRoom.name = roomName;

    }

    DATA.addRoom(gameRoom);
    return gameRoom;
};



Room.addUser = function(gameRoom, user){
    let gameRoomID = gameRoom.id;

    if (gameRoom.savedGame){
        gameRoom.users[user.username].user = user;
    }

    else {
        if (!gameRoom.match || !gameRoom.users[user.username]){
            gameRoom.users[user.username] = Player.createPlayer(user.username, user);

            if (Object.keys(gameRoom.users).length  == MIN_PLAYER_NUM ){
                gameRoom.state = enums.GameRoomState.Ready;
            }
            if (Object.keys(gameRoom.users).length  == MAX_PLAYER_NUM ){
                gameRoom.state = enums.GameRoomState.Full;
            }
        }
    }
};


Room.isFull = function (gameRoom) {
    return gameRoom.state == enums.GameRoomState.Full;
};

/**
 * whenever a new user joins the rooms, calls this function to check whether they can start game.
 * Af first the start game button (in UI) is grey, when this function returns true, the start game button is clickable.
 * @return {boolean}
 */
Room.ableToStartGame = function(gameRoom){
    let state = gameRoom.state;
    return (state == enums.GameRoomState.Ready || state == enums.GameRoomState.Full);
};

Room.setGameScenario = function (gameRoom, scenario) {
    gameRoom.gameScenario = scenario;
};



Room.startGame = function (gameRoom) {
    if (gameRoom.savedGame && gameRoom.match) return gameRoom.match;
    if (!gameRoom.gameScenario){
        //ask user to select scenario.
        //test data
        // FIXME: change later
        gameRoom.gameScenario = 'Heading For New Shores';
    }

    //init players data for game (either load or create)
    //let players = [];
    /**
     for (let user in gameRoom.users){
            if (gameRoom.users.hasOwnProperty(user)) {
               // gameRoom.users[user] = Player.createPlayer(user,);
          //      players.push(gameRoom.users[user]);
            }
        }**/
    //now create the game/match based on the scenario.
    gameRoom.match = Match.createNewMatch(gameRoom.gameScenario, gameRoom.users, gameRoom.id);
    DATA.addMatch(gameRoom.id, gameRoom.match);

    for (let player in gameRoom.users){
        if (gameRoom.users.hasOwnProperty(player)) {
            gameRoom.users[player].match = gameRoom.match;
        }
    }
    return gameRoom.match;
};

