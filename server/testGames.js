/**
 * Created by emol on 4/7/17.
 */
let testGame = module.exports = {};
let Commands = require("./engine/Commands.js");
let User = require("./engine/gameLogic/User.js");
let DATA = require("./engine/Data.js");
let Enum = require("./engine/gameLogic/Enum.js");
var _ = require('underscore');
let Player = require('./engine/gameLogic/Player.js');
let CircularJSON = require('circular-json');
/**
 let rooms = data.rooms;
 let users = data.users;
 let match = data.matches;
 **/
let p1 = "Jack";
let p2 = "PLEASE";
let p3 = "FINISH";
let p4 = "THIS";
let user_A = {username :  p1};
let user_B = {username :  p2};
let user_C = {username :  p3};
let user_D = {username :  p4};
let userA = User.createUser(user_A);
let userB = User.createUser(user_B);
let userC = User.createUser(user_C);

let userD = User.createUser(user_D);

testGame.startTestGame = function (gameId) {
  switch (gameId){
      case 1:
          return testGame.YearsOfPlentyGame();
      case 2:
          return testGame.ProgressCardGame();
      case 3:
          return testGame.MetropolisGame();
  }
  return null;
};


    /**
     * Years of Plenty Saved Game: There should be a saved game for 3 players that allows us to test lots of game actions that require resources and commodities, i.e., each player should have plenty of resources, commodities, fish and gold.
     *
 * @return {JSON} // circular, you have to use CircularJson.parse to read it
 * @constructor
 */
testGame.YearsOfPlentyGame = function () {
    let roomName = "YearsOfPlenty";
    // create room
    createRoom(roomName);

    // add resource
    for (let player of _.values(DATA.getMatch(roomName).players)){
        setResource(player);
    }

    return CircularJSON.stringify(DATA.getRoom(roomName));
};

/**
 * Progress Card Saved Game: There should be a saved game that allows us to test every possible progress card (we will randomly test 3 of them, but we want to be able to choose which ones).
 * @constructor
 */
testGame.ProgressCardGame = function () {
    let roomName = "ProgressCard";
    // create room
    createRoom(roomName);

    for (let player of _.values(DATA.getMatch(roomName).players)){
        setResource(player.name);
    }
    return CircularJSON.stringify(DATA.getRoom(roomName));
};


/**
 * Metropolis: There should be a 3 player saved game where one player owns an Aqueduct, one player owns a Marketplace, and one player owns a Fortress. Furthermore, each player should have lots of commodity cards so we can upgrade our city improvements even further.
 * @constructor
 */
testGame.MetropolisGame = function () {
    let roomName = "Metropolis";
    // create room
    createRoom(roomName);

    let types = _.clone(_.values(Enum.cityImprovementCategory));
    let positions = [1, 4, 6, 7, 30, 26, 38, 56, 58, 50, 71];
    for (let player of _.values(DATA.getMatch(roomName).players)){
        let type = types.pop();
        if (!type) type = Enum.cityImprovementCategory.Politics; // default;
        buyCityImprove(player.name, roomName, type);

        let settlementPos = positions.pop(), cityPos = positions.pop();
        buildCityAndSettlemtn(player.name, roomName, settlementPos, cityPos);
        setResource(player);

    }
    return CircularJSON.stringify(DATA.getRoom(roomName));
};


/**
 * Knight Saved Game: there should be a 3 player saved game where each player has at least 2 knights, and each level of knight is represented. Furthermore, the players must have several roads that lead to intersections that are unoccupied by settlements or cities. Each player should also have at least 3 lumber and 3 brick each so we can build more roads.
 * @param playerName
 * @param roomName
 * @param settlementPos
 * @param cityPos
 */
testGame.KnightGame = function () {

};

/**
 * Barbarian Saved Game: there should be a 3 player saved game where the barbarian is soon going to attack the island.
 * @param playerName
 * @param roomName
 * @param settlementPos
 * @param cityPos
 */


/**
 * Winning Saved Game: there should be a 3 player saved game where very soon one player will be winning the game. One player should have the boot.
 * @param playerName
 * @param roomName
 * @param settlementPos
 * @param cityPos
 */




function buildCityAndSettlemtn(playerName, roomName, settlementPos, cityPos) {
    let dataS = {'position': settlementPos};
    let dataC = {'position': cityPosPos};
    Commands.buildSettlement(playerName, roomName, dataC);
    Commands.upgradeToCity(playerName, roomName, dataC);
    Commands.buildSettlement(playerName, roomName, dataS);
}

function createRoom(roomName) {
    Commands.makeNewRoom(user_D, roomName);
    Commands.joinRoom(userA, roomName);
    Commands.joinRoom(userB, roomName);
    Commands.joinRoom(userC, roomName);
    Commands.startGame(roomName);
}

function setResource(player) {
    for (let resourceType in player.resourcesAndCommodities){
        player.resourcesAndCommodities[resourceType] = 5;
    }
    player.resourceCardTotalNum();

    player.fishSum = 8;
}

function addProgressCards(playerName, roomName) {
    for (let cardType in Enum.cityImprovementCategory){
        let data = {'kind': cardType};
        Commands.discardOneProgressCard(roomName, playerName, data);
    }
}

function buyCityImprove(playerName, roomName, level, type) {
    let data = {'cityImprovementCategory': type};
    for (let i = 0; i < level; i++){
        Commands.buyCityImprovement(playerName, roomName, data);
    }
}