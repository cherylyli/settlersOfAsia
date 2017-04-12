//(function(){
let Commands = {};
let CommandsData = {};

// commands require more than 1 steps
let SpecialsCommands = {
    'moveKnight': 'moveKnight',
    'upgradeToMetropolis': 'upgradeToMetropolis',
    'moveShip': 'moveShip',
    'requestTrade': 'requestTrade'
};

// this map to functions
let SpecialsCommandsNextStep = {};

let SpecialsCommandsFinalStep = {};
let vCommand = {
    'buildSettlement': 'buildSettlement',
    'hireKnight' : 'hireKnight',
    'upgradeToCity': 'upgradeToCity',
    'buildCityWall': 'buildCityWall',
    "upgradeToMetropolis": 'upgradeToMetropolis',
    'chooseCityToBePillaged': 'chooseCityToBePillaged',
    'chaseAwayThief': 'chaseAwayThief',
    'activateKnight': 'activateKnight',
    'promoteKnight': 'promoteKnight',
    'moveKnight': 'moveKnight',
    'buildRoad': 'buildRoad',
    'buildShip': 'buildShip',
    'moveShip': 'moveShip'
};
// commands triggered by clicking a vertex
let VertexCommand = {
    "UnoccupiedVertex": {
        'buildSettlement': 'buildSettlement',
        'hireKnight' : 'hireKnight'
    },

    "Settlement": {
        'upgradeToCity': 'upgradeToCity',

    },

    "City": {
        'buildCityWall': 'buildCityWall',
        "upgradeToMetropolis": 'upgradeToMetropolis',
        'chooseCityToBePillaged': 'chooseCityToBePillaged'
    },

    "Knight": {
        'chaseAwayThief': 'chaseAwayThief',
        'activateKnight': 'activateKnight',
        'promoteKnight': 'promoteKnight',
        'moveKnight': 'moveKnight'
    }

};


// commands triggered by clicking an edge
let EdgeCommand = {
    "UnoccupiedEdge": {
        'buildRoad': 'buildRoad',
        'buildShip': 'buildShip'
    },

    "Ship": {
        'moveShip': 'moveShip'
    }
};

// commands triggered by clicking a hex tile
let HexCommand = {
    'moveRobber': 'moveRobber',
    'movePirate': 'movePirate'
    // TODO: MAX, we may need command like place merchant for the merchant progress card
};

let ProgressCardCommand = {
    'discardOneProgressCard': 'discardOneProgressCard',
    'executeProgressCard': 'executeProgressCard'
};


// Command whose input is another player

let PlayerCommand = {
    'stealCard': 'stealCard',
    'giveAwayBoot': 'giveAwayBoot',
    'requestTrade': 'requestTrade'
};


let CommandName = {
    'saveGame': 'saveGame',
    'rollDice': 'rollDice',
    'buildSettlement': 'buildSettlement',
    'upgradeToCity': 'upgradeToCity',
    // 'buildEstablishment': 'buildEstablishment',
    'buildRoad': 'buildRoad',
    'buildShip': 'buildShip',
    'endTurn': 'endTurn',
    'buildCityWall': 'buildCityWall',
    'buyCityImprovement': 'buyCityImprovement',
    'moveShip': 'moveShip',
    'tradeWithBank': 'tradeWithBank',
    'discardOneProgressCard': 'discardOneProgressCard',
    'stealCard': 'stealCard',
    'drawOneResourceCard': 'drawOneResourceCard',
    'giveAwayBoot': 'giveAwayBoot',
    'drawOneProgressCard': 'drawOneProgressCard',
    'discardResourceCards': 'discardResourceCards',
    'chaseAwayThief': 'chaseAwayThief',
    'hireKnight': 'hireKnight',
    'activateKnight': 'activateKnight',
    'promoteKnight': 'promoteKnight',
    'moveKnight': 'moveKnight',
    "upgradeToMetropolis": 'upgradeToMetropolis',
    'chooseCityToBePillaged': 'chooseCityToBePillaged',
    'moveRobber': 'moveRobber',
    'movePirate': 'movePirate',
    'spendFishToken': 'spendFishToken',

    'requestTrade': 'requestTrade',
    'acceptTrade': 'acceptTrade',
    'performTradeTransaction':'performTradeTransaction',
      //INPROGRESS:
    'executeProgressCard': 'executeProgressCard'


};

let CommandReceived = {};

    let CommandSuccMsg = {
        'rollDice': "Hummmmm...",
        'buildEstablishment': 'Settlement is only the first step of our great journey.',
        'buildSettlement': "Settlement is only the first step of our great journey.",
        'upgradeToCity': 'Awesome, we have one more city!',
        'buildRoad': 'We are expanding territory!',
        'buildShip': 'The sea worths exploring.',
        'buyCityImprovement': 'Our cities are blessed by Catan God!',
        'moveShip': 'Sailing in the sea...',
        'tradeWithBank': 'Deal!',
        'endTurn': 'Hummmm... I think I am done.',
        'executeProgressCard':'Progress Card was applied',
        'discardOneProgressCard': 'Discarded.'
    };



let CommandCheck = {};

let room = {users: {}};

/**
 *
 * @param gameID {int} 1-3
 */
function testGame(gameID) {
    sock.emit('TEST_GAME', gameID);
    sock.on('TEST_GAME_ACK', function (msg) {
        console.log(msg, "TESTING");
    });
}


//============================REQUIRE TEST ==============================

CommandsData.saveGame = function () {
    return null;
};

CommandCheck.saveGame = function () {
    return (app.room && app.room.match);
};

/**
 *
 * @param vertex {int}
 * @return {{position: int}}
 */
CommandsData.upgradeToMetropolis = function (vertex, metropolisType) {
    return {'position': vertex, 'type': metropolisType};
};

