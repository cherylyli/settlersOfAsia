/**
 * Created by emol on 1/13/17.
 */
/**
 * Based on environment messages
 */
let Commands = {} = module.exports;


//--------------------Commands used when user is not in game----------------------------

/**
 * Use this command when you create a new game room
 *
 * @precondition either savedGameID or scenario is null
 * @post-condition: gameRoom is created.
 * @return gameRoom object
 * @param user User object
 * @param savedGameID the game ID {String} of a previous game, only use this field if the user wants to play a saved game
 * @param scenario {String} use this field if user wants to start a new game
 */
Commands.makeNewRoom = function (user, savedGameID = null, scenario = null) {
    //make new Room
    let room = createRoom();

    //owner also joins room
    Commands.joinRoom(user, room);
    return room;
};


/**
 * @precondition the room is not full or in game
 * @param user  {User}
 * @param room  {Room}
 * @return room {Room}
 */
Commands.joinRoom = function (user, room) {
    return room;
};


/**
 * @precondition: Player has joined a room, and there are enough players in the room (3-4).
 * Play doesn't need to specify the player number when he created the room, he just click the button when he wants to start and the game is able to start
 * Once a player emit startGame Command, the gameRoom is in Starting State, the game will starts in 5 seconds, if other player leave during the 5 seconds, the game will not start, and the player has to emit the startGame Command again (if there are enough people).
 * this function create a match object, initialize player object for each player and initialize map
 * @param room {Room}
 * @return match object
 */
Commands.startGame = function (room) {
    //Room.state = STARTING, game will start in 5 sec if no player leaves the room

    // user chose to play a new game
    if (!room.match){
        //create new match
        let match = createNewMatch();
        room.match = match;

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
 * @param match {Match}
 * @return dice {Dice}
 */
Commands.rollDice = function (match) {
    return match.rollDice();
};


//----------------------------------Establishment and routes------------------
/**
 * build settlement or city
 * @param player {Player}
 * @param establishmentLv {int} level 1 : settlement, level 2: city
 */
Commands.buildEstablishment = function (player, establishmentLv) {

};

/**
 * build a road
 * @param player {Player}
 * @param map {Map}
 * @param edge  {[int, int]} the edge where user wants to place the road
 */
Commands.buildRoad = function (player, map, edge) {
};

/**
 * build a ship
 * @param player {Player}
 * @param map {Map}
 * @param edge {[int, in]} the edge where player wants to build the ship
 */
Commands.buildShip = function (player, map, edge) {

};


/**
 * @param city {Establishment}
 */
Commands.buildCityWall = function (city) {

};

/**
 *
 * @param settlement {Establishment}
 */
Commands.upgradeSettlement = function (settlement) {

};


/**
 *
 * @param player {Player}
 * @param cityImprovementCategory {String}
 */
Commands.buyCityImprovement = function (player, cityImprovementCategory) {
    
};

/**
 *
 * @param oldPosition {[int, int]} Edge
 * @param newPosition {[int, int]} Edge
 */
Commands.moveShip = function (oldPosition, newPosition) {

};


//--------------------------Knight---------------------------
/**
 *
 * @param player {Player}
 * @param position {int} vertex id. the position player wants to place the knight.
 * If player don't want to put the knight on board now, position is left null.
 */
Commands.hireKnight = function (player, position = null) {

};

/**
 *
 * @param knight {Knight}
 */
Commands.activateKnight = function (knight) {
    
};


/**
 *
 * @param knight {Knight}
 */
Commands.promoteKnight = function (knight) {

};

/**
 *
 * @param knight {Knight}
 * @param position {int} Vertex id, the position player wants to move the knight to
 */
Commands.moveKnight = function (knight, position) {

};

/**
 *
 * @param knight {Knight}
 * @param opponentKnight {Knight}
 */
Commands.displaceKnight = function (knight, opponentKnight) {

};

//-------------------------
/**
 *
 * @param tradeRatio {int}
 * @param src {list<String>} resource/ commodity
 * @param tradeFor
 */
Commands.tradeWithBank = function (tradeRatio = 4, src, tradeFor) {

};

/**
 *
 * @param player {Player}
 * @param cards {list<String>} resource/ commodity cards the player chooses to discard
 */
Commands.discardCards = function (player, cards) {

}



/**
 * This command is used after A and B both agree to trade with each other.
 * @param playerA {Player}
 * @param cardsA {list<String>} resource/ commodity cards the playerA offers
 * @param playerB {Player}
 * @param cardsB {list<String>} resource/ commodity cards the playerB offers
 */
Commands.tradeWithPlayer = function (playerA, cardsA, playerB, cardsB) {

}


/**
 * @param theif {Player}
 * @param victim {Player}
 * @param card {String} resource/ commodity cards thief steals from victim
 */
Commands.stealCard = function (thief, victim, card) {

}


