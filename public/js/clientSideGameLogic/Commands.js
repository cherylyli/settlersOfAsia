//(function(){
    let Commands = {};
    let CommandsData = {};
    let CommandName = {
      //old ones TODO test citywall, buy improvement, move ship
      'rollDice' : 'rollDice', 'buildSettlement': 'buildSettlement', 'upgradeToCity': 'upgradeToCity',
      'buildEstablishment': 'buildEstablishment', 'buildRoad': 'buildRoad', 'buildShip': 'buildShip', 'endTurn': 'endTurn',
      'buildCityWall': 'buildCityWall', 'buyCityImprovement': 'buyCityImprovement',
      'moveShip': 'moveShip', 'tradeWithBank': 'tradeWithBank',
      /*
      done testing:
      */
      'setDefenderOfCatan' : 'setDefenderOfCatan',
      'stealCard' :'stealCard','discardOneProgressCard' : 'discardProgressCard',
      'stealCard' :'stealCard','discardOneProgressCard' : 'discardProgressCard',
      'drawOneResourceCard' : 'drawOneResourceCard', 'giveAwayBoot' : 'giveAwayBoot'
      'drawOneProgressCard' : 'drawOneProgressCard',
      'discardResourceCards' : 'discardResourceCards',
      'chaseAwayThief' : 'chaseAwayThief',
      'hireKnight' : 'hireKnight', 'activateKnight' : 'activateKnight', 'promoteKnight' : 'promoteKnight',
      'moveKnight' : 'moveKnight',

      //need to test.
      'buildCityWall': 'buildCityWall', 'buyCityImprovement': 'buyCityImprovement',
      'moveShip': 'moveShip', 'tradeWithBank': 'tradeWithBank',
      'addMetropolis' : 'addMetropolis',
      'chooseCityToBePillaged' : 'chooseCityToBePillaged',
      'moveRobber' : 'moveRobber' , 'movePirate' : 'movePirate',
      'spendFishToken' : 'spendFishToken',
      'buildRoadUseFish' : 'buildRoadUseFish', 'buildShipUseFish' : 'buildShipUseFish',


      //TODO:
      'displaceKnight' : 'displaceKnight',
      'requestTrade' : 'requestTrade',
      'acceptTrade' : 'acceptTrade', 'tradeWithPlayer' : 'tradeWithPlayer'


    };

    //TODO: some one good at English plz help me change this.... It's embarrassing...
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
        'endTurn': 'Hummmm... I think I am done.'
    };

    //TODO: include check input & make the object not global
    let CommandCheck = {};

    let room = {users: {}};


//============================REQUIRE TEST ==============================
  CommandsData.setDefenderOfCatan = function () {
      return null;
  };


  CommandCheck.setDefenderOfCatan = function () {
    return true;
  };