CommandCheck.upgradeToMetropolis = function (vertex, metropolisType) {
     //check if player has a metropolis to add on a city.
    //if (DATA.getMatch().redistributeM[metropolisType] == DATA.getMyPlayer().name) {
    if (DATA.getMatch().Metropolis[metropolisType] == DATA.getMyPlayer().name) {
      let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
      if (!vertexUnit || isKnight(vertexUnit) || isSettlement(vertex)) {
          swalError2("There is no city at this position!");
          return false;
      }
      if (vertexUnit.level == metropolisType) {
          swalError2("This city already has metropolis!");
          return false;
      }
      return true;
    }
    //player doesn't have a metropolis at all.
    swalError2("You don't have " + metropolisType + "!");
    return false;
};

CommandsData.chooseCityToBePillaged = function (vertex) {
    return {'position': vertex}
};

CommandCheck.chooseCityToBePillaged = function (vertex) {
    if(!app.pillageCity){
      swalError2("You don't need to downgrade your city");
      return false;
    }
    let match = DATA.getMatch();
    let player = DATA.getMyPlayer();
    let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
    if (!vertexUnit || isKnight(vertexUnit) || isSettlement(vertex)) {
        swalError2("There is no city at this position!");
        return false;
    }
    if (vertexUnit.hasMetropolis) {
        swalError2("City has a metropolis, can't be pillaged");
        return false;
    }
    else {
        app.pillageCity = false;
        return true;
    }
};



//TRADE WITH PLAYER ==================================

/**
 *
 * @param offer   {Object} key : {String} card, val: {int} # of card,  --> the cards u offer
 * @param request   {Object} key : {String} card, val: {int} # of card,   --> the cards u request for, if we use the progress card, we leave req null
 */
CommandsData.requestTrade = function (selling, buying, targetPlayer) {
        return {'selling': selling, 'buying': buying, 'targetPlayer':targetPlayer};
};

CommandsData.performTradeTransaction = function (tradeWith) {
    return {'tradeWith': tradeWith};
};

// CommandCheck.requestTrade = function (selling, buying, targetPlayer) {
//     // check if we have the cards we offer
//     checkEnoughResource(selling);
// };

CommandReceived.performTradeTransaction = function () {
    swal('Trade ended :D');
    //DATA.getMatch().currentTrade
    //maybe set a flah so that we know with whom trade was performed
    //don't delete trade right away it is going to be overwritted later anyway
    //don't delete trade right away it is going to be overwritted later anyway
    //just check who is left in the currentTrade
};

//we need to wait until all players accept or decline trade
//we can do it by adding counter inside of current trade and check it after
CommandReceived.acceptTrade = function () {
    let active_cards = DATA.getPlayer(DATA.getMatch().currentPlayer).active_cards;
    //if not everyone participated we are not showing anything and commercialHarborIsNotActive
    if (!(Object.keys(DATA.getMatch().currentTrade.participated).length === Object.keys(DATA.getMatch().players).length - 1) && Object.keys(active_cards).indexOf("CommercialHarbor") === -1) {
        console.log("skip");
        return;
    }
    if (DATA.getMatch().currentPlayer === DATA.getMyPlayer().name) {
        if (Object.keys(DATA.getMatch().currentTrade.accepted).length > 0) {
            swal({
                    title: "Please choose a player to trade with",
                    text: "Players that accepted trade:" + JSON.stringify(DATA.getMatch().currentTrade.accepted),
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Write down name of the player with whom you want to trade :)"
                },
                function (inputValue) {
                    if (inputValue === false) {
                        return false;
                    }

                    if (inputValue === "") {
                        swal.showInputError("You need to write something =|");
                        return false
                    }
                    if (Object.keys(DATA.getMatch().players).indexOf(inputValue) !== -1) {
                        swal("Nice!", "You are going to trade with " + inputValue, "success");
                        Commands.performTradeTransaction(inputValue);
                    }
                    else {
                        swal.showInputError("You need to provide correct username!");
                    }
                });
        }
        else {
            swal({
                title: "Everyone Declined Trade",
                text: "Unfortunately everyone declined trade",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "ok =(",
                closeOnConfirm: false
            });
        }
    }
};


//In case of Comercial Harbor, if player is bankrupt then nothing is happening
CommandReceived.requestTrade = function () {
    let active_cards = DATA.getPlayer(DATA.getMatch().currentPlayer).active_cards;
    if(DATA.getMatch().currentPlayer === DATA.getMyPlayer().name) {
        //we are not trading with ourselves
    }
    else if(DATA.getMyPlayer().name === DATA.getMatch().currentTrade.targetPlayer) {//if we are the player for whom this trade is intended
        let player_resources = DATA.getMyPlayer().resourcesAndCommodities;
        if (Object.keys(active_cards).indexOf("CommercialHarbor") !== -1) { //if we have commercialHarborActive
            let allowed_input = {};
            let commodities = ['Paper', 'Coin', 'Cloth', 'Gold']; //gold is not a commodity, added for quicker testing
            //we want to give from resources that we have
            Object.keys(player_resources).forEach(res => {
                if (0 < player_resources[res] && commodities.indexOf(res) !== -1) {
                    allowed_input[res] = res;
                }
            });
            console.log("ALLOWED_INPUT");
            console.log(allowed_input);

            swalService.swal({
                    title: "Comercial Harbor is ACTIVE =O",
                    text: "Write name of commodity that you are going to give:",
                    type: "input",
                    showCancelButton: false,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Cloth, Coin, Paper"
                },
                //we need to do something in case player does not have any resources right now, player is bankrupt
                function (inputValue) {
                    if (inputValue === "") {
                        swal.showInputError("You need to write something!");
                        return false
                    }
                    else if (Object.keys(allowed_input).indexOf(inputValue) !== -1) { //we can give this res
                        //we need to modify current trade somehow
                        //like currentTrade:{ playerA: {sells: b}}
                        //Maybe add some flag inside of current trade to dimultiplex
                        //we need to do these operations through acceptTrade we are just going to add extra arguments to it
                        Commands.acceptTrade(true, inputValue);
                        swal("Trade concluded", "You wrote: " + inputValue, "success");
                        return true;
                    }
                    else {
                        swal.showInputError("You need to provide resource that you have!");
                    }
                });
            //current player has ComercialHarbor active
            //we are obliged to give him one of our resources
            //by the end of the trade we need to delete this progress card
        }
    }else if(_.keys(active_cards).indexOf("CommercialHarbor") === -1){
        let selling = DATA.getMatch().currentTrade.selling;
        let buying = DATA.getMatch().currentTrade.buying;
        console.log(selling);
        console.log(DATA.getMatch().currentTrade);
        swalService.swal({
                title: "TRADE ??? =)",
                text: DATA.getMatch().currentPlayer + " wants to buy: " + JSON.stringify(buying) + " and wants to sell: " + JSON.stringify(selling),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "TRADE RESOURCES!",
                cancelButtonText: "NOOO!!",
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    console.log(hasEnougOfResources(buying));
                    if(hasEnougOfResources(buying)) {
                        swal("Trade started!", "Your trade response was sent", "success");
                        Commands.acceptTrade(true);
                    }
                    else{
                        swal.showInputError("You dont have enough of resources to trade!");
                        return false;
                    }
                } else {
                    Commands.acceptTrade(false);
                }
            });
    }
};

