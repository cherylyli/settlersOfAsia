/**
 * Created by emol on 1/13/17.
 */
/**
 * Based on environment messages
 */
let DATA = require("./Data.js");
let Room = require('./gameLogic/Room.js');
let Match = require('./gameLogic/Match.js');
let Map = require('./gameLogic/Map.js');
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
let HexTile = require('./gameLogic/HexTile.js');
let _ = require('underscore');
let fs = require("fs");


let Commands = {} = module.exports;
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

 Commands.makeNewRoom = function (user, roomID, savedGameID, gameScenario, roomName) {
     //let user = DATA.getUser(userName);
     // if(!user) user = User.createUser(userName);

     //make new Room
     let room = Room.createRoom(savedGameID, roomID, user.name, gameScenario, roomName);


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
     User.joinGameRoom(user, room);
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
         Room.startGame(room);
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
     User.leaveRoom(user);

     if (room.match) room.match = null; //TODO: end game
     // FIXME: bug here
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



Commands.saveGame = function (userName, roomID) {
    let room = DATA.getRoom(roomID);
    // TODO: now just write to file, change this part later
    Room.saveGame(roomID, room);
};



 /**
  *
  * @param match {String}
  */

 Commands.rollDice = function (userName, matchID, data) {
     let match = DATA.getMatch(matchID);
     Match.rollDice(match);
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
         let hexIDs = Map.getHexTileArrayByVertex(map, position);
         for (let id of hexIDs){
             HexTile.produceResourceToSingleUser(Map.getHexTileById(map, id), match, player, building);
         }
     }
     if (match.phase == Enum.MatchPhase.TurnPhase) Bank.decreasePlayerAsset(match.bank, player, 'buildSettlement');
 };

 Commands.upgradeToCity = function (userName, roomID, data){
     let position = data.position;

     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     let map = match.map;

     let building = Player.getBuilding(player, position);
     //TODO: for testing, delete later,
     //FIXME: WHY WE HAVE THIS HERE????
     if (!building) building = Building.buildSettlement(player, position, map);
     Building.upgradeToCity(building);
     if (match.phase == Enum.MatchPhase.TurnPhase) Bank.decreasePlayerAsset(match.bank, player, 'upgradeToCity');

 };

 Commands.upgradeToMetropolis = function (userName, roomID, data) {
     let type = data.type;

     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     let building = Player.getBuilding(player, data.position);

     Match.distributeMetropolis(match, type, player, building);
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
         if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.decreasePlayerAsset(player, 'buildSettlement');
     }
     //!!payment and action are separate!!
     if (establishmentLv == 2){
         let building = player.getBuilding(position);
         //TODO: for testing, delete later
         if (!building) building = Building.buildSettlement(player, position, map);
         building.upgradeToCity();
         if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.decreasePlayerAsset(player,'upgradeToCity');
     }
     else{
         //build metropolitan
         //update assest
     }
 };**/
 Commands.tradeMonopoly = function (userName, roomID, data) {
     let players = Object.keys(DATA.getMatch(roomID).players).filter( name => {
         return name !== userName;
     });
     let myPlayer = DATA.getPlayer(userName, roomID);
     players.forEach(name =>{
         let player = DATA.getPlayer(name, roomID);
         if(player.resourcesAndCommodities[data.resource] >= 1){
             myPlayer.resourcesAndCommodities[data.resource] += 1;
             player.resourcesAndCommodities[data.resource] -= 1;
         }
     });
 };