/**
 *
 * @param vertex {int}
 * @return {{position: int}}
 */
    CommandsData.addMetropolis = function (userName, vertex) {
        return {'userName' : userName, 'position': vertex};
    };


    CommandCheck.addMetropolis = function (userName, vertex) {
        let player = DATA.getPlayer(userName);
        /*
        if (!player.hasMetropolis){
            swalError2("Player doesn't have any metropolis to add on the city");
            return false;
        }
        */
        let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
        if (!vertexUnit || isKnight(vertexUnit) || isSettlement(vertex)){
            swalError2("There is no city at this position!");
            return false;
        }
        if (vertexUnit.hasMetropolis){
            swalError2("This city already has metropolis!");
            return false;
        }
        return true;
    };

    CommandsData.chooseCityToBePillaged = function(vertex){
      return {'position' : vertex}
    }

    CommandCheck.chooseCityToBePillaged = function(vertex){
      let match = DATA.getMatch(roomID);
      let player = DATA.getMyPlayer();
      let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
      if (!vertexUnit || isKnight(vertexUnit) || isSettlement(vertex)){
          swalError2("There is no city at this position!");
          return false;
      }
      if(vertexUnit.hasMetropolis){
        swalError2("City has a metropolis, can't be pillaged");
        return false;
      }
      else{
        return true;
      }
    }
    /**
     * moveRobber
     * @return true/false
     */
    CommandsData.moveRobber = function (oldHexID, newHexID){
      return {'oldHexID' : oldPosition, 'newHexID' : newPostion};
    }

    //consider different cases: move off board, move from a to b, move from null to b
    CommandCheck.moveRobber = function(oldHexID,newHexID){
      var oldHex = DATA.getMatch().map.getHexTileById(oldHexID);
      var newHex = DATA.getMatch().map.getHexTileById(newHexID);
      if(oldHex.blockedByRobber == true && oldHex.type != Enum.HexType.Sea && oldHex.type != Enum.HexType.Lake){
        if(newHex.blockedByRobber == false && newHex.type != Enum.HexType.Sea && newHex.type != Enum.HexType.Lake){
          return true;
        }
      }
      else{
        swalError2("Invalid Position. Please select a landTile to perform such action.");
        return false;
      }
    }

    CommandsData.movePirate  = function (oldHexID, newHexID){
      return {'oldHexID' : oldPosition, 'newHexID' : newPostion};
    }

    /**
     * moveRobber
     * @return true/false
     */

    //consider different cases: move off board, move from a to b, move from null to b
    CommandCheck.movePirate = function(oldHexID,newHexID){
      var oldHex = DATA.getMatch().map.getHexTileById(oldHexID);
      var newHex = DATA.getMatch().map.getHexTileById(newHexID);
      if(oldHex.blockedByPirate == true && oldHex.type == Enum.HexType.Sea){
        if(newHex.blockedByPirate == false && newHex.type == Enum.HexType.Sea){
          return true;
        }
      }
      else{
        swalError2("Invalid Position. Please select a seaTile.");
        return false;
      }
    }

    CommandsData.stealCard = function(thiefUserName, victimUserName){
      //var victim = DATA.getPlayer(victimUserName);
      return {'thief': thief, 'victim': victimUserName};
    }

    CommandCheck.stealCard = function(thiefUserName, victimUserName){
      let victim = DATA.getPlayer(victimUserName);
      if(victim.resourceCardTotalNum() < 1){
        swalError2("The victim player doesn't have enough resources to be stoled");
        return false;
      }
      else{
        return true;
      }
    }
    //input : String
    CommandsData.drawOneProgressCard = function (progCard){
      return {'progCard' : progCard} ;
    }

    CommandCheck.drawOneProgressCard = function(progCard){
      var progCardList = [];
      var players = DATA.getMatch().players;
      for(var i in players){
        //console.log(players[i].progressCards);
        progCardList.push(players[i].progressCards);
      }

      for(var i in progCardList){
        var intersection = _.contains(progCardList[i],progCard);
        if(intersection){
          console.log("This progress card has been distributed to someone else");
          return false;
        }
      }
      return true;
    }

    //input string
    CommandsData.drawOneResourceCard = function(resCard){
      return {'resCard' : resCard};
    }

    CommandCheck.drawOneResourceCard = function(resCard){
      var res = ['Grain','Lumber','Wool','Brick','Ore'];
      var found = 0;
      for(var i in res){
        if(res[i] == resCard){
          found = 1;
        }
      }
      if(found){
        return true;
      }
      else{
        swalError2("Player can only use the fish token to draw one resource card");
        return false;
      }
    }


    CommandsData.discardOneProgressCard = function(progCard){
      return progCard;
    }

    CommandCheck.discardOneProgressCard = function(progCard){
      let player = DATA.getMyPlayer();
      if(player.progressCardsCnt < 1){
        console.log("Player doesn't have enough progress cards");
        return false;
      }
      for(var i = 0; i < player.progressCardsCnt; i++){
        if (progCard == player.progressCards[i])
          return true;
      }
      swalError2("Card not found!");
      return false;
    }

    CommandsData.giveAwayBoot = function(bootHolder, transferTo){
      //var victim = DATA.getPlayer(victimUserName);
      return {'bootHolder': thief, 'transferTo': victimUserName};
    }

    CommandCheck.giveAwayBoot = function(holder, transferTo){
      let playerA = DATA.getPlayer(holder);
      let playerB = DATA.getPlayer(transferTo);
      if(playerA.hasBoot == true && playerB.hasBoot == false){
        if(playerA.VP <= playerB.VP){
          return true;
        }
        else{
          swalError2("Transfer boot failed because selected player doesn't have enough vp.");
        }
      }
      else{
        swalError2("Transfer boot failed.");
      }
    }

    /**
     *
     * @param vertex1 {int} vertex 1 is smaller than vertex2
     * @param vertex2
     */
        CommandsData.buildRoadUseFish = function (vertex1, vertex2) {
            return Map.edge(vertex1, vertex2);
        };

    /**
     *
     * @param data {CommandsData.buildRoad}
     * @return {boolean}
     */
        CommandCheck.buildRoadUseFish = function (vertex1, vertex2) {
            CommandCheck.buildRoad();
        };

    /**
     * @param vertex1
     * @param vertex2
     */
        CommandsData.buildShipUseFish = function (vertex1, vertex2) {
            return Map.edge(vertex1, vertex2);
        };

    /**
     * TODO: modularize. reduce duplication
     * @param data {CommandsData.buildShip}
     * @return {boolean}
     */
        CommandCheck.buildShipUseFish = function (vertex1, vertex2) {
          CommandCheck.buildShip();
        };


    CommandsData.spendFishToken = function(action, data){
      let player = DATA.getMyPlayer();
      let match = DATA.getMatch();
      return { 'userName' : player.name, 'action': action, 'data' : data, 'match' : match};
    }

    CommandCheck.spendFishToken = function(userName, action, data){
      //checkers done on server side.
      let player = DATA.getPlayer(userName);
      if(player.getFishSum() < 2){
        return false;
      }
      else {
        return true;
      }
    }

    CommandsData.hireKnight = function(position = null){
      return {'position' : null}
    }

    CommandCheck.hireKnight = function(position = null){
      if(!checkEnoughResource(Cost.basicKnights)){
        swalError2("Not enough resource to purchase a knight");
        return false;
      }
      else{
        return true;
      }
    }

    CommandsData.activateKnight = function(position){
      return { 'position' : position};
    }

    CommandCheck.activateKnight = function(position){
      var knight = DATA.getMatch().map.getVertexInfo(position);
      if(knight.active){
        swalError2("Knight has already been activated");
        return false;
      }
      if(!checkEnoughResource(Cost.activateKnight)){
        swalError2("Not enough resource to activate a knight");
        return false;
      }
      else{
        return true;
      }
    }

    CommandsData.promoteKnight = function(position){
      return {'position' : position};
    }

    CommandCheck.promoteKnight = function(position){
      var knight = DATA.getMatch().map.getVertexInfo(position);
      if(knight.hasBeenPromotedThisTurn){
        swalError2("Knight has already been promoted");
        return false;
      }
      if(knight.level == 3){
        swalError2("You've got the strongest knight already.");
        return false;
      }
      if(!checkEnoughResource(Cost.promoteKnight)){
        swalError2("Not enough resource to promote a knight");
        return false;
      }
      else{
        return true;
      }
    }
    //TODO
    CommandsData.moveKnight = function(position, newPosition){
      return {'position' :position, 'newPosition' :newPosition }
    }

    CommandCheck.moveKnight = function(position, newPosition){
      var knight = DATA.getMatch().map.getVertexInfo(position);
      //var moveTo = DATA.getMatch().map.getVertexInfo(newPosition);
      if(knight.hasMovedThisTurn || !knight.active){
        swalError2("Error, knight has been moved this turn or selected knight is not active");
        return false;
      }
      else{
        return true;
      }
      }

    }

    CommandsData.displaceKnight = function(position, newPosition){
      return {'position' :position, 'newPosition' :newPosition }
    }

    CommandCheck.displaceKnight = function(position, newPosition){
      var knight = DATA.getMatch().map.getVertexInfo(position);
      //TODO

    }

    CommandsData.chaseAwayThief = function(position, thiefHexID, newPosition){
      return {'position': position, 'thiefHexID' : thiefHexID, 'newPosition' : newPosition}
    }
    //pos, theifpos, new pos : hextile ID
    CommandCheck.chaseAwayThief = function(position, thiefHexID, newPosition){
      var knight = DATA.getMatch().map.getVertexInfo(position);
      var thiefHex = DATA.getMatch().map.getHexTileById(thiefHexID);
      if(!thiefHex.blockedByRobber){
        swalError2("No robber on the hextile");
        return false;
      }
      if(!knight.active){
        swalError2("This knight is not active!");
        return false;
      }
      return true;
    }
