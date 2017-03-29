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
let notify  = require('../api/notify.js');
let CircularJSON = require('circular-json');
let Robber = require('./gameLogic/Robber.js');
let Pirate = require('./gameLogic/Pirate.js');
let ProgressCard = require('./gameLogic/ProgressCards.js');

let Commands = module.exports = {};
let CommandsCheck = {};



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
 Commands.makeNewRoom = function (user, roomID, savedGameID, scenario) {
     //let user = DATA.getUser(userName);
     //if(!user) user = User.createUser(userName);
     //make new Room
     let room = Room.createRoom(roomID, user.name);


     //owner also joins room
     Commands.joinRoom(user, roomID);
     return room;
 };


 /**
  * @precondition the room is not full or in game
  * @param userName  {String}
  * @param roomID  {String}
  * @return room {Room}
  */
 Commands.joinRoom = function (user, roomID) {
     let room = DATA.getRoom(roomID);

     //TODO: missing owner attributes in room object
     //if(!room.owner) room.owner = user.name;
     //let user = DATA.getUser(userName);
     //if(!user) user = User.createUser(userName);
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
     //if (!room.match){
         //create new match
         room.startGame();
         return room.match.currentPlayer;

     //}

 };





 /**
  * @precondition the user is in a room, if the game has not start, he simply leaves the room, if not he also lose the game, game continues for other player, his settlements remain on the map
  * @param user
  * @return {boolean}
  */
 Commands.leaveRoom = function (userName, roomID) {
     let room = DATA.getRoom(roomID);
     let user = DATA.getUser(userName);
     if (!room) {
          user.roomID = null;
         return;
     }
     let currentOwner = room.owner;
     user.leaveRoom();
     let newRoom = DATA.getRoom(roomID);
     if (newRoom && newRoom.owner != room.owner){
         notify.user(newRoom.owner, 'NEW_ROOM_OWNER');
         //it should only send to the rest players in the room, but I have no reference to the socket object lol and too lazy to change... For now just send to all ppl, the person who left the room will simply ignores this message
     //
     }
     if (Object.keys(newRoom.users).length > 0) {
         notify.room(roomID, 'A_PLAYER_LEFT_ROOM', CircularJSON.stringify(DATA.getRoom(roomID)));
     }
     return true;
 };



 //=================================================================================
 //-------------------------------Commands used in game-----------------------------

 /**
  *
  * @param match {String}
  */

 Commands.rollDice = function (userName, matchID, data) {
     let match = DATA.getMatch(matchID);
     match.rollDice();
    // console.log(match.dice.configureResult(match));
 };




 //----------------------------------Establishment and routes------------------

 Commands.buildSettlement = function (userName, roomID, data){
     let position = data.position;
     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     let map = match.map;

     let building = Building.buildSettlement(player, position, map);
     if (match.phase == Enum.MatchPhase.SetupRoundTwo){
         //collect resource immediately
         let hexIDs = map.getHexTileArrayByVertex(position);
         for (let id of hexIDs){
             map.getHexTileById(id).produceResourceToSingleUser(match, player, building);
         }
     }
     if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.updatePlayerAsset(player, 'buildSettlement');
 };

 Commands.upgradeToCity = function (userName, roomID, data){
     let position = data.position;

     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     let map = match.map;

     let building = player.getBuilding(position);
     //TODO: for testing, delete later
     if (!building) building = Building.buildSettlement(player, position, map);
     building.upgradeToCity();
     if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.updatePlayerAsset(player, 'upgradeToCity');

 };

 /**
  * build settlement or city (!!at full price!!)
  * @param userName {String}
  * @param matchID {String}
  * @param position {int}   vertex id
  * @param establishmentLv {int} level 1 : settlement, level 2: city, level 3: metropolitan
  */
 /**
 Commands.buildEstablishment = function (userName, roomID, data) {
     let position = data.position;
     let establishmentLv = data.establishmentLV;
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
         //TODO: for testing, delete later
         if (!building) building = Building.buildSettlement(player, position, map);
         building.upgradeToCity();
         if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.updatePlayerAsset(player,'upgradeToCity');
     }
     else{
         //build metropolitan
         //update assest
     }
 };**/





 /**
  * build a road
  * @param userName {String}
  * @param roomID {String}
  * @param data  {[int, int]} the edge where user wants to place the road
  */
 Commands.buildRoad = function (userName, roomID, data) {
     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     Building.buildRoad(player, data, match, 'road');

     if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.updatePlayerAsset(player,'buildRoad');
 };

 /**
  * build a ship
  * @param userName {String}
  * @param roomID {String}
  * @param data {[int, int]} the edge where player wants to build the ship
  */
 Commands.buildShip = function (userName, roomID, data) {
     //TODO: improvement, combine buildRoad and buildShip
     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     Building.buildRoad(player, data, match, 'ship');

     if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.updatePlayerAsset(player,'buildShip');
 };


 /**
  *
  * @param roomID {String}
  * @param vertex {int}
  */
 Commands.buildCityWall = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let city = match.map.getVertexInfo(data.position);
     city.buildCityWall();

     match.bank.updatePlayerAsset(city.owner, 'buildCityWall');
 };


 /**
  * @param roomID {String}
  * @param vertex {int}
  */
 // TODO: chagne vertex to data

 Commands.chooseCityToBePillaged = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let vertex = data.position
     let city = match.map.getVertexInfo(vertex);
     city.pillage();
 };