let hasEnougOfResources = function(resources){
    let player_resources = DATA.getMyPlayer().resourcesAndCommodities;
    let enough = true;
    Object.keys(resources).forEach(res => {
        if(!(player_resources[res] >= resources[res])){
            enough = false;
        }
    });
    return enough;
};
//ROBBER ==================================
    /**
     * moveRobber
     * @return true/false
     */

    CommandsData.moveRobber = function (newHexID){
      if(DATA.getMatch().fish == "MOVE_ROBBER"){
        newHexID = 0;
      }
      return {'newHexID' : newHexID};
    };

//consider different cases: move off board, move from a to b, move from null to b
CommandCheck.moveRobber = function (newHexID) {
  if(DATA.getMatch().fish == "MOVE_ROBBER"){
    //newHexID = 0;
    return true;
  }

  if (newHexID != 0) { //
        var newHex = DATA.getMatch().map.getHexTileById(newHexID);
        if (newHex.blockedByRobber == false && newHex.type != Enum.HexType.Sea && newHex.type != Enum.HexType.Lake) {
            app.rolledSeven = false;
            return true;
        }
        else {
            swalError2("Invalid Position. Please select a landTile to perform such action.");
            return false;
        }
  }
  swalError2("You cannot move robber off board");
  return false;

};



CommandReceived.moveRobber = function () {
    if (app.rolledSeven) app.rolledSeven = null;
    if (app.ongoingCmd == "moveThief") app.ongoingCmd = null;

    if (DATA.getMyPlayer().name != DATA.getMatch().currentPlayer) return;
    let newHex = DATA.getMap().getHexTileById(DATA.getMap().robber.pos);
    let stealList = HexTile.getPlayersAroundByBuildings(newHex, DATA.getMap());
    notifyUserToStealCard(stealList);
};



CommandReceived.movePirate = function () {
    if (app.rolledSeven) app.rolledSeven = null;
    if (app.ongoingCmd == "moveThief") app.ongoingCmd = null;

    if (DATA.getMyPlayer().name != DATA.getMatch().currentPlayer) return;
    let newHex = DATA.getMap().getHexTileById(DATA.getMap().pirate.pos);
    let stealList = HexTile.getPlayersAroundByBuildings(newHex, DATA.getMap());
    notifyUserToStealCard(stealList);
};
/**
 *
 * @param newHexID {int}
 * @return {newHexID: *}
 */
CommandsData.movePirate = function (newHexID) {
    return {'newHexID': newHexID};
};

/**
 * moveRobber
 * @return {boolean}
 */

//consider different cases: move off board, move from a to b, move from null to b
CommandCheck.movePirate = function (newHexID) {
  if(DATA.getMatch().fish == "MOVE_PIRATE") {
    return true;
  }

  if (newHexID != 0) { //
      var newHex = DATA.getMatch().map.getHexTileById(newHexID);
      if (newHex.blockedByPirate == false && newHex.type === Enum.HexType.Sea) {
          app.rolledSeven = false;
          return true;
      }
      else {
          swalError2("Invalid Position. Please select a seaTile.");
          return false;
      }
    }
    swalError2("You cannot move robber off board");
    return false;
};

CommandsData.stealCard = function (victimUserName) {
    //var victim = DATA.getPlayer(victimUserName);
    return {'victim': victimUserName};
};

CommandCheck.stealCard = function (victimUserName) {
    if (!_.contains(app.ongoingCmdData, victimUserName)) swalError2("You can not steal from this person!");
    let victim = DATA.getPlayer(victimUserName);
//    if(DATA.getMatch().fish == "STEAL_CARD" || app.rolledSeven){
      if (victim.resourceCardTotalNum(victim) < 1) {
          swalError2("The victim player doesn't have enough resources to be stoled");
          return false;
      }
      else {
          return true;
      }
//    }
//    return false;
};
//input : {String} "Trade" / "Science" / "Politics"
CommandsData.drawOneProgressCard = function (kind) {
    return {'kind': kind};
};

CommandCheck.drawOneProgressCard = function (kind) {
  /**if(app.canDraw){
    //swalError2("Please draw one " + kind + "progCard");
    app.canDraw = false;
    return true;
  }**/
  //swalError2("You cannot draw a progress card.");
    //return false;
    return true;
};

CommandReceived.drawOneProgressCard = function () {
  if (DATA.getMyPlayer().progressCardsCnt >= 5){
      notifyUserToDiscardProgressCard();
  }
};

//input string
CommandsData.drawOneResourceCard = function (resCard) {
    return {'resCard': resCard};
};

CommandCheck.drawOneResourceCard = function (resCard) {
    var res = ['Grain', 'Lumber', 'Wool', 'Brick', 'Ore'];
    var found = 0;
    for (var i in res) {
        if (res[i] == resCard) {
            found = 1;
        }
    }
    if (DATA.getMatch().fish == "DRAW_RES_FROM_BANK") {
        return true;
    }
    else {
        swalError2("Player can only use the fish token to draw one resource card");
        return false;
    }
};


CommandsData.discardOneProgressCard = function (progCard) {
    return {card: progCard};
};