Commands.resourceMonopoly = function (userName, roomID, data) {
    let players = Object.keys(DATA.getMatch(roomID).players).filter( name => {
        return name !== userName;
    });
    let myPlayer = DATA.getPlayer(userName, roomID);
    players.forEach(name =>{
        let player = DATA.getPlayer(name, roomID);
        if(player.resourcesAndCommodities[data.resource] >= 2){
            myPlayer.resourcesAndCommodities[data.resource] += 2;
            player.resourcesAndCommodities[data.resource] -= 2;
        }
    });
};



 /**
  * build
  * @param userName {String}
  * @param roomID {String}
  * @param data  {[int, int]} the edge where user wants to place the road
  */
 Commands.buildRoad = function (userName, roomID, data) {
     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     Building.buildRoad(player, data, match, 'road');

     if (match.phase == Enum.MatchPhase.TurnPhase) {
       if(match.fish == "BUILD_ROAD"){
            Bank.decreasePlayerFish(match.bank, player,'buildUseFish');
            match.fish = null;
       }
       else {
        if (Player.freeRoadsOrShips>0){
            Player.freeRoadsOrShips--;
        } else{
            Bank.decreasePlayerAsset(match.bank, player,'buildRoad');
        }
       }
     }
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

     if (match.phase == Enum.MatchPhase.TurnPhase) {
       if(match.fish == "BUILD_SHIP"){
            Bank.decreasePlayerFish(match.bank, player,'buildUseFish');
            match.fish = null;
       }
       else {
        if (Player.freeRoadsOrShips>0){
            Player.freeRoadsOrShips--;
        } else{
            Bank.decreasePlayerAsset(match.bank, player,'buildShip');
        }
       }
     }
     //if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.decreasePlayerAsset(player,'buildShip');
 };


 /**
  *
  * @param roomID {String}
  * @param vertex {int}
  */
 Commands.buildCityWall = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let city = Map.getVertexInfo(match.map, data.position);
     Building.buildCityWall(city);

     Bank.decreasePlayerAsset(match.bank, city.owner, 'buildCityWall');
 };


 /**
  * @param roomID {String}
  * @param vertex {int}
  */
 // TODO: chagne vertex to data

 Commands.chooseCityToBePillaged = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let vertex = data.position;
     let city = Map.getVertexInfo(match.map, vertex);
     Building.pillage(city);
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
     let level = Player.buyCityImprovement(player, cityImprovementCategory);
     //Match.getMetropolisList(match, cityImprovementCategory);
     Bank.decreasePlayerAsset(match.bank, player, 'cityImprove_' + cityImprovementCategory + '_' + level);
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
     let ship = Map.getEdgeInfo(match.map, oldPosition);
     Building.move(ship, oldPosition, newPosition, match);
 };


 //--------------------------Knight---------------------------
 /**
  *
  * @param position {int} vertex id. the position player wants to place the knight.
  * If player don't want to put the knight on board now, position is left null.
  */
 Commands.hireKnight = function (userName, roomID, data) {
     let player = DATA.getPlayer(userName, roomID);
     let match = DATA.getMatch(roomID);
     Knight.hireKnight(player, match.map, data.position);

     Bank.decreasePlayerAsset(match.bank, player, 'hireKnight');
 };


 /**
  *
  */
 Commands.activateKnight = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let knight = Map.getVertexInfo(match.map, data.position);
     Knight.activate(knight, match);

     Bank.decreasePlayerAsset(match.bank, knight.owner, 'activateKnight');
 };


 /**
  *
  */
 Commands.promoteKnight = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let knight = Map.getVertexInfo(match.map, data.position);
     Knight.promote(knight);

     // if Player.freeUpgradeKnights > 0, don't decrease Player Assest
     if (Player.freeUpgradeKnights>0){
         Player.freeUpgradeKnights--;
     } else{
        Bank.decreasePlayerAsset(match.bank, knight.owner, 'promoteKnight');
     }
 };

 /**
  *
  */
 Commands.moveKnight = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let player = DATA.getPlayer(userName, roomID);

     let knight =  (player.displacedKnight) ? player.displacedKnight : Map.getVertexInfo(match.map, data.position);
     /**
     if (player.displacedKnight){
        // he moves the knight because his knight is displaced
        knight = player.displacedKnight;
     }

     else {
         knight = Map.getVertexInfo(match.map, data.position);
         // there may be opponent knight at the new position -> displace knight
         let opponentKnight = Map.getVertexInfo(match.map, data.newPosition);
         if (opponentKnight && opponentKnight.vertexUnitType == "knight") {
             // the opponent knight is displaced
             Knight.place(opponentKnight, 0, match.map);
             // check if the knight has to be move off board
             let offboard;
             let possibleSpots = Player.getEmptyAdjacentVertices(opponentKnight, data.newPosition, match);
             offboard = (possibleSpots.length() == 0);
             opponentKnight.possibleSpots = possibleSpots;
             // TODO: check here
             // notify the opponent to move his knight
             notify.user(opponentKnight.owner.name, "KnightDisplaced", {opponent: player.name, offBoard: offboard});
         }
     }
**/
     let result = Knight.move(knight, data.newPosition, match.map);
     let dataToSend = result ? {opponent: player.name, displacedKnight: result.displacedKnight} : null;

     // player.displacedKnight = null;
     if (result) notify.user(result.victim, "KnightDisplaced", CircularJSON.stringify(dataToSend));
 };


 /**
  *
  */
 /**
 Commands.displaceKnight = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     let knight = Map.getVertexInfo(match.map, data.position);
     let opponentKnightInfo = Knight.move(knight, data.newPosition, match.map);
     /**
      * TODO: notify the other player
      */