/**
 *
 * @param vertex {int}
 */
CommandsCheck.chooseCityToBePillaged = function (vertex) {
    // test

    return true;
 };


 /**
  * @param userName {String}
  * @param roomID {String}
  * @param cityImprovementCategory {String}
  */
 Commands.buyCityImprovement = function (userName, roomID, data) {
     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     let cityImprovementCategory = data.cityImprovementCategory;
     let level = player.buyCityImprovement(cityImprovementCategory);

     match.bank.updatePlayerAsset(player, 'cityImprove_' + cityImprovementCategory + '_' + level);
 };


 /**
  * @param roomID {String}
  * @param oldPosition {[int, int]} Edge
  * @param newPosition {[int, int]} Edge
  */
 Commands.moveShip = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let oldPosition = data.oldPosition;
     let newPosition = data.newPosition;
     let ship = match.map.getEdgeInfo(oldPosition);
     ship.move(oldPosition, newPosition, match.map);
 };


 //--------------------------Knight---------------------------
 /**
  *
  * @param position {int} vertex id. the position player wants to place the knight.
  * If player don't want to put the knight on board now, position is left null.
  */
 Commands.hireKnight = function (userName, roomID, position) {
     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     Knight.hireKnight(player, match.map, position);

     match.bank.updatePlayerAsset(player, 'hireKnight');
 };


 /**
  *
  */
 Commands.activateKnight = function (userName, roomID, position) {
     let match = DATA.getMatch(roomID);
     let knight = match.map.getVertexInfo(position);
     knight.activate();

     match.bank.updatePlayerAsset(knight.owner, 'activateKnight');
 };


 /**
  *
  */
 Commands.promoteKnight = function (userName, roomID, position) {
     let match = DATA.getMatch(roomID);
     let knight = match.map.getVertexInfo(position);
     knight.promote();

     match.bank.updatePlayerAsset(knight.owner, 'promoteKnight');
 };

 /**
  *
  */
 Commands.moveKnight = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let knight = match.map.getVertexInfo(data.position);
     knight.move(data.newPosition, match.map);
 };


 /**
  *
  */
 Commands.displaceKnight = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let knight = match.map.getVertexInfo(data.position);
     let opponentKnightInfo = knight.move(data.newPosition, match.map);
     /**
      * TODO: notify the other player
      */
 };

 /**
  *
  */
 Commands.chaseAwayThief = function (userName, roomID) {
     let match = DATA.getMatch(roomID);
     let knight = match.map.getVertexInfo(data.position);
     knight.chaseAwayThief(match.map, data.thiefh, data.newPositionForThief);
 };


 //-------------------------
 /**
  *
  */
 Commands.tradeWithBank = function (userName, roomID, data) {
     let src = data.src;
     let tradeFor = data.tradeFor;
     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     match.bank.tradeWithBank(player, src, tradeFor);
 };
 //TODO special case trade with bank - fishmen ver, only trade resources.

 /**
  *
  * @param cards {Array<String>} resource/ commodity cards the player chooses to discard
  */
 Commands.discardResourceCards = function (userName, roomID, data) {
     let player = DATA.getPlayer(userName, roomID);
     player.discardResourceCards(data.cards);
 };

 /**
  * create trade object, notifies all the other players about the trade offer.
  * @new {Trade}
  * @param offer {object} cost object
  * @param request   {object}
  */
 Commands.requestTrade = function (data) {
     let trade = Trade.createTrade(data.offer, data.request);
     /**
      * TODO: communication
      */
 };


 /**
  * game keeps track of current trade. (There is only one current trade)
  * when all players have responded to the offer, return a list of players that agree to trade
  * @param player {Player} player who responded to the trade offer
  * @return {list<String>} a list of player name who is willing to trade. If only a part of player responds, return null;
  */
 Commands.acceptTrade = function (player) {

 };


 /**
  * This command is used after A and B both agree to trade with each other.
  * @param playerA {Player}
  * @param cardsA {list<String>} resource/ commodity cards the playerA offers
  * @param playerB {Player}
  * @param cardsB {list<String>} resource/ commodity cards the playerB offers
  */
 Commands.tradeWithPlayer = function (roomID, data) {
     let playerA = DATA.getPlayer(data.userNameA, roomID);
     let playerB = DATA.getPlayer(data.userNameB, roomID);
     let match = DATA.getMatch(roomID);
     match.bank.tradeWithPlayer(data.playerA, data.playerB, data.trade);
 };