CommandCheck.discardOneProgressCard = function (progCard) {
    let player = DATA.getMyPlayer();
    if (player.progressCardsCnt < 1) {
        console.log("Player doesn't have enough progress cards");
        return false;
    }
    for (var i = 0; i < player.progressCardsCnt; i++) {
        if (progCard == player.progressCards[i])
            return true;
    }
    swalError2("Card not found!");
    return false;
};

CommandsData.giveAwayBoot = function (transferTo) {
    return {'transferTo': transferTo};
};

CommandCheck.giveAwayBoot = function (transferTo) {
    let playerA = DATA.getMyPlayer();
    let playerB = DATA.getPlayer(transferTo);
    if (playerA.hasBoot == true && playerB.hasBoot == false) {
        if (playerA.VP <= playerB.VP) {
            return true;
        }
        else {
            swalError2("Transfer boot failed because selected player doesn't have enough vp.");
        }
    }
    else {
        swalError2("Error, you don't have a boot.");
    }
}


CommandsData.spendFishToken = function (action) {
    return {'action': action};
};


CommandCheck.spendFishToken = function (action) {
    //TODO Yuan add checkPlayerAsset for fish token
    let player = DATA.getMyPlayer();
    if((action == "MOVE_ROBBER" || action == "MOVE_PIRATE") && checkEnoughFish(Cost.moveUseFish)){
      return true;
    }
    if(action == "STEAL_CARD" && checkEnoughFish(Cost.stealUseFish)){
      return true
    }
    if(action == "DRAW_RES_FROM_BANK" && checkEnoughFish(Cost.drawResUseFish)){
      return true;
    }
    if((action == "BUILD_ROAD" || action == "BUILD_SHIP" )&& checkEnoughFish(Cost.buildUseFish)){
      return true;
    }
    if(action == "DRAW_PROG" && checkEnoughFish(Cost.drawProgUseFish)){
      app.canDraw = true;
      return true;
    }
    swalError2("Not enough fish tokens");
    return false;
};

//TODO Yuan deactive knights
CommandsData.hireKnight = function (position) {
    return {'position': position}
};


CommandCheck.hireKnight = function (position) {
    //copy the build settlement conditions here
    //knight must be connected to one end o

    //check if the vertex is not empty
    if (DATA.getMatch().map.getVertexInfo(position)) {
        swalError2("Invalid position!");
        return false;
    }

        /**
         *
         * @type {Array.<edge>}
         */
        let connectedEdges = DATA.getMatch().map.getEdgeByVertex(position);
        //flags
        let connectedToOneRoad = false;

        for (let e of connectedEdges) {
            //check if connected to one road
            let road = DATA.getMatch().map.getEdgeInfo(e);
            if (road && road.owner.name == DATA.getMyPlayer().name) {
                //we have a road connected with the settlement
                connectedToOneRoad = true;
            }
        }


        if (!connectedToOneRoad) {
            swalError2("Knight should be connected with at least one of your road.");
            return false;
        }

        //cannot build in sea
        let inSea = true;
        for (let hexID of DATA.getMatch().map.getHexTileArrayByVertex(position)) {
            if (!(DATA.getMatch().map.getHexTileById(hexID).type == Enum.HexType.Sea)) {
                inSea = false;
            }
        }

        if (inSea) {
            swalError2("Cannot place knights in sea!");
            return false;
        }

    if (!checkEnoughResource(Cost.hireKnight)) {
        swalError2("Not enough resource to purchase a knight");
        return false;
    }
        return true;

};

CommandsData.activateKnight = function (position) {
    return {'position': position};
};

CommandCheck.activateKnight = function (position) {
    var knight = DATA.getMatch().map.getVertexInfo(position);
    if (knight.active) {
        swalError2("Knight has already been activated");
        return false;
    }
    if (!checkEnoughResource(Cost.activateKnight)) {
        swalError2("Not enough resource to activate a knight");
        return false;
    }
    else {
        return true;
    }
};

CommandsData.promoteKnight = function (position) {
    return {'position': position};
};

CommandCheck.promoteKnight = function (position) {
    var knight = DATA.getMatch().map.getVertexInfo(position);
    if (knight.hasBeenPromotedThisTurn) {
        swalError2("Knight has already been promoted");
        return false;
    }
    if (!checkEnoughResource(Cost.promoteKnight)) {
        // if player has freeKnightUpgrades
        if (DATA.getMatch().player[DATA.getMatch().currentPlayer].freeUpgradeKnights>0){
            // if player has free knight upgrades, can upgrade even if there's enough resources

        }else{
            swalError2("Not enough resource to promote a knight");
            return false;
        }

    }
    //if player has a fortress (i.e enters the 3rd level of politics,
    //they can promote a strong knight to a mighty knight
    //otherwise the highest level of knight they can promote to is level 2- strong knight
    if (DATA.getMyPlayer().cityImprovement[Enum.cityImprovementCategory.Politics] >= 3) {
       if(knight.level == 3){
        swalError2("You've got the strongest knight already.");
        return false;
      }
      else{
        return true
      }
    }
    else{
      if(knight.level == 2){
       swalError2("To upgrade your current knight, you need a Fortress.");
       return false;
      }
      return true;
    }
};

CommandsData.moveKnight = function (position, newPosition) {
    return {'position': position, 'newPosition': newPosition};
};

CommandCheck.moveKnight = function (position, newPosition) {

  //for move knight and chase away thief - knight must be activated during the last turn
  //otherwise return false;
    if (DATA.getMyPlayer().name == DATA.getMatch().currentPlayer){

        var knight = DATA.getMatch().map.getVertexInfo(position);
        if(DATA.getMatch().turnNum == knight.activatedInRound || !knight.active){
            swalError2("Error, knight must be activated in previous turn to perform such action.");
            return false;
        }
        if (knight.hasMovedThisTurn) {
            swalError2("Error, knight has been moved this turn");
            return false;
        }
    }

    var player = DATA.getMyPlayer();
    if (player.displacedKnight && position == 0) knight = player.displacedKnight;
    return (_.contains(knight.possibleSpots, newPosition))
};