// };

 /**
  *
  */
 Commands.chaseAwayThief = function (userName, roomID, data) {
     let match = DATA.getMatch(roomID);
     // chaseAwayThief = function (knightPosition, thiefType)
     let knight = Map.getVertexInfo(match.map, data.knightPosition);
     Knight.chaseAwayThief(knight, match);
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
     Bank.tradeWithBank(match.bank, player, src, tradeFor);
 };
 //TODO special case trade with bank - fishmen ver, only trade resources.



 /**
  *
  * @param cards {Array<String>} resource/ commodity cards the player chooses to discard
  */
 Commands.discardResourceCards = function (userName, roomID, data) {
     let player = DATA.getPlayer(userName, roomID);
     Player.discardResourceCards(player, data.cards);
 };


 /**
  * create trade object, notifies all the other players about the trade offer.
  */
 Commands.requestTrade = function (userName, roomID, data) {
     console.log("TRADE was requested:");
     console.log(data);
     let trade = Trade.createTrade(data.selling, data.buying, data.targetPlayer);
     DATA.getMatch(roomID).currentTrade = trade;
 };


/**
 * It performs exchange between buyer and seller
 * We need to assert that seller and buyer have enough of resources to engage in trade
 * We need to send notification to the user when transaction is done
 * @param buyerName
 * @param sellerName
 * @param roomID
 */
Commands.performTradeTransaction = function(userName, roomID, data){
    console.log("Performing transaction:"+userName+"<->"+data.tradeWith);
    let initiator = DATA.getPlayer(userName, roomID);
    let tradeWith = DATA.getPlayer(data.tradeWith, roomID);
    let match = DATA.getMatch(roomID);
    let trade = match.currentTrade;
    Trade.performTrade(initiator,tradeWith,trade);
    match.currentTrade = null; //we are resetting trade object
};

Commands.cancelTrade = function(roomID){
    let match = DATA.getMatch(roomID);
    match.currentTrade = null;
};

/**
 * We add user that accepted to the current trade.
 * Unhandled cases: What is going to happen if player quits withoput answering to trade request?
 * @param userName
 * @param roomID
 * @param acceptedTrade
 */
 Commands.acceptTrade = function (userName, roomID, data) {
     DATA.getMatch(roomID).currentTrade.participated[userName] = userName;  //we use this to make sure that every player has answered yes or no to trade
     let match = DATA.getMatch(roomID);
     if(data.accept && !data.commodity) {
         console.log("TRADE WAS ACCEPTED:");
         match.currentTrade.accepted[userName] = userName;//we add list of players who accepted current trade
     }
     else if(data.accept && data.commodity){
         //we are adding commodity that the player has choosen
         //we are only targeting one player at a time when we use commercialHarbor card
         console.log("CommercialHarbor has been used");
         let commodity_name = data.commodity;
         match.currentTrade.buying[commodity_name] = 1;
         match.currentTrade.accepted[userName] = userName;
         Object.keys(DATA.getMatch(roomID).players).forEach( player =>{
             DATA.getMatch(roomID).currentTrade.participated[player] = player;
         });
     }
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
     Bank.tradeWithPlayer(match.bank, data.playerA, data.playerB, data.trade);
 };

//spend fish tokens  + add checkers
Commands.moveRobber = function (userName, roomID, data) {
  let match = DATA.getMatch(roomID);
  let robber = match.map.robber;
  let player = DATA.getPlayer(userName,roomID);
  let hextile1 = 0;
  let hextile2 = 0;
  if(robber.pos != 0){
    hextile1 = Map.getHexTileById(match.map, robber.pos);
  }
  if(data.newHexID != 0){
    hextile2 = Map.getHexTileById(match.map, data.newHexID);
  }
  if(match.fish == "MOVE_ROBBER"){
    match.fish = null;
  }
  //robber.hasToDiscardCards(match.players);
  Robber.moveTo(robber, hextile1,hextile2,match);

  if (!match.dice.moveThiefResultConfiged && match.dice.numberDiceResult == 7){
        match.dice.moveThiefResultConfiged = true;
  }
};


Commands.movePirate = function (userName, roomID, data) {
  let match = DATA.getMatch(roomID);
  let pirate = match.map.pirate;
  let player = DATA.getPlayer(userName,roomID);
  let hextile1 = 0;
  let hextile2 = 0;
  if(pirate.pos != 0){
    hextile1 = Map.getHexTileById(match.map, pirate.pos);
  }
  if(data.newHexID != 0){
    hextile2 = Map.getHexTileById(match.map, data.newHexID);
  }
  if(match.fish == "MOVE_PIRATE"){
    match.fish = null;
  }
  Pirate.moveTo(pirate, hextile1, hextile2, match);

  if (!match.dice.moveThiefResultConfiged && match.dice.numberDiceResult == 7){
      match.dice.moveThiefResultConfiged = true;
  }
};