//spend fish tokens  + add checkers
Commands.moveRobber = function (userName, roomID, data) {
    let match = DATA.getMatch(roomID);
    let robber = match.map.robber;
    let hextile1 = null;
    let hextile2 = null;
    if(data.oldHexID)
      hextile1 = match.map.getHexTileById(data.oldHexID);
    if(data.newHexID)
      hextile2 = match.map.getHexTileById(data.newHexID);
      //robber.hasToDiscardCards(match.players);

    robber.moveTo(hextile1,hextile2,match);
};

Commands.movePirate = function (userName, roomID, data) {
    let match = DATA.getMatch(roomID);
    let pirate = match.map.pirate;
    let hextile1 = null;
    let hextile2 = null;
    if(data.oldHexID)
      hextile1 = match.map.getHexTileById(data.oldHexID);
    if(data.newHexID)
      hextile2 = match.map.getHexTileById(data.newHexID);
    pirate.moveTo(hextile1,hextile2,match);
};

/**
 * @param theif {Player}
 * @param victim {Player}
 */
Commands.stealCard = function (userName, roomID, data) {
    let playerA = DATA.getPlayer(data.thief, roomID);
    let playerB = DATA.getPlayer(data.victim, roomID);
    playerB.stolenBy(playerA);
};

Commands.drawOneProgressCard = function (userName, roomID, data){
   let player = DATA.getPlayer(userName, roomID);
   player.drawOneProgressCard(data.progCard);
};

Commands.drawOneResourceCard = function (userName, roomID, data){
  let player = DATA.getPlayer(userName, roomID);
  player.drawOneResourceCard(data.resCard);
};
/**
 *
 * @param player {Player}
 * @param progressCard List<String> progress card
 */
Commands.discardOneProgressCard = function (userName, roomID, data) {
  let player = DATA.getPlayer(userName, roomID);
  player.discarOneProgressCard(data);
};

Commands.giveAwayBoot = function(userName, roomID, data){
  let playerA = DATA.getPlayer(data.bootHolder, roomID);
  let playerB = DATA.getPlayer(data.transferTo, roomID);
  playerA.giveAwayBoat(playerB);
};