/*
CommandsData.displaceKnight = function (position, newPosition) {
    return {'position': position, 'newPosition': newPosition};
};

CommandCheck.displaceKnight = function (position, newPosition) {
    var knight = DATA.getMatch().map.getVertexInfo(position);
    var opponent = DATA.getMatch().map.getVertexInfo(newPosition);
    if(knight.level < opponent.level){
      swalError2("Error, your knight is not strong enough");
      return false;
    }
    return true;
    //TODO -read rules and change this part

}
*/



/**
 *
 * @param knightPosition {int}
 */
CommandsData.chaseAwayThief = function (knightPosition) {
    return {'knightPosition': knightPosition};
};


//pos, theifpos, new pos : hextile ID

CommandCheck.chaseAwayThief = function (knightPosition) {
  var knight = DATA.getMatch().map.getVertexInfo(knightPosition);
  if(DATA.getMatch().turnNum == knight.activatedInRound || !knight.active){
    swalError2("Error, knight must be activated in previous turn to perform such action.");
    return false;
  }
  return true;
  //  var adjacentHex = DATA.getMatch().map.getHexTileByVertex(knightPosition);
  //  var robber = DATA.getMatch().map.getHexTileById(DATA.getMap().robber.pos);
  //  var pirate = DATA.getMatch.map.getHexTileById(DATA.getMap().pirate.pos);
/*   var found = 0;
   for(var hextile in adjacentHex){
     if(adjacentHex[hextile].blockedByRobber || adjacentHex[hextile].blockedByPirate){
       found = 1;
     }
   }
   if(found){
     return true;
   }
   else{
     swalError2("No robber/pirate on the adjacent hextiles");
     return false;
   }
   */
};

CommandReceived.chaseAwayThief = function () {
    let knight = DATA.getMatch().knightInAction;
    console.log(Raw(knight));
    let thiefAround = VertexUnit.getThiefAround(knight);
    notifyUserToMoveThief(thiefAround);

};


//num : total number of cards to be discarded
//cards: {Enum.Resourca.card : # of this type to be discarded} {Cost}
CommandsData.discardResourceCards = function (cards) {
    return {'cards': cards}
};

CommandCheck.discardResourceCards = function (cards) {
    if(!app.discardCards){
      swalError2("You don't need to discard cards.");
      return false;
    }
    let num = DATA.getMyPlayer().resourceCardNum - DATA.getMyPlayer().maxSafeCardNum;
    var player = DATA.getMyPlayer();
    var size = 0;
    for (var i in cards) {
        size += cards[i];
    }

    if(size != num){
      swalError2("You need to discard " + num + " cards");
      return false;
    }

    var counter = 0;
    for (var card in player.resourcesAndCommodities) {
        for (var discard in cards) {
            if (card === discard) {
                if (player.resourcesAndCommodities[card] >= cards[discard]){
                  counter = 1;
                }
            }
        }
    }
    app.discardCards = false;
    return true;
    /*
    if (counter) {
        return true;
    }
    swalError2("Not enough resource!");
    return false;
    */
};






/**
 *
 * @param accept {boolean}
 */
CommandsData.acceptTrade = function (accept, commodity) {
    return {accept: accept, commodity: commodity};
};

CommandCheck.acceptTrade = function (selling, buying) {
    checkEnoughResource(buying);
};

CommandsData.tradeWithPlayer = function (userNameA, userNameB, trade) {
    return {'userNameA': userNameA, 'userNameB': userNameB, 'trade': trade};

};

CommandCheck.tradeWithPlayer = function (userNameA, userNameB, trade) {

};

//=================================================================================
/**
 * rollDice does not take any arguments
 * @return {null}
 */
CommandsData.rollDice = function () {
    return null;
};

//assume now we are the current player (we only allow user to click button until he receives TAKE_TURN and hasn't clicked end turn
CommandCheck.rollDice = function () {
    // benefit of science city improvement
    if (DATA.getMyPlayer().cityImprovement[Enum.cityImprovementCategory.Science] >=3 ){
        app.resourceCardNumNow = DATA.getMyPlayer().resourceCardNum;
    }
    /**
    if (DATA.getMatch().diceRolled) {
        swalError2("Dice already rolled!");
        return false;
    }**/
    return true;
};

/**
 *
 * @param vertex {int}   vertex id
 * @param establishmentLV {int} level 1 : settlement, level 2: city, level 3: metropolitan
 */
//TODO: delete this function later
CommandsData.buildEstablishment = function (vertex, establishmentLV) {
    return {'position': vertex, 'establishmentLV': establishmentLV};
};


CommandsData.buildSettlement = function (vertex) {
    return {'position': vertex};
};


CommandCheck.buildEstablishment = function (vertex, establishmentLV) {
    var player = DATA.getMyPlayer();
    if (establishmentLV == 1) {
        if (player.getSettlements().length <= 5)
            return CommandCheck.buildSettlement(vertex);
        else{
          swalError2("You can only build 5 settlements");
          return false;
        }
    }
    else{
      if(player.getCityCnt() <= 4)
        return CommandCheck.upgradeToCity(vertex);
      else{
        swalError2("You can only place 5 settlements and 4 cities");
        return false;
      }
    }
};

/**
 * @param cmdData    {CommandsData.buildSettlement}
 * @return {boolean}
 */