//num : total number of cards to be discarded
//cards: {Enum.Resourca.card : # of this type to be discarded}
    CommandsData.discardResourceCards = function(cards, num){
      return {'cards' : cards, 'num' : num}
    }

    CommandCheck.discardResourceCards = function(cards, num){
      var player = player1
      var size = 0;
      for(var i in cards){
        size += cards[i];
      }
      if(size != num){
        swallError2("You need to discard " + num + " card(s)!");
        return false;
      }
      var counter = 0;
      for (var card in player.resourcesAndCommodities){
        for(var discard in cards){
          if(card === discard){
            if(player.resourcesAndCommodities[card] >= cards[discard])
              counter = 1;
          }
        }
      }
      if(counter){
        return true;
      }
      return false;
      swallError2("Not enough resource!");
    }

    CommandsData.requestTrade = function(offer, request){
      return {'offer' : offer, 'request' : request};
    }

    CommandCheck.requestTrade = function(offer, request){
      //what need to check?
    }

    CommandsData.acceptTrade = function(){

    }

    CommandCheck.acceptTrade = function(){

    }

    CommandsData.tradeWithPlayer = function(userNameA, userNameB, trade){
      return {'userNameA' : userNameA, 'userNameB' : userNameB, 'trade' : trade};

    }

    CommandCheck.tradeWithPlayer = function(userNameA, userNameB, trade){

    }
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
        if (DATA.getMatch().diceRolled){
            swalError2("Dice already rolled!");
            return false;
        }
        return true;
    };
