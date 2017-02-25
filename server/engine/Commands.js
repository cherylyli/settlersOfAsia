/**
 * Created by emol on 1/13/17.
 */
/**
 * Based on environment messages
 */
let DATA = require("./Data.js");
let Room = require('./gameLogic/Room.js');
let Match = require('./gameLogic/Match.js');
let User = require('./gameLogic/User.js');
let Player = require('./gameLogic/Player.js');
let Building = require('./gameLogic/Building.js');
let Bank = require('./gameLogic/Bank.js');
let Cost = require('./gameLogic/Cost.js');
let Knight = require('./gameLogic/Knight.js');
let Trade = require('./gameLogic/Trade.js');
let Enum = require('./gameLogic/Enum.js');


let Commands = module.exports = {};
//TODO: Yuan, you can help implement the commands, but you'd better finish other todo tasks first. Commands is an interface for all game logic class, you have to read all the game logic class before you implement them. (Actually don't implement this alone, it's better we can code this part together). This is optional if you want more task :p.

//TODO: change return value of commands, some commands may not need to return anything
//Payment and action are separate!
//--------------------Commands used when user is not in game----------------------------

/**
 * Use this command when you create a new game room
 *
 * @precondition either savedGameID or scenario is null
 * @post-condition: gameRoom is created.
 * @return gameRoom object
 * @param userName {String}
 * @param roomID {String}
 * @param savedGameID the game ID {String} of a previous game, only use this field if the user wants to play a saved game
 * @param scenario {String} use this field if user wants to start a new game
 */
Commands.makeNewRoom = function (userName, roomID, savedGameID = null, scenario = null) {
    let user = DATA.getUser(userName);
    if(!user) user = User.createUser(userName);
    //make new Room
    let room = Room.createRoom(roomID, userName);


    //owner also joins room
    Commands.joinRoom(userName, roomID);
    return room;
};






/**
 * @precondition the room is not full or in game
 * @param userName  {String}
 * @param roomID  {String}
 * @return room {Room}
 */
Commands.joinRoom = function (userName, roomID) {
    let room = DATA.getRoom(roomID);
    let user = DATA.getUser(userName);
    if(!user) user = User.createUser(userName);
    user.joinGameRoom(room);
};






/**
 * @precondition: Player has joined a room, and there are enough players in the room (3-4).
 * Play doesn't need to specify the player number when he created the room, he just click the button when he wants to start and the game is able to start
 * Once a player emit startGame Command, the gameRoom is in Starting State, the game will starts in 5 seconds, if other player leave during the 5 seconds, the game will not start, and the player has to emit the startGame Command again (if there are enough people).
 * this function create a match object, initialize player object for each player and initialize map
 * @param roomID {String}
 * @return match object
 */
Commands.startGame = function (roomID) {
    let room = DATA.getRoom(roomID);
    //Room.state = STARTING, game will start in 5 sec if no player leaves the room

    // user chose to play a new game
    if (!room.match){
        //create new match
        room.startGame();

    }

    //set player to each user
    return room.match;
};





/**
 * @precondition the user is in a room, if the game has not start, he simply leaves the room, if not he also lose the game, game continues for other player, his settlements remain on the map
 * @param user
 * @return {boolean}
 */
Commands.leaveRoom = function (user) {
    return true;
};



//=================================================================================
//-------------------------------Commands used in game-----------------------------

/**
 *
 * @param match {String}
 * @return dice {Dice}
 */
Commands.rollDice = function (matchID) {
    let match = DATA.getMatch(matchID);
    return match.rollDice();
};





//----------------------------------Establishment and routes------------------
/**
 * build settlement or city (!!at full price!!)
 * @param userName {String}
 * @param matchID {String}
 * @param position {int}   vertex id
 * @param establishmentLv {int} level 1 : settlement, level 2: city, level 3: metropolitan
 */
Commands.buildEstablishment = function (userName, roomID, position,  establishmentLv) {
    let player = DATA.getPlayer(userName, roomID);
    let match = DATA.getMatch(roomID);
    let map = match.map;

    if (establishmentLv == 1) {
        //build settlement
        Building.buildSettlement(player, position, map);
        if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.updatePlayerAsset(player, 'buildSettlement');
    }
    //!!payment and action are separate!!
    if (establishmentLv == 2){
        let building = player.getBuilding(position);
        building.upgradeToCity();
        if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.updatePlayerAsset(player,'settlementToCity');
    }

    else{

        //build metropolitan

        //update assest
    }

};





/**
 * build a road
 * @param userName {String}
 * @param roomID {String}
 * @param edge  {[int, int]} the edge where user wants to place the road
 */
Commands.buildRoad = function (userName, roomID, edge) {
    let player = DATA.getPlayer(userName, roomID);
    let match = DATA.getMatch(roomID);
    Building.buildRoad(player, edge, match.map, 'road');

    if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.updatePlayerAsset(player,'buildRoad');
};

/**
 * build a ship
 * @param userName {String}
 * @param roomID {String}
 * @param edge {[int, int]} the edge where player wants to build the ship
 */
Commands.buildShip = function (userName, roomID, edge) {
    //TODO: improvement, combine buildRoad and buildShip
    let player = DATA.getPlayer(userName, roomID);
    let match = DATA.getMatch(roomID);
    Building.buildRoad(player, edge, match.map, 'ship');

    match.bank.updatePlayerAsset(player,'buildShip');
};


/**
 *
 * @param roomID {String}
 * @param vertex {int}
 */