CommandCheck.buildSettlement = function (vertex) {
    //set up phrase you can build one settlement for free
    if ((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne) && DATA.getMyPlayer().settlementCnt >= 1) {
        swalError2("You can only build one settlement in set up round one!");
        return false;
    }

    if ((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && DATA.getMyPlayer().getBuildingCnt() >= 2) {
        swalError2("You can only build one settlement in set up round two!");
        return false;
    }

    if (DATA.getMyPlayer().getSettlements().length >= 5){
      swalError2("You can only build 5 settlements");
      return false;
    }

    if ((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && !checkEnoughResource(Cost.buildSettlement)) {
        return false;
    }

    //check if the vertex is not empty
    if (DATA.getMatch().map.getVertexInfo(vertex)) {
        swalError2("Invalid position!");
        return false;
    }

    /**
     *
     * @type {Array.<edge>}
     */
    let connectedEdges = DATA.getMatch().map.getEdgeByVertex(vertex);
    //flags
    let connectedToOneRoad = false;
    let distanceRuleSatisfied = true;

    for (let e of connectedEdges) {
        //check if connected to one road
        let road = DATA.getMatch().map.getEdgeInfo(e);
        if (road && road.owner.name == DATA.getMyPlayer().name) {
            //we have a road connected with the settlement
            connectedToOneRoad = true;
        }

        //distance rule - you may only build a settlement at an intersection if all 3 of the adjacent intersections are vacant (i.e., none are occupied by any settlements or cities—even yours
        let otherEndOfEdge = Map.getOtherEndOfEdge(e, vertex);
        let vertexUnit = DATA.getMatch().map.getVertexInfo(otherEndOfEdge);
        if (vertexUnit && !isKnight(vertexUnit)) {
            //if the vertexUnit is not knight, then it's settlement / city
            //-> there is a settlement / city at a adjacent intersections
            distanceRuleSatisfied = false;
        }
    }


    if (!connectedToOneRoad && (!DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne)) {
        swalError2("Settlement should be connected with at least one of your road.");
        return false;
    }

    if (!distanceRuleSatisfied) {
        swalError2("Distance rule violated! All 3 of the adjacent intersections must be vacant to build a settlement!");
        return false;
    }


    //cannot build in sea
    let inSea = true;
    for (let hexID of DATA.getMatch().map.getHexTileArrayByVertex(vertex)) {
        if (!(DATA.getMatch().map.getHexTileById(hexID).type == Enum.HexType.Sea)) {
            inSea = false;
        }
    }

    if (inSea) {
        swalError2("Cannot build settlement in sea!");
        return false;
    }

    return true;
};


CommandsData.upgradeToCity = function (vertex) {
    return {'position': vertex};
};


/**
 *
 * @param data {CommandsData.upgradeToCity}
 * @return {boolean}
 */
CommandCheck.upgradeToCity = function (vertex) {

    if (!(DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && !checkEnoughResource(Cost.upgradeToCity)) {
        return false;
    }
/*
    //check if there is a settlement in the vertex
    if (!isSettlement(vertex)) {
        swalError2("You can only update a settlement!");
        return false;
    }
*/
    //you can only update one city
    if ((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && (DATA.getMyPlayer().getCities().length >= 1)) {
        swalError2("You can only update one settlement during set up round two!");
        return false;
    }

    if(DATA.getMyPlayer().getCityCnt() >= 4){
      swalError2("You can only build 4 cities");
      return false;
    }

    return true;

};


/**
 *
 * @param vertex1 {int} vertex 1 is smaller than vertex2
 * @param vertex2
 */
CommandsData.buildRoad = function (vertex1, vertex2) {
    return Map.edge(vertex1, vertex2);
};


/**
 *
 * @param data {CommandsData.buildRoad}
 * @return {boolean}
 */
CommandCheck.buildRoad = function (vertex1, vertex2) {
    let edge = Map.edge(vertex1, vertex2);

    //set up phrase you can build one road for free
    if ((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne) && DATA.getMyPlayer().getRoadAndShipCnt() >= 1) {
        swalError2("You can only build one road or ship in set up round one!");
        return false;
    }

    //set up phrase you can build one road for free
    if ((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && DATA.getMyPlayer().getRoadAndShipCnt() >= 2) {
        swalError2("You can only build one road or ship in set up round two!");
        return false;
    }

    if((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && (DATA.getMatch().fish != "BUILD_ROAD")){
        if (DATA.getMatch().players[DATA.getMatch().currentPlayer].freeRoadsOrShips>0){
            // if player has a freeRoadsOrShips, don't need to check for resources
        }
        else if(!checkEnoughResource(Cost.buildRoad)){
          return false;
        }
    }

    if((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && (DATA.getMatch().fish == "BUILD_ROAD")){

        if(!checkEnoughResource(Cost.buildUseFish)){
          return false;
        }
    }

    //Only 1 road can be built on any given path
    if (DATA.getMatch().map.getEdgeInfo(edge)) {
        swalError2("Only 1 road can be built on any given path!");
        return false;
    }


    //valid position check -- you cannot build road in sea -> one adjacent hexTile should be land
    let adjacentToLandHex = false;  //flag
    for (let [hexID, edgePosition] of DATA.getMatch().map.getHexTileByEdge(edge)) {
        if (DATA.getMatch().map.getHexTileById(hexID).type != Enum.HexType.Sea) adjacentToLandHex = true;
    }
    if (!adjacentToLandHex) {
        swalError2("You cannot build road in sea!");
        return false;
    }


    //A new road must always connect to 1 of your existing roads, settlements, or cities.
    let connected = false;

    for (let vertex of edge) {

        //if the new road is connected with roads on this vertex
        for (let e of DATA.getMatch().map.getEdgeByVertex(vertex)) {
            let edgeUnit = DATA.getMatch().map.getEdgeInfo(e);
            if (edgeUnit && edgeUnit.type == 'road' && edgeUnit.owner.name == DATA.getMyPlayer().name) {
                connected = true;
                break;
            }
        }

        //... connected with settlements, or cities.
        let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
        if (vertexUnit && !isKnight(vertexUnit) && vertexUnit.owner.name == DATA.getMyPlayer().name) {
          console.log("vertex unit is " + vertexUnit + " owner is " + vertexUnit.owner.name);
            connected = true;
            break;
        }
    }

    if (!connected) {
        swalError2("A new road must always connect to 1 of your existing roads, settlements, or cities.");
        return false;
    }

    return true;
};


/**
 * @param vertex1
 * @param vertex2
 */
CommandsData.buildShip = function (vertex1, vertex2) {
    return Map.edge(vertex1, vertex2);

};


/**
 * @param data {CommandsData.buildShip}
 * @return {boolean}
 */
CommandCheck.buildShip = function (vertex1, vertex2) {
    let edge = Map.edge(vertex1, vertex2);

    //set up phrase you can build one road for free
    if ((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne) && DATA.getMyPlayer().getRoadAndShipCnt() >= 1) {
        swalError2("You can only build one road or ship in set up round one!");
        return false;
    }

    //set up phrase you can build one road for free
    if ((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && DATA.getMyPlayer().getRoadAndShipCnt() >= 2) {
        swalError2("You can only build one road or ship in set up round two!");
        return false;
    }


    if((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && (DATA.getMatch().fish != "BUILD_SHIP")){
        if (DATA.getMatch().player[DATA.getMatch().currentPlayer].freeRoadsOrShips>0){
            // if player has a freeRoadsOrShips, don't need to check for resources
        }
        else if(!checkEnoughResource(Cost.buildShip)){
          return false;
        }
    }

    if((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && (DATA.getMatch().fish == "BUILD_SHIP")){

        if (!checkEnoughResource(Cost.buildUseFish)){
            return false;
        }
    }

    // if ((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && ()))
    return shipPostionTest(edge);


};


function shipPostionTest(edge) {
    //Only 1 ship can be built on any given path
    if (DATA.getMatch().map.getEdgeInfo(edge)) {
        swalError2("Only 1 ship can be built on any given path!");
        return false;
    }

    //valid position check -- you cannot build road in inland area -> one adjacent hexTile should be sea
    let adjacentToSeaHex = false;  //flag
    for (let [hexID, edgePosition] of DATA.getMatch().map.getHexTileByEdge(edge)) {
        if (DATA.getMatch().map.getHexTileById(hexID).type == Enum.HexType.Sea) adjacentToSeaHex = true;
    }
    if (!adjacentToSeaHex) {
        swalError2("You cannot build road in inland area!");
        return false;
    }


    //A new ship must always connect to 1 of your existing ships, settlements, or cities.
    let connected = false;

    for (let vertex of edge) {

        //if the new ship is connected with roads on this vertex
        for (let e of DATA.getMatch().map.getEdgeByVertex(vertex)) {
            let edgeUnit = DATA.getMatch().map.getEdgeInfo(e);
            if (edgeUnit && edgeUnit.type == 'ship' && edgeUnit.owner.name == DATA.getMyPlayer().name) {
                connected = true;
                break;
            }
        }

        //... connected with settlements, or cities.
        let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
        if (vertexUnit && !isKnight(vertexUnit)) {
            connected = true;
            break;
        }
    }

    if (!connected) {
        swalError2("A new ship must always connect to 1 of your existing ships, settlements, or cities.");
        return false;
    }

    return true;
}

/**
 *
 * @param vertex {int}
 * @return {{position: int}}
 */
CommandsData.buildCityWall = function (vertex) {
    return {'position': vertex};
};

/**
 *
 * @param data
 */
CommandCheck.buildCityWall = function (vertex) {

    if (!checkEnoughResource(Cost.buildCityWall)) {
        return false;
    }

    let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
    if (!vertexUnit || isKnight(vertexUnit) || isSettlement(vertex)) {
        swalError2("There is no city at this position!");
        return false;
    }

    if (vertexUnit.cityWall) {
        swalError2("This city already has city wall!");
        return false
    }

    return true;
};

/**
 *
 * @param cityImprovementCategory  {String}
 */
CommandsData.buyCityImprovement = function (cityImprovementCategory) {
    return {'cityImprovementCategory': cityImprovementCategory};
};


CommandCheck.buyCityImprovement = function (cityImprovementCategory) {
    //let me = DATA.getMyPlayer();
    let level = parseInt(DATA.getMyPlayer().cityImprovement[cityImprovementCategory]) + 1;

    // 6 = 5 + 1
    if (level >= 6) {
        swalError2("Maximum level of city improvement in this category is already achieved!");
        return false;
    }
    return (checkEnoughResource(Cost['cityImprove_' + cityImprovementCategory + '_' + level]));

};

CommandReceived.buyCityImprovement = function () {
    let metroTypes = Player.ableToUpgradeToMetropolis();
    if (metroTypes.length > 0) {
        swalService.swal(
            "Metropolis",
            "You can upgrade your city to metropolis!",
            "info"
        );
    }
};


/**
 * @param card {string}
 */
CommandsData.executeProgressCard = function (card) {
        return {'cardname':card};
};

/**
 *
 * @param oldVertex1 {int}  vertex 1 < vertex 2
 * @param oldVertex2 {int}
 * @param newVertex1 {int}
 * @param newVertex2 {int}
 */
CommandsData.moveShip = function (oldVertex1, oldVertex2, newVertex1, newVertex2) {

    let oldPosition = Map.edge(oldVertex1, oldVertex2);
    let newPosition = Map.edge(newVertex1, newVertex2);
    return {'oldPosition': oldPosition, 'newPosition': newPosition};
};


CommandCheck.moveShip = function (oldVertex1, oldVertex2, newVertex1, newVertex2) {
    let oldPosition = Map.edge(oldVertex1, oldVertex2);
    let newPosition = Map.edge(newVertex1, newVertex2);

    //You may only move 1 ship per turn, and only during your building phase -> dice rolled
    if (!DATA.getMatch().diceRolled) {
        swalError2("You can only move ship during building phase!");
    }

    if (DATA.getMatch().shipMoved) {
        swalError2("You can only move 1 ship per turn!");
        return false;
    }

    let ship = DATA.getMatch().map.getEdgeInfo(oldPosition);

    if (!ship || ship.type == 'ship') {
        swalError2("No ship found!");
    }
    //You may not move a ship on the same turn you originally built it
    if (ship.builtTurnNum == DATA.getMatch().turnNum) {
        swalError2("You cannot move a ship on the same turn you originally built it!");
        return false;
    }

    // check if pirate is in the old position or the new position


    ship.remove(DATA.getMatch().map, oldPosition);
    if (!shipPostionTest(newPosition)) {
        swalError2("You cannot move ship here!");
        return false;
    }

    return true;
};

/**
 *
 * @param src   {String} the name of the card
 * @param tradeFor  {String} the name of the card
 */
CommandsData.tradeWithBank = function (src, tradeFor) {
    return {'src': src, 'tradeFor': tradeFor};
};


CommandCheck.tradeWithBank = function (src, tradeFor) {
    let tradeRatio = DATA.getMyPlayer().tradeRatio[tradeFor];
    let cost = {[src]: tradeRatio};

    return (checkEnoughResource(cost));
};


//Commands.discardResourceCards


/**
 *
 * @return {null}
 */
CommandsData.endTurn = function () {
    app.isMyTurn = false;
    return null;
};

CommandCheck.endTurn = function () {
    return true;
};



/**
 *
 * @param cost {object} key: commodity/resource name, value: int -> # of that resource/commodity required
 */
let checkEnoughResource = function (cost) {

    let resources = DATA.getMyPlayer().resourcesAndCommodities;
    for (let cardName in cost) {
        if (cost[cardName] > resources[cardName]) {
            swalError2("Not enough " + cardName + "!");
            return false
        }
    }

    return true;
};

let checkInput = function (data) {
    for (let key in data) {
        if (typeof data[key] == 'undefined') {
            swalError2("Input not complete!");
            return false;
        }
    }
};

let checkEnoughFish = function (cost) {
    let fish = DATA.getMyPlayer().fishSum;
    if(cost > fish){
    //  console.log( "cost" + cost + " >  fishsum " + fish);
      swalError2("Not enough fish !");
      return false
    }
    //console.log( "cost" + cost + " <  fishsum" + fish);
    return true;
};


let update = function (room) {
    if (room.match) {
        Map.addHelperFunctions(room.match.map);
        for (let name in room.users) {
            if (room.users.hasOwnProperty(name)) Player.addHelperFunctions(room.users[name]);
        }
    }

    // modify room here
    // ...
    // ...
    window.app.room = room; // update room in view
    return room;
};


// duck-typing check if object is knight
// vertexUnit may be knight/ settlement/ city
/**
 * @param vertexUnit {vertexUnit}
 * @return {boolean}
 */
function isKnight(vertexUnit) {
    if (!_.isObject(vertexUnit)) return false;
    let fields = ['active', 'id', 'hasMovedThisTurn', 'hasBeenPromotedThisTurn'];
    for (let i = 0; i < fields.length; i++) {
        if (_.isUndefined(vertexUnit[fields[i]])) return false;
    }
    return true;
}

/**
 * if the vertexUnit at this vertex is a settlement
 * @param vertex
 */
function isSettlement(vertex) {
    let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
    if (!_.isObject(vertexUnit) || isKnight(vertexUnit)) return false;
    return (vertexUnit.level == 1);
}


CommandReceived.rollDice = function () {
    if (DATA.getMyPlayer().diceConfigResult.length > 0){
        _.forEach(DATA.getMyPlayer().diceConfigResult, function (action) {
            if (action.cmd == "drawOneProgressCard" && action.data){
                notifyUserToDrawProgressCard([action.data]);
            }
            else swalService.swal(action.msg);
        })
    }
};

_.each(CommandName, function (cmd) {

    Commands[cmd] = function () {
        app.ongoingCmd = null;
        /**
        // if not my turn and barbarian result, operation is limited
        if(!app.barbarianResult && !app.discardCards && cmd != "rollDice" && !DATA.getMatch().diceRolled && DATA.getMatch().phase == Enum.MatchPhase.TurnPhase){
        swalError2("Please roll dice first");
        return;
      }

      if (app.barbarianResult){
          //here
        // DATA.getMatch().barbarianResult = null;
          var res = DATA.getMatch().barbarianResult.result;

          if(res == "CATAN_WIN_TIE"){
            app.canDraw = true;
            if (cmd != "drawOneProgressCard") {
                swalError2("You can get one progress card for free");
                return;
            }
          }
          else if (res == "CATAN_LOSE"){
            app.pillageCity = true;
            if (cmd != "chooseCityToBePillaged") {
              swalError2("Please choose one city to be pillaged");
              return;
            }
          }
          else{
            DATA.getMyPlayer().defenderOfCatan = true; //cant assign to null
            swal("You are the defender of Catan.");
          }
     }

     if(app.barbarianResult){
       app.barbarianResult = false;
     }

     //player has more than 7 cards & dice result = 7
     if(app.discardCards){
       if(cmd != "discardResourceCards"){
         swalError2("You need to discard "  + num + " cards");
         return;
       }
       app.discardCards = false;
     }

     if(app.canDraw){
       if(cmd != "drawOneProgressCard"){
         swalError2("You need to draw one progress card.");
         return false;
       }
     }


     if(app.rolledSeven){
          if(cmd != "moveRobber" && cmd != "movePirate"){
            swalError2("You must move robber/pirate first");
            return;
          }
          else{
            //swal("Succ");
            app.rolledSeven = false;
        }
      }
**/

        //input complete check
        /**
         if (!checkInput(CommandsData[cmd].apply(this, arguments))){
            return;
        }**/

            //allowed operations
            //if Enum.AllowedCommands[room.state] == null -> turn phrase, no allowed operation
            /**
       let phase = DATA.getMatch().phase;
       if (Enum.AllowedCommands[phase] && !_.contains(Enum.AllowedCommands[phase], cmd)) {
            swalError2("This operation not allowed in " + phase);
            return;
        }

        if(!app.barbarianResult && cmd != "rollDice" && !DATA.getMatch().diceRolled && DATA.getMatch().phase == Enum.MatchPhase.TurnPhase){
          swalError2("Please roll dice first");
          return;
        }**/

        //comment out this part if you want to disable checks
        //checkers
/**

         let phase = DATA.getMatch().phase;
         if (!CommandCheck[cmd].apply(this, arguments)) {
             return;
         }
**/

/*
        // if barbarian result commands
        if (app.barbarianResult) {
            app.barbarianResult = false;
        }
*/
        //exec
        sock.emit(cmd, CommandsData[cmd].apply(this, arguments));
    };

    //we are listening for each command
    sock.on(cmd + 'Ack', function (msg) {
        console.log('ACK:'+msg);
        console.log(msg);
        //console.log(CommandReceived, CommandReceived[cmd]);
        console.log(cmd, CommandReceived.hasOwnProperty(cmd));
        if (CommandReceived.hasOwnProperty(cmd)){
            CommandReceived[cmd]();
            console.log(cmd);
        }
    });
/**
    sock.on(cmd + 'Ack' + 'Owner', function (msg) {
        swalSucc(CommandSuccMsg[cmd]);
    });**/

});


