/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
const MIN_PLAYER_NUM = 3;
const MAX_PLAYER_NUM = 4;

let enums = require('./Enum.js');
//import _ from "underscore";
let Player = require('./Player.js');
let Match = require('./Match.js');
let DATA = require('../Data.js');

let Room = module.exports = {};



Room.createRoom = function (RoomID, creatorName) {
    let gameRoom = {};

    gameRoom.id = RoomID;
    gameRoom.state = enums.GameRoomState.Waiting;
    gameRoom.owner = creatorName;
    gameRoom.users = {};    //key: userName (string), value: player data (Player object)
    gameRoom.match = null;
    gameRoom.gameScenario = null;


    gameRoom.addUser = function(userName){
        let gameRoomID = this.id;
        this.users[userName] = null;
        if (Object.keys(this.users).length  == MIN_PLAYER_NUM ){
            this.state = enums.GameRoomStateReady;
        }
        if (Object.keys(this.users).length  == MAX_PLAYER_NUM ){
            this.state = enums.GameRoomState.Full;
        }
    }

    gameRoom.isFull = function () {
        return this.state == enums.GameRoomState.Full;
    }

    /**
     * whenever a new user joins the rooms, calls this function to check whether they can start game.
     * Af first the start game button (in UI) is grey, when this function returns true, the start game button is clickable.
     * @return {boolean}
     */
    gameRoom.ableToStartGame = function(){
        let state = this.state;
        return (state == enums.GameRoomState.Ready || state == enums.GameRoomState.Full);
    }

    gameRoom.setGameScenario = function (scenario) {
        gameRoom.gameScenario = scenario;
    }



    gameRoom.startGame = function () {

        if (!gameRoom.gameScenario){
            //ask user to select scenario.
            //test data
            gameRoom.gameScenario = 'Heading For New Shores';
        }

        //init players data for game (either load or create)
        //let players = [];
        for (let user in gameRoom.users){
            if (gameRoom.users.hasOwnProperty(user)) {
                gameRoom.users[user] = Player.createPlayer();
          //      players.push(gameRoom.users[user]);
            }
        }
        //now create the game/match based on the scenario.
        gameRoom.match = Match.createNewMatch(gameRoom.gameScenario, gameRoom.users);
        DATA.addMatch(gameRoom.id, gameRoom.match);

        for (let player in gameRoom.users){
            if (gameRoom.users.hasOwnProperty(player)) {
                gameRoom.users[player].match = gameRoom.match;
            }
        }
        return gameRoom.match;
    }


    DATA.addRoom(gameRoom);
    return gameRoom;
}