/**
 * @param theif {Player}
 * @param victim {Player}
 */
Commands.stealCard = function (userName, roomID, data) {
    let match = DATA.getMatch(roomID);
    let playerA = DATA.getPlayer(userName, roomID);
    let playerB = DATA.getPlayer(data.victim, roomID);
    let card = Player.stolenBy(playerB, playerA);
    if(match.phase == Enum.MatchPhase.TurnPhase){
      if(match.fish == "STEAL_CARD"){
        Bank.decreasePlayerFish(match.bank, playerA,'stealUseFish');
        match.fish = null;
      }
    }

    notify.user(playerB.name, 'StolenBy', {theif: playerA.name, card: card});
};

Commands.drawOneProgressCard = function(userName,roomID,data){
    var kind = data.kind;
    let match = DATA.getMatch(roomID);
    let players = DATA.getMatch(roomID).players;
    var player = DATA.getPlayer(userName, roomID);
    Player.drawOneProgressCard(player, match,kind);

    if (match.phase == Enum.MatchPhase.TurnPhase){
      if(match.fish == "DRAW_PROG"){
         Bank.decreasePlayerFish(match.bank, player,'drawProgUseFish');
         match.fish = null;
      }

    }
}

/*
Commands.drawOneProgressCard = function (userName, roomID, data){
   let player = DATA.getPlayer(userName, roomID);
   player.drawOneProgressCard(data.progCard);
};
*/

Commands.drawOneResourceCard = function (userName, roomID, data){
  let match = DATA.getMatch(roomID);
  let player = DATA.getPlayer(userName, roomID);
  Player.drawOneResourceCard(player, data.resCard);
  if (match.phase == Enum.MatchPhase.TurnPhase){
    if(match.fish == "DRAW_RES_FROM_BANK"){
       Bank.decreasePlayerFish(match.bank, player,'drawResUseFish');
       match.fish = null;
     }
  }
};
/**
 *
 * @param player {Player}
 * @param progressCard List<String> progress card
 */
Commands.discardOneProgressCard = function (userName, roomID, data) {
  let player = DATA.getPlayer(userName, roomID);
    Player.discardOneProgressCard(player, data.card);
};

Commands.giveAwayBoot = function(userName, roomID, data){
  let playerA = DATA.getPlayer(userName, roomID);
  let playerB = DATA.getPlayer(data.transferTo, roomID);
  Player.giveAwayBoot(playerA, playerB);
};

Commands.spendFishToken = function(userName, roomID, data){
  let player = DATA.getPlayer(userName, roomID);
  let match = DATA.getMatch(roomID);
  if(data.action == "MOVE_ROBBER"){
    Commands.moveRobber(userName, roomID, {'newHexID' : 0});
    Bank.decreasePlayerFish(match.bank, player,'moveUseFish');
    match.fish = null;
  }
  if(data.action == "MOVE_PIRATE"){
    Commands.movePirate(userName, roomID, {'newHexID' : 0});
    Bank.decreasePlayerFish(match.bank, player,'moveUseFish');
    match.fish = null;
  }
  Player.spendFishToken(player, data.action, match);
  //if (match.phase == Enum.MatchPhase.TurnPhase) match.bank.decreasePlayerFish(player,'buildUseFish');

};

/**
 *
 * @param roomID
 * @return {String} the name of the player to take next turn
 */
Commands.endTurn = function (userName, roomID, data) {
    let player = DATA.getPlayer(userName, roomID);
    player.active_cards = {}; //we need to delete all of the previously active cards
    Player.freeRoadsOrShips = 0; // delete free roads
    Player.freeUpgradeKnights = 0; // delete free knight upgrades
    let match = DATA.getMatch(roomID);
    Match.nextPlayerToTakeTurn(match);
    notify.user(match.currentPlayer, 'TAKE_TURN', CircularJSON.stringify(DATA.getRoom(roomID)));
};

//progress cards =P
//data is empty where does object that we return in CommandsData goes?
Commands.executeProgressCard = function(userName, roomID, data){
    console.log("PROGRESS CARDS EXECUTED");
    // console.log(data);
    let player = DATA.getPlayer(userName, roomID);
    Player.useCard(player, data.cardname);
};