/**
 *
 * @param vertex {int}   vertex id
 * @param establishmentLV {int} level 1 : settlement, level 2: city, level 3: metropolitan
 */
//TODO: delete this function later
    CommandsData.buildEstablishment = function(vertex, establishmentLV){
       return {'position': vertex, 'establishmentLV': establishmentLV};
    };


    CommandsData.buildSettlement = function (vertex) {
        return {'position': vertex};
    };


    CommandCheck.buildEstablishment = function (vertex, establishmentLV) {
        var player = DATA.getMyPlayer();
        if(establishmentLV == 1){
          if(player.getSettlements().length <= 5)
            return CommandCheck.buildSettlement(vertex);
        }
        else if (player.getCityCnt() <= 4){
         return CommandCheck.upgradeToCity(vertex);
        }
        else{
          swalError2("You can only place 5 settlements and 4 cities");
        }
    };

/**
 * TODO: test
 * @param cmdData    {CommandsData.buildSettlement}
 * @return {boolean}
 */
    CommandCheck.buildSettlement = function (vertex) {
        //set up phrase you can build one settlement for free
        if((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne) && DATA.getMyPlayer().settlementCnt >= 1){
            swalError2("You can only build one settlement in set up round one!");
            return false;
        }

        if((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && DATA.getMyPlayer().getBuildingCnt() >= 2){
            swalError2("You can only build one settlement in set up round two!");
            return false;
        }


        if ((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && !checkEnoughResource(Cost.buildSettlement)){
            return false;
        }

        //check if the vertex is not empty
        if (DATA.getMatch().map.getVertexInfo(vertex)){
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

        for (let e of connectedEdges){
            //check if connected to one road
            let road = DATA.getMatch().map.getEdgeInfo(e);
            if (road && road.owner.name == myObj.userName){
                //we have a road connected with the settlement
                connectedToOneRoad = true;
            }

            //distance rule - you may only build a settlement at an intersection if all 3 of the adjacent intersections are vacant (i.e., none are occupied by any settlements or cities—even yours
            let otherEndOfEdge = Map.getOtherEndOfEdge(e, vertex);
            let vertexUnit = DATA.getMatch().map.getVertexInfo(otherEndOfEdge);
            if (vertexUnit && !isKnight(vertexUnit)){
                //if the vertexUnit is not knight, then it's settlement / city
                //-> there is a settlement / city at a adjacent intersections
                distanceRuleSatisfied = false;
            }
        }


        if (!connectedToOneRoad && (!DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne)){
            swalError2("Settlement should be connected with at least one road.");
            return false;
        }

        if (!distanceRuleSatisfied){
            swalError2("Distance rule violated! All 3 of the adjacent intersections must be vacant to build a settlement!");
            return false;
        }


        //cannot build in sea
        let inSea = true;
        for (let hexID of DATA.getMatch().map.getHexTileArrayByVertex(vertex)){
            if (!(DATA.getMatch().map.getHexTileById(hexID).type == Enum.HexType.Sea)){
                inSea = false;
            }
        }

        if (inSea){
            swalError2("Cannot build settlement in sea!");
            return false;
        }

        //if you have more than 5 settlements, you have to upgrade one to a city before you build another one
        if (DATA.getMyPlayer().settlementCnt == 5){
            swalError2("You already have 5 settlements! Upgrade one to city before you build another one!");
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

        if (!(DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && !checkEnoughResource(Cost.upgradeToCity)){
            return false;
        }

        //check if there is a settlement in the vertex
        if (!isSettlement(vertex)){
            swalError2("You can only update a settlement!");
            return false;
        }

        //you can only update one city
        if ((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && (DATA.getMyPlayer().getCities().length >= 1)){
            swalError2("You can only update one settlement during set up round two!");
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
        if((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne) && DATA.getMyPlayer().getRoadAndShipCnt() >= 1){
            swalError2("You can only build one road or ship in set up round one!");
            return false;
        }

        //set up phrase you can build one road for free
        if((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && DATA.getMyPlayer().getRoadAndShipCnt() >= 2){
            swalError2("You can only build one road or ship in set up round two!");
            return false;
        }


        if ((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && !checkEnoughResource(Cost.buildRoad)){
            return false;
        }

        //Only 1 road can be built on any given path
        if (DATA.getMatch().map.getEdgeInfo(edge)){
            swalError2("Only 1 road can be built on any given path!");
            return false;
        }


        //valid position check -- you cannot build road in sea -> one adjacent hexTile should be land
        let adjacentToLandHex = false;  //flag
        for (let [hexID, edgePosition] of DATA.getMatch().map.getHexTileByEdge(edge)){
            if (DATA.getMatch().map.getHexTileById(hexID).type != Enum.HexType.Sea) adjacentToLandHex = true;
        }
        if (!adjacentToLandHex){
            swalError2("You cannot build road in sea!");
            return false;
        }


        //A new road must always connect to 1 of your existing roads, settlements, or cities.
        let connected = false;

        for (let vertex of edge){

            //if the new road is connected with roads on this vertex
            for (let e of DATA.getMatch().map.getEdgeByVertex(vertex)){
                let edgeUnit = DATA.getMatch().map.getEdgeInfo(e);
                if (edgeUnit && edgeUnit.type == 'road' && edgeUnit.owner.name == myObj.userName){
                    connected = true;
                    break;
                }
            }

            //... connected with settlements, or cities.
            let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
            if (vertexUnit && !isKnight(vertexUnit) && vertexUnit.owner.name == myObj.userName){
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
 * TODO: modularize. reduce duplication
 * @param data {CommandsData.buildShip}
 * @return {boolean}
 */
    CommandCheck.buildShip = function (vertex1, vertex2) {
        let edge = Map.edge(vertex1, vertex2);

        //set up phrase you can build one road for free
        if((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne) && DATA.getMyPlayer().getRoadAndShipCnt() >= 1){
            swalError2("You can only build one road or ship in set up round one!");
            return false;
        }

        //set up phrase you can build one road for free
        if((DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) && DATA.getMyPlayer().getRoadAndShipCnt() >= 2){
            swalError2("You can only build one road or ship in set up round two!");
            return false;
        }


        if ((DATA.getMatch().phase == Enum.MatchPhase.TurnPhase) && !checkEnoughResource(Cost.buildShip)){
            return false;
        }

        return shipPostionTest(edge);


    };



    function shipPostionTest(edge) {
        //Only 1 ship can be built on any given path
        if (DATA.getMatch().map.getEdgeInfo(edge)){
            swalError2("Only 1 ship can be built on any given path!");
            return false;
        }

        //valid position check -- you cannot build road in inland area -> one adjacent hexTile should be sea
        let adjacentToSeaHex = false;  //flag
        for (let [hexID, edgePosition] of DATA.getMatch().map.getHexTileByEdge(edge)){
            if (DATA.getMatch().map.getHexTileById(hexID).type == Enum.HexType.Sea) adjacentToSeaHex = true;
        }
        if (!adjacentToSeaHex){
            swalError2("You cannot build road in inland area!");
            return false;
        }


        //A new ship must always connect to 1 of your existing ships, settlements, or cities.
        let connected = false;

        for (let vertex of edge){

            //if the new ship is connected with roads on this vertex
            for (let e of DATA.getMatch().map.getEdgeByVertex(vertex)){
                let edgeUnit = DATA.getMatch().map.getEdgeInfo(e);
                if (edgeUnit && edgeUnit.type == 'ship' && edgeUnit.owner.name == myObj.userName){
                    connected = true;
                    break;
                }
            }

            //... connected with settlements, or cities.
            let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
            if (vertexUnit && !isKnight(vertexUnit)){
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

        if (!checkEnoughResource(Cost.buildCityWall)){
            return false;
        }

        let vertexUnit = DATA.getMatch().map.getVertexInfo(vertex);
        if (!vertexUnit || isKnight(vertexUnit) || isSettlement(vertex)){
            swalError2("There is no city at this position!");
            return false;
        }

        if (vertexUnit.cityWall){
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
        if (level >= 6){
            swalError2("Maximum level of city improvement in this category is already achieved!");
            return false;
        }

        return (checkEnoughResource(Cost['cityImprove_' + cityImprovementCategory + '_' + level]));

    }

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
        if (!DATA.getMatch().diceRolled){
            swalError2("You can only move ship during building phase!");
        }

        if (DATA.getMatch().shipMoved){
            swalError2("You can only move 1 ship per turn!");
            return false;
        }

        let ship = DATA.getMatch().map.getEdgeInfo(oldPosition);

        if (!ship || ship.type == 'ship'){
            swalError2("No ship found!");
        }
        //You may not move a ship on the same turn you originally built it
        if (ship.builtTurnNum == DATA.getMatch().turnNum){
            swalError2("You cannot move a ship on the same turn you originally built it!");
            return false;
        }

        // TODO: YUAN hEHHRERE
        // check if pirate is in the old position or the new position


        ship.remove(DATA.getMatch().map, oldPosition);
        if (!shipPostionTest(newPosition)){
            swalError2("You cannot move ship here!");
            return false;
        }

        return true;
    }
    //TODO:
getAvailbleEdgesToMoveTo =function () {

}
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
        //TODO: do I must roll dice?
        return true;
    }



/**
let edge = function (vertex1, vertex2) {
    //TODO: check if vertex 1 and vertex2 is a edge

    //check if vertex is less then vertex 2
    if (vertex1 < vertex2) return [vertex1, vertex2];
    return [vertex2, vertex1];
};
 **/

/**
 *
 * @param cost {object} key: commodity/resource name, value: int -> # of that resource/commodity required
 */
    let checkEnoughResource = function (cost) {
        let resources = DATA.getMyPlayer().resourcesAndCommodities;
        for (let cardName in cost){
            if (cost[cardName] > resources[cardName]){
                swalError2("Not enough "+ cardName + "!");
                return false
            }
        }
        return true;
    };

    let checkInput = function (data) {
        for (let key in data){
            if (typeof data[key] == 'undefined'){
                swalError2("Input not complete!");
                return false;
            }
        }
    };

    let checkEnoughFish = function (cost) {
        let fish = DATA.getMyPlayer().fishSum;
        for (let fishAction in cost){
            if(fish < cost){
                swalError2("Not enough fish !");
                return false
            }
        }
        return true;
    };

    let checkInput = function (data) {
        for (let key in data){
            if (typeof data[key] == 'undefined'){
                swalError2("Input not complete!");
                return false;
            }
        }
    };

    let update = function (room) {
        if (room.match) {
            Map.addHelperFunctions(room.match.map);
            for (let name in room.users){
                if (room.users.hasOwnProperty(name)) Player.addHelperFunctions(room.users[name]);
            }
        }

    // modify room here
    // ...
    // ...
        window.app.room = room; // update room in view
        return room;
    };


//TODO: may move the duck-typing check to another file.
// duck-typing check if object is knight
// vertexUnit may be knight/ settlement/ city
/**
 * TODO: refactor later. the name isBuilding may be inappropriate. As edgeUnit road and ship belongs to Building. Maybe this is a bad design. Change the name or Building class.
 * @param vertexUnit {vertexUnit}
 * @return {boolean}
 */
function isKnight(vertexUnit){
    if (!_.isObject(vertexUnit)) return false;
    let fields = ['active', 'id', 'hasMovedThisTurn', 'hasBeenPromotedThisTurn'];
    for (let i=0; i<fields.length; i++){
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

//})();




_.each(CommandName, function(cmd){

    Commands[cmd] = function(){

        // if not my turn and barbarian result, operation is limited
        if (app.barbarianResult && !app.isMyTurn){
          switch (DATA.getMatch().barbarian.result.result) {
            case Enum.barbarianResult.CATAN_WIN_TIE :
              if(cmd != "drawOneProgressCard"){
                swalError2(Enum.BarbarianAction[DATA.getMatch().barbarian.result.result]);
                return;
              }
              break;

            case Enum.barbarianResult.CATAN_LOSE :
              if(cmd != "chooseCityToBePillaged"){
                swalError2(Enum.BarbarianAction[DATA.getMatch().barbarian.result.result]);
                return;
              }
              break;

            case Enum.barbarianResult.CATAN_WIN :
              if(cmd != "setDefenderOfCatan"){
                swalError2(Enum.BarbarianAction[DATA.getMatch().barbarian.result.result]);
                return;
              }
              break;

            default:
              return;
          }

      }
        //input complete check
        /**
        if (!checkInput(CommandsData[cmd].apply(this, arguments))){
            return;
        }**/

        //allowed operations
        //if Enum.AllowedCommands[room.state] == null -> turn phrase, no allowed operations

        let phase = DATA.getMatch().phase;
        if (Enum.AllowedCommands[phase] && !_.contains(Enum.AllowedCommands[phase], cmd)){
            swalError2("This operation not allowed in "+ phase);
            return;
        }

        //comment out this part if you want to disable checks
        //checks
        if(!CommandCheck[cmd].apply(this, arguments)){
            return;
        }

        // if barbarian result commands
        if (app.barbarianResult){
            app.barbarianResult = false;
        }

        //exec
        sock.emit(cmd, CommandsData[cmd].apply(this, arguments));
    };

    sock.on(cmd + 'Ack', function (msg) {
        console.log(msg);
    });

    sock.on(cmd + 'Ack' + 'Owner', function (msg) {
        swalSucc(CommandSuccMsg[cmd]);
    });

});