Commands.buildCityWall = function (roomID, vertex) {
    let match = DATA.getMatch(roomID);
    let city = match.map.getVertexInfo(vertex);
    city.buildCityWall();

    match.bank.updatePlayerAsset(city.owner, 'buildCityWall');
};


/**
 * @param roomID {String}
 * @param vertex {int}
 */
Commands.chooseCityToBePillaged = function (roomID, vertex) {
    let match = DATA.getMatch(roomID);
    let city = match.map.getVertexInfo(vertex);
    city.pillage();
}


/**
 * @param userName {String}
 * @param roomID {String}
 * @param cityImprovementCategory {String}
 */
Commands.buyCityImprovement = function (userName, roomID, cityImprovementCategory) {
    let player = DATA.getPlayer(userName, roomID);
    let match = DATA.getMatch(roomID);
    let level = player.buyCityImprovement(cityImprovementCategory);

    match.bank.updatePlayerAsset(player, 'cityImprove_' + cityImprovementCategory + '_' + level);
};


/**
 * @param roomID {String}
 * @param oldPosition {[int, int]} Edge
 * @param newPosition {[int, int]} Edge
 */
Commands.moveShip = function (roomID, oldPosition, newPosition) {
    let match = DATA.getMatch(roomID);
    let ship = match.map.getEdgeInfo(oldPosition);
    ship.move(oldPosition, newPosition);
};


//--------------------------Knight---------------------------
/**
 *
 * @param position {int} vertex id. the position player wants to place the knight.
 * If player don't want to put the knight on board now, position is left null.
 */
Commands.hireKnight = function (userName, roomID, position = null) {
    let player = DATA.getPlayer(userName, roomID);
    let match = DATA.getMatch(roomID);
    Knight.hireKnight(player, match.map, position);

    match.bank.updatePlayerAsset(player, 'hireKnight');
};


/**
 *
 */
Commands.activateKnight = function (roomID, position) {
    let match = DATA.getMatch(roomID);
    let knight = match.map.getVertexInfo(position);
    knight.activate();

    match.bank.updatePlayerAsset(knight.owner, 'activateKnight');
};


/**
 *
 */
Commands.promoteKnight = function (roomID, position) {
    let match = DATA.getMatch(roomID);
    let knight = match.map.getVertexInfo(position);
    knight.promote();

    match.bank.updatePlayerAsset(knight.owner, 'promoteKnight');
};

/**
 *
 */
Commands.moveKnight = function (roomID, position, newPosition) {
    let match = DATA.getMatch(roomID);
    let knight = match.map.getVertexInfo(position);
    knight.move(newPosition, match.map);
};


/**
 *
 */
Commands.displaceKnight = function (roomID, position, newPosition) {
    let match = DATA.getMatch(roomID);
    let knight = match.map.getVertexInfo(position);
    let opponentKnightInfo = knight.move(newPosition, match.map);
    /**
     * TODO: notify the other player
     */
};

/**
 *
 */
Commands.chaseAwayThief = function (roomID, position, thiefPosition, newPositionForThief) {
    let match = DATA.getMatch(roomID);
    let knight = match.map.getVertexInfo(position);
    knight.chaseAwayThief(match.map, thiefPosition, newPositionForThief);
};


//-------------------------
/**
 *
 */
Commands.tradeWithBank = function (userName, roomID, src, tradeFor) {
    let player = DATA.getPlayer(userName, roomID);
    let match = DATA.getMatch(roomID);
    match.bank.tradeWithBank(player, src, tradeFor);
};

/**
 *
 * @param cards {Array<String>} resource/ commodity cards the player chooses to discard
 */
Commands.discardResourceCards = function (userName, roomID, cards) {
    let player = DATA.getPlayer(userName, roomID);
    player.discardCards(cards);
}

/**
 * create trade object, notifies all the other players about the trade offer.
 * @new {Trade}
 * @param offer {object} cost object
 * @param request   {object}
 */
Commands.requestTrade = function (offer, request) {
    let trade = Trade.createTrade(offer, request);
    /**
     * TODO: communication
     */
}


/**
 * game keeps track of current trade. (There is only one current trade)
 * when all players have responded to the offer, return a list of players that agree to trade
 * @param player {Player} player who responded to the trade offer
 * @return {list<String>} a list of player name who is willing to trade. If only a part of player responds, return null;
 */
Commands.acceptTrade = function (player) {

}


/**
 * This command is used after A and B both agree to trade with each other.
 * @param playerA {Player}
 * @param cardsA {list<String>} resource/ commodity cards the playerA offers
 * @param playerB {Player}
 * @param cardsB {list<String>} resource/ commodity cards the playerB offers
 */
Commands.tradeWithPlayer = function (userNameA, userNameB, roomID, trade) {
    let playerA = DATA.getPlayer(userNameA, roomID);
    let playerB = DATA.getPlayer(userNameB, roomID);
    let match = DATA.getMatch(roomID);
    match.bank.tradeWithPlayer(playerA, playerB, trade);
}


/**
 * @param theif {Player}
 * @param victim {Player}
 */
Commands.stealCard = function (thiefUserName, victimUserName, roomID) {
    let playerA = DATA.getPlayer(thiefUserName, roomID);
    let playerB = DATA.getPlayer(victimUserName, roomID);
    playerB.stolenBy(playerA);
}


/**
 *
 * @param player {Player}
 * @param progressCard {String} progress card
 */
Commands.discardProgressCard = function (player, progressCard) {

}


/**
 *
 * @param roomID
 * @return {String} the name of the player to take next turn
 */

Commands.endTurn = function (roomID) {
    let match = DATA.getMatch(roomID);
    return match.nextPlayerToTakeTurn();
}

//progress card stuff will be added later..