/**
  * @param action Enum.fishEvent
  * @param data whatever the data is
      cases:
      move robber & move pirate - doesn't matter.
      steal card - data: {Player}
      draw one resource card - data {Enum.ResourceCard}
      build road/ ship - data {[int, [int]}
      draw the selected progress card - data {String}
  * @param match {Match}
  * @return player's current fishSum
  */
  Commands.buildRoadUseFish = function (userName, roomID, data) {
      let player = DATA.getPlayer(userName, roomID);
      let match = DATA.getMatch(roomID);
      Building.buildRoad(player, data, match, 'road');
  };

  /**
   * build a ship
   * @param userName {String}
   * @param roomID {String}
   * @param data {[int, int]} the edge where player wants to build the ship
   */
  Commands.buildShipUseFish = function (userName, roomID, data) {
      //TODO: improvement, combine buildRoad and buildShip
      let player = DATA.getPlayer(userName, roomID);
      let match = DATA.getMatch(roomID);
      Building.buildRoad(player, data, match, 'ship');
  };

Commands.spendFishToken = function(userName, roomID, data){
    let player = DATA.getPlayer(userName,roomID);
  //  let match = DATA.getMatch(roomID);
  //  player.spendFishToken(userName, roomID, data);
    let newSum = 0;
    switch(data.action){
      case "MOVE_ROBBER" :
      //TODO check knight chase away thief.
        if(player.getFishSum() >= 2){
          //Commands.moveRobber(username,roomID,{'oldHexID' = data.oldHexID, 'newHexID' = 0});
          Commands.moveRobber(userName, roomID, {'oldHexID' : data.oldHexID, 'newHexID' : 0});
          newSum = player.getFishSum() - 2;
          player.setFishSum(newSum);
        }
        else{
          return false;
        }
        break;

      case "MOVE_PIRATE" :
        if(player.getFishSum() >= 2){
          //Commands.movePirate(username,roomID,{'oldHexID' = data.oldHexID, 'newHexID' = 0});
          Commands.movePirate(userName, roomID, {'oldHexID' : data.oldHexID, 'newHexID' : 0});
          newSum = player.getFishSum() - 2;
          player.setFishSum(newSum);
        }
        else{
          return false;
        }
        break;

      case "STEAL_CARD" :
        if(player.getFishSum() >= 3){
          //Commands.stealCard(username, roomID, {'thief' = player.name, 'victim' = data.victim } ;
          Commands.stealCard(userName, roomID, {'thief' : player.name, 'victim' : data.victim });
          newSum = player.getFishSum() - 3;
          player.setFishSum(newSum);
        }
        else{
          return false;
        }
        break;

      case "DRAW_RES_FROM_BANK" :
        if(player.getFishSum() >= 4){
          //TODO
          //player.drawOneResourceCard(data);
          //draw one resource card but not Commodity
          Commands.drawOneResourceCard(userName, roomID, {'resCard' :data.resCard});
          newSum = player.getFishSum() - 4;
          player.setFishSum(newSum);
        }
        else{
          return false;
        }
        break;

      case "BUILD_ROAD" :
        if(player.getFishSum() >= 5){
          Commands.buildRoadUseFish(userName, roomID, data.data);
          newSum = player.fish - 5;
          player.setFishSum(newSum);
        }
        else{
          return false;
        }
        break;

      case "BUILD_SHIP" :
        if(player.getFishSum() >= 5){
          Commands.buildShipUseFish (userName, roomID, data.data);
          newSum = player.fish - 5;
          player.setFishSum(newSum);
        }
        else{
          return false;
        }
        break;

      case "DRAW_PROG" :
        if(player.getFishSum() >= 7){
          console.log(data);
          Commands.drawOneProgressCard(userName, roomID, {'progCard' : data.progCard});
          newSum = player.fish - 7;
          player.setFishSum(newSum);
        }
        else{
          return false;
        }

    }
          return player.fishSum;

};

/**
 *
 * @param roomID
 * @return {String} the name of the player to take next turn
 */
Commands.endTurn = function (userName, roomID, data) {
    let match = DATA.getMatch(roomID);
    match.nextPlayerToTakeTurn();
    notify.user(match.currentPlayer, 'TAKE_TURN', CircularJSON.stringify(DATA.getRoom(roomID)));
};

//progress cards =P
//data is empty where does object that we return in CommandsData goes?
Commands.executeProgressCard = function(userName, roomID, data){
    let player = DATA.getPlayer(userName, roomID);
    player.useCard(data.cardname);
};
