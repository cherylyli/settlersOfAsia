/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let Enum = require('./Enum.js');
let Cost = require('./Cost.js');
let Building = require('./Building.js');
let Robber = require('./Robber.js');
let Commands = require('../Commands.js');
let _ = require('underscore');

/**
 * Player stores the game info of a user in a game.
 */

let Player = module.exports = {};
let initialGoldNum = 2;

Player.createPlayer = function (name, user) {
    let player = {};




    /**
     * progressCardsCnt doesn't count Vp cards
     * progressCards includes VP cards
     */

    player.user = user;     //user
    player.name = name;
    player.color = null;
    player.VP = 0;
    player.resourcesAndCommodities = {[Enum.Resource.Lumber] : 0, [Enum.Resource.Brick] : 0, [Enum.Resource.Grain]: 0, [Enum.Resource.Ore]: 0, [Enum.Resource.Wool]:0, [Enum.Resource.Gold]: initialGoldNum, [Enum.Commodity.Cloth]: 0, [Enum.Commodity.Coin]: 0, [Enum.Commodity.Paper]: 0};
    player.resourceCardNum = initialGoldNum;
    // TODO: testing, change later
    player.progressCards = [];
    //[Enum.ProgressCardType.Science.Alchemist, Enum.ProgressCardType.Trade.Merchant, Enum.ProgressCardType.Politics.Bishop];
    player.progressCardsCnt = player.progressCards.length;
    //TODO - player can only place at most 5 settlements
    player.buildings = {};  //key: position (vertex index / int); value: building object
    player.settlementCnt = 0;   //the number of settlements player has. used in check function -> player cannot have more than 5 settlements (he has to upgrade one to city build he builds another settlement
    player.roads = {};  // key: edge key, value: edge. Use edge key as hash function so it's easier to remove an element
    player.ships = {};  // key: edge key, value: edge. Use edge key as hash function so it's easier to remove an element
    player.fishHex = [];
    player.fishToken = {[Enum.fishToken.ONE_FISH] : 0, [Enum.fishToken.TWO_FISH] : 0, [Enum.fishToken.THREE_FISH] : 0, [Enum.fishToken.BOOT] : 0};  //key: enum.fishToken, value: num
    player.hasBoot = false;
    player.fishSum = 0;
    player.harbors = [];
    player.knights = [];
    //player.metropolitans = [];  //a list of integer -> position of the metropolitan ????????
    player.winningVP = 10;
    player.cityImprovement = {[Enum.cityImprovementCategory.Politics]: 0, [Enum.cityImprovementCategory.Trade]: 0, [Enum.cityImprovementCategory.Science]: 0};
    // player.Metropolis = [];   //Building object

    /**TODO: Yuan change this later. Some stuff may not be able to trade!!
     * delete all resourece that cannot be trade, add stuff can can be traded
     *
     */
    player.tradeRatio = {[Enum.Resource.Lumber] : Cost.defaultTradeRatio, [Enum.Resource.Brick] : Cost.defaultTradeRatio, [Enum.Resource.Grain]: Cost.defaultTradeRatio, [Enum.Resource.Ore]: Cost.defaultTradeRatio, [Enum.Resource.Wool]: Cost.defaultTradeRatio, [Enum.Commodity.Cloth]: Cost.defaultTradeRatio, [Enum.Commodity.Coin]: Cost.defaultTradeRatio, [Enum.Commodity.Paper]: Cost.defaultTradeRatio};

    player.longestRoad = [];
    player.rolledSeven = false;
    player.defenderOfCatan = false;

    player.cityWallNum = 0;
    player.maxSafeCardNum = 7;

    //Fields used for progress cards
    player.progress_cards = {'CommercialHarbor':'CommercialHarbor'}; //we place new progress cards into this dictionary
    player.active_cards = {}; //after processing progress card we add here permmissions to build roads or take stuff from others

    /**
     *
     * @return {Number}
     */
    player.getBuildingCnt = function () {
        return Object.keys(player.buildings).length;
    };

    /**
     *
     * @return {Number}
     */
    player.getCityCnt = function () {
        return player.getCities().length;
    };
    /**
     *
     * @return {number}
     */
    player.getRoadAndShipCnt = function () {
        return Object.keys(this.ships).length + Object.keys(this.roads).length;
    };

    player.setFishSum = function(newSum){
      player.fishSum = newSum;
      return player.fishSum;
    };

    player.getFishSum = function(){
      return player.fishSum;
    };

    //TODO if player has a boot, then player requires to have 1 extra VP to win. i.e 10 VP
    player.drawRandomFish = function(){
      let keys = [];
      for (let fish in player.fishToken){
          if (player.fishToken.hasOwnProperty(fish)){
              keys.push(fish);
          }
      }
      //generate a random index
      let randomToken = Math.floor(Math.random() * keys.length);
      switch(randomToken){
        case 0 : //one fish
          player.fishSum += 1;
            break;
        case 1 : //two fish
          player.fishSum += 2;
            break;
        case 2 : //three fish
          player.fishSum += 3;
            break;
        case 3 : //boot TODO: only one boot
          player.hasBoot = true;
          player.winningVP += 1;
      }
      //player.fishToken[keys[randomToken]]++;
      return keys[randomToken];
    };

    player.drawRandomFishNoBoot = function(){
      let keys = [Enum.fishToken.ONE_FISH,Enum.fishToken.TWO_FISH,Enum.fishToken.THREE_FISH];
      //generate a random index
      let randomToken = Math.floor(Math.random() * keys.length);
      switch(randomToken){
        case 0 : //one fish
          player.fishSum += 1;
            break;
        case 1 : //two fish
          player.fishSum += 2;
            break;
        case 2 : //three fish
            player.fishSum += 3;
            break;
      //player.fishToken[keys[randomToken]]++;、
    }
      return keys[randomToken];

    };

    player.giveAwayBoot = function (opponentPlayer){
      if(player.VP <= opponentPlayer.VP){
        opponentPlayer.hasBoot = true;
        opponentPlayer.winningVP += 1;
        player.hasBoot = false;
        player.winningVP -= 1;
        return true;
      }
      else
        return false;
    };


    /**
      * @param action Enum.fishEvent
      * @param data whatever the data is
          cases:
          move robber & move pirate - doesn't matter.
          steal card - data: {Player}
          draw one resource card - data {Enum.ResourceCard}
          build road/ ship - data {[int], [int]}
          draw the selected progress card - data {String}
      * @param match {Match}
      * @return player's current fishSum
      */

    player.spendFishToken = function(action, match){
      let newSum = 0;
      switch(action){
        case "MOVE_ROBBER" :
          match.fish = "MOVE_ROBBER";
          break;

        case "MOVE_PIRATE" :
          match.fish = "MOVE_PIRATE";
          break;

        case "STEAL_CARD" :
          match.fish = "STEAL_CARD";
          break;

        case "DRAW_RES_FROM_BANK" :
          match.fish = "DRAW_RES_FROM_BANK"
          break;

        case "BUILD_ROAD" :
          match.fish = "BUILD_ROAD";
          break;

        case "BUILD_SHIP" :
          match.fish = "BUILD_SHIP";
          break;

        case "DRAW_PROG" :
          match.fish = "DRAW_PROG";
      }
    }

    /**
      * count the total number of cards (Resource+Commodity) current player owns
      * @param currentPlayer {Player}
      * @return sum {Integer}
      */
    player.resourceCardTotalNum = function(){
        let sum = 0;
        for (let card in player.resourcesAndCommodities){
            sum += player.resourcesAndCommodities[card];
        }
        return sum;
    };

    /**
     * Add one progress card of player's choice to player's current progressCards.
     * @param progCard  progress card of player's choice
     * @return player.progressCards {String}
     */
    player.drawOneProgressCard = function(match, kind){
      var progCardList = [];
      var playersCards = [];
      let players = match.players;

      for (var i in players) {
        for(var card in players[i].progressCards){
          playersCards.push(players[i].progressCards[card]);
        }
      }

      for(var progCard in Enum.ProgressCardType[kind]){
        progCardList.push(Enum.ProgressCardType[kind][progCard]);
      }
      //console.log(playersCards);
      //console.log(progCardList);
      var duplicates = _.intersection(progCardList,playersCards);
      var progCard = _.difference(progCardList,duplicates);

      console.log("from it" + progCard[0]);

      player.progressCards.push(progCard[0]);
      player.progressCardsCnt++;
      return player.progressCards;
    };

    player.drawOneResourceCard = function(resCard){
      player.resourcesAndCommodities[resCard]++;
      return player.resourcesAndCommodities;
    };

    /**
     * this player is stolen by another player, will return the card type that's being stoled.
     * @param opponentPlayer {Player}
     * @return card {String}
     */
    player.stolenBy = function (opponentPlayer) {
        if (player.resourceCardTotalNum() < 1){
            console.log("Not enough resource")
            return false;
        }
        let keys = [];
        for (let card in player.resourcesAndCommodities){
            if (player.resourcesAndCommodities[card] > 0){
              for(var i = 0; i < player.resourcesAndCommodities[card]; i++){
                keys.push(card);
                console.log(card);
              }
            }
        }
        //generate a random index
        let stolenCard = Math.floor(Math.random() * keys.length);
        opponentPlayer.resourcesAndCommodities[keys[stolenCard]] ++;
        opponentPlayer.resourceCardNum  ++;

        player.resourcesAndCommodities[keys[stolenCard]]--;
        player.resourceCardNum --;

        return keys[stolenCard];
    };

    player.stealCard = function (opponentPlayer) {
        let keys = [];
        for (let card in opponentPlayer.resourcesAndCommodities){
            if (opponentPlayer.resourcesAndCommodities[card] > 0){
                for (var i = 0; i < opponentPlayer.resourcesAndCommodities[card]; i++)
                    keys.push(card);
            }
        }
        //generate a random index
        let stolenCard = Math.floor(Math.random() * keys.length);
        player.resourcesAndCommodities[keys[stolenCard]] ++;
        opponentPlayer.resourcesAndCommodities[keys[stolenCard]]--;

        return keys[stolenCard];
    };
    /**
     *
     * @param points may be negative or positive, int
     */
    player.updateVP = function(points){
        player.VP += points;
        player.match.checkPlayerVP(this);
    }; //HERE


    /**
     *
     * @param vertex {int}
     * @return {Building}
     */
    player.getBuilding = function (vertex) {
        return player.buildings[vertex];
    };


    /**
     *
     * @return {Array<Building>}
     */

    player.getCities = function () {
        let cities = [];
        for (let vertex in player.buildings){
            if (player.buildings.hasOwnProperty(vertex) && player.buildings[vertex].level == Enum.Building.City){
                cities.push(player.buildings[vertex]);
            }
        }
        return cities;
    };
    /**
     *
     */
    player.getSettlements = function () {
        let settlements = [];
        for (let vertex in player.buildings){
            if (player.buildings.hasOwnProperty(vertex) && player.buildings[vertex].level == Enum.Building.Settlement){
                settlements.push(player.buildings[vertex]);
            }
        }
        return settlements;
    };


    /**
     * cards is a list of string
     * player.progressCard is a list a String
     *
     */
    player.progCardSum = function(){
        player.progressCardsCnt = player.progressCards.length;
        return player.progressCardsCnt;
    };

    //player.progressCards = ["Bishop","Alchemist","Crane"];
    //var discard = "Alchemist"
    player.discardOneProgressCard = function(card){

        for (var i=0; i < player.progressCardsCnt; i++) {
            if (card == player.progressCards[i]) {
                player.progressCards.splice(i, 1);
                break;
            }
        }
        player.progCardSum();
    };



    /*TODO:
    NOTE: a continous road can be blocked by opponentplayer's knights / settlements/ cities
    map structure: engin/document/map-37.png
    	1.find a way to store start node of each edge.
    		a).-- flatten list then remove duplicates?  NO :(
    			expected input (clockwise):
    				[1,2],[2,3],[3,13],[13,12],[12,11] - start nodes: 1,2,3,13,12
    			received input:
    				[1,2],[2,3],[3,13],[12,13],[11,12] - start nodes: 1,2,3,12,11 -
    			flatten remove duplicates (use underscore flatten): 1,2,3,11,12,13 -> extra 11..
    		b). create a set of list to store the partial connected road.
    				e.g [ [[1,2],[2,3]], [[12,13]], [[15,16],[16,17],[17,18]] :/ then BFS?
    	2. Deal with opponent player's interrupt. - place one settlement on a vertex will split the road apart.
    		[1,2], [2,3],[3,4],[4,5],[5,6],[6,7] - start nodes : 1,2,3,4,5,6 longest road: 6
    		- opponent player's settlement on vertex 2
    		- remove vertex 2 -> start noes: 1,3,4,5,6 - then increment curLen by 1 - return 5
    	3.Road-Ship connection.
    		create a new list - add all start nodes of roadlist to that new list
    		store start nodes of ship.
    		compare ship nodes with road nodes
    			if contains same start node ->
    				check whether there is a settlement/city of that vertex, if so add the ship node to new list
    				else - skip and continue.
    			else (not sharing same node) just add the ship to list (won't affect counter)
    		ships: can have 2 type of ship route:
    			open: one end of the ship route connects to a city/settelement
    			closed: both ends of the ship route attach to a city/settlemnt
    */
    //For example:
    //player.roads = [[1,2], [2,3],[3,4], [10,11]]
    //player.ships = [[1,5]]
    //if there is settlement at vertex 1: longest road is [1,5]-[1,2]-[2,3]-[3,4] (4); if not then [1,5] is not in the route, the route length is 3
    //if larger than 5, also check whether with match.longestRoad to see whether the player can get the longest road card, also update VP
    player.calculateLongestRoad = function(map){

        /**
         * TODO:
         * 1. check vertices -- DONE
         * 2. check roads vs ships
         *
         */
        if (!map) return 0;
        var mappedData = storeVerticesToMap(player.roads, {});
        var mappedData = storeVerticesToMap(player.ships, mappedData);

        var strRoads = JSON.stringify(player.roads);
        var strShips = JSON.stringify(player.ships);

        var vertexData = storeVertexElements(map['vertexInfo'], {});

        // find root node(s), form initial paths
        var paths = [];
        var endToEndPaths = [];

        // push root nodes (any node beginning at a vertex with only that edge that's owned by the player)
        // each path would be a number of vertices and the end of the last edge:
        for (var key in mappedData){
          if (mappedData[key].length==1){
            var path = [];

            // first element in path is the path
            path.push([mappedData[key][0]]);
            var edge = mappedData[key][0];

            // second element in the path is the non-starting end
            if (edge[0] == key){
              path.push(edge[1]);
            } else{
              path.push(edge[0]);
            }

            paths.push(path);
          }
        }

        var hasNewPath = false;
        var currPath;

        // each path is an array of edges and an ending node: [[[1, 2], [2, 3], [3, 4]], 4]
        while (paths.length > 0){
          if (!hasNewPath){
            currPath = paths.shift();
            var lastNode = currPath[1];
            currPath = currPath[0];
          } else {
            currPath = newCurrPath[0].slice();
            lastNode = newCurrPath[1];
          }
          var prevNode = lastNode;
          var roadType;
          if (strRoads.indexOf(JSON.stringify(currPath[currPath.length -1])) == -1){
            roadType = "ship";
          }else{
            roadType = "road";
          }




          // find the lastNode in mappedData, if we've edge is in traversed list, throw it out
          possiblePaths = mappedData[prevNode];
          var i_0 = 0;
          var traversedString = JSON.stringify(currPath);

          // if no more possible paths, then push current path into endToEndPaths
          if (!possiblePaths || possiblePaths.length == 0){
            endToEndPaths.push(currPath);
            continue;
          }

          // if there is something on the lastNode
          // check if it's the player's
          // if not, push current path to endToEndPaths
          if (vertexData && vertexData[prevNode]){
            if (vertexData[prevNode].name != player.name){
              endToEndPaths.push(currPath);
              currPath = [];
            }
          }

          hasNewPath = false;

          for (var i_0 = 0; i_0<possiblePaths.length; i_0++){
            var possibleString = JSON.stringify(possiblePaths[i_0]);

            if (traversedString.indexOf(possibleString)==-1){
              // push into paths
              var p = possiblePaths[i_0];
              var newPath = [];
              var newCurrentPath = currPath.slice();



              newCurrentPath.push(p);
              newPath.push(newCurrentPath);

              // get roadType of new edge
              var newRoadType;
              if (strRoads.indexOf(JSON.stringify(p)) == -1){
                newRoadType = "ship";
              }else{
                newRoadType = "road";
              }

              if (newRoadType != roadType){

                  // FIXME: vertexData[prevNode].type does not have 'Metropolis' type. Check Enum.Building. For Metropolis, it's 'Science, Trade or Politcs' LOL. I added one helper function for you. To tell whether a vertexUnit is building or knight. do vertexUnit.getVertexUnitType(), it return "building" or "knight" XD. By.Emol

                if (vertexData && vertexData[prevNode] && (vertexData[prevNode].type == 'City' || vertexData[prevNode].type == 'Settlement' || vertexData[prevNode].type =='Metropolis') && vertexData[prevNode].name == player.name){
                  //continue


                }
                else {
                  //different partitions
                  endToEndPaths.push(currPath);
                  newPath = [];
                  var newPartition = [];
                  newPartition.push(p);
                  newPath.push(newPartition);
                  newPath.push(p[1-p.indexOf(prevNode)]);
                }
              }

              if (!hasNewPath){
                lastNode = p[1-p.indexOf(prevNode)];
                newPath.push(lastNode);
                newCurrPath = newPath.slice();
              }


              if (hasNewPath){
                newlastNode = p[1-p.indexOf(prevNode)];
                newPath.push(newlastNode);
                paths.push(newPath);
              }



              hasNewPath = true;

            }
          }

          // for each possible path in possiblePaths that remain, add to currPath, append last node, and append to
          if (!hasNewPath){
            endToEndPaths.push(currPath);
          }

        }

        var longestRoad = endToEndPaths[0];
        endToEndPaths.forEach(function(p){
          if (p.length > longestRoad.length){
            longestRoad = p;
          }
        });

        if (!longestRoad){
          return 0;
        }
        return longestRoad.length;
    };


        // vertexInfo is an array
        // for each vertex, store buildings/knights of all players
        function storeVertexElements(vertexInfo, vertexData){
          if (!vertexInfo) return;
          var vertexData = vertexData || {};
          for (var i = 0; i<vertexInfo.length; i++){
            if (vertexInfo[i] && vertexInfo[i]['owner']){
              vertexData[vertexInfo[i].position] = {name: vertexInfo[i].owner.name, type: vertexInfo[i].level};
            }
          }
          return vertexData;
        }

        // from list, break down each element and store according to what vertices they touch
        function storeVerticesToMap(items, mappedData){
          mappedData = mappedData || {};
          var newVertexStuffV1;
          var newVertexStuffV2;
          for (var key in items){
            newVertexStuffV1 = [];
            newVertexStuffV2 = [];

            v1 = items[key][0];
            v2 = items[key][1];
            if (mappedData[v1]){
              newVertexStuffV1 = mappedData[v1];
            }
            newVertexStuffV1.push(items[key]);
            mappedData[v1] = newVertexStuffV1;

            if (mappedData[v2]){
              newVertexStuffV2 = mappedData[v2];
            }
            newVertexStuffV2.push(items[key]);
            mappedData[v2] = newVertexStuffV2;

          }
          return mappedData;
        }



    // from list, break down each element and store according to what vertices they touch
    function storeVerticesToMap(items, mappedData){
      mappedData = mappedData || {};
      var newVertexStuffV1;
      var newVertexStuffV2;
      for (var key in items){
        newVertexStuffV1 = [];
        newVertexStuffV2 = [];

        v1 = items[key][0];
        v2 = items[key][1];
        if (mappedData[v1]){
          newVertexStuffV1 = mappedData[v1];
        }
        newVertexStuffV1.push(items[key]);
        mappedData[v1] = newVertexStuffV1;

        if (mappedData[v2]){
          newVertexStuffV2 = mappedData[v2];
        }
        newVertexStuffV2.push(items[key]);
        mappedData[v2] = newVertexStuffV2;

      }
      return mappedData;
    }


    /**
     * Return a continous road that contains the input vertex.
       e.g player has a continous road from 1-2-3-4 ->  [1,2],[2,3],[3,4],[4,5] (5 is the end nodes)
       input 3 returns a list of empty unoccupied vertices [1,2,3,4,5]
     * @param vertex {Int}
     * @return Int list - all vertices on that road.
     */
    player.getEmptyAdjacentVertices = function(vertex, match){
      /**
       * Tests:
       * 1. Separate road / ships unless connected with player's city/settlement
       * 2. Knight or building at a vertex removes it from empty vertex list -- checked
       */

      if (!vertex || !match) return [];
      var mappedData = storeVerticesToMap(player.roads, {});
      var mappedData = storeVerticesToMap(player.ships, mappedData);

      var strRoads = JSON.stringify(player.roads);
      var strShips = JSON.stringify(player.ships);

      var vertexData = storeVertexElements(match.map['vertexInfo'], {});

      // if player doesn't own the vertex, return empty list
      if (vertexData && vertexData[vertex] && vertexData[vertex].name != player.name){
        return [];
      }

      // if no road adjacent to vertex, return empty list
      if (!mappedData[vertex]){
        return [];
      }

      // get root where the road begins
      // store empty vertices
      var traversed = [];
      var paths = [];
      var emptyVertices = [];
      var pathsAtVertex = mappedData[vertex];

      // find next vertex, check if it's empty
      for (var i = 0; i< pathsAtVertex.length; i++){
        var path = pathsAtVertex[i];
        var nextV = path[1-path.indexOf(vertex+"")];
        if (!vertexData[nextV]){
          emptyVertices.push(nextV);
        }
        traversed.push(path);
        paths.push(nextV);
      }


      // traverse the path until no more possible roads
      while (paths.length > 0){


        var lastVertex = parseInt(paths.shift());

        // console.log("paths, traversed, lastVertex");
        // console.log(paths);
        // console.log(traversed);
        // console.log(lastVertex);

        // console.log("emptyvertexList");
        // console.log(emptyVertices);

        // check if there's another road/ship connected there
        var newPossibilites = mappedData[lastVertex];

        // console.log("new possibilities");
        // console.log(newPossibilites);

        if (!newPossibilites){continue;}
        for (var i = 0; i< newPossibilites.length; i++){
          var p = newPossibilites[i];
          // if it's been traversed, ignore; else, append to paths
          if (JSON.stringify(traversed).indexOf(JSON.stringify(p)) == -1){
            var newLastVertex = p[1-p.indexOf(lastVertex+"")];
            if (!vertexData[newLastVertex]){
              emptyVertices.push(newLastVertex);
            }
            traversed.push(p);
            paths.push(newLastVertex);

            // console.log("new p & new last vertex");
            // console.log(p);
            // console.log(newLastVertex);


          }
        }


      }

      return emptyVertices;

    };


    /**
     *
     * @param cityImprovementCategory {String}
     * @return {int}
     */
    player.buyCityImprovement = function(cityImprovementCategory){
        player.cityImprovement[cityImprovementCategory] ++;
        return player.cityImprovement[cityImprovementCategory];
    };


    //TODO test & add comment below
    /**
     * When a seven is rolled, all players who have more than 7 resources cards need to discard half of their cards (round down)
     * calculate the number of resource cards player needs to discard.
     * @return number of cards to be discarded {Integer}
     */
    //return the total # of cards a player needs to discard.
    player.discardedCardsCnt = function(){
      var numToBeDiscarded = -1;
      if(player.resourceCardTotalNum() <= player.maxSafeCardNum){
        return 0;
      }
      else {
        //if player has a city wall then he can keep 2 cards from robber.
        var cardsToKeep = 0;
        for(var city in player.buildings){
          if(player.buildings[city].cityWall){
            cardsToKeep += 2;
          }
        }
        numToBeDiscarded = Math.floor(player.resourceCardTotalNum()/2) - cardsToKeep;
      }
      return numToBeDiscarded;
    };


  //  player.resourcesAndCommodities = {[Enum.Resource.Lumber] : 0, [Enum.Resource.Brick] : 0, [Enum.Resource.Grain]: 0, [Enum.Resource.Ore]: 0, [Enum.Resource.Wool]:0, [Enum.Resource.Gold]: initialGoldNum, [Enum.Commodity.Cloth]: 0, [Enum.Commodity.Coin]: 0, [Enum.Commodity.Paper]: 0};
    //DATA INPUT {{[Enum.Resource.Lumber] : 0, [Enum.Resource.Brick] : 0, [Enum.Resource.Grain]: 0, [Enum.Resource.Ore]: 0, [Enum.Resource.Wool]:0, [Enum.Resource.Gold]: initialGoldNum, [Enum.Commodity.Cloth]: 0, [Enum.Commodity.Coin]: 0, [Enum.Commodity.Paper]: 0};} - Int : discarded amount
    player.discardResourceCards = function(cards, num){
      let keys = [];
      for (var card in player.resourcesAndCommodities){
        for(var discard in cards){
          if(card == discard && player.resourcesAndCommodities[card] >= cards[discard]){
            player.resourcesAndCommodities[card] -= cards[discard];
          }
        }
      }
      player.resourceCardTotalNum();
    }


    player.getCitySum = function(){
      var sum = 0;
      for(var i in player.buildings){
        if(player.buildings[i].level == Enum.Building.City && player.buildings.hasOwnProperty(i))
          sum++
      }
      return sum;
    };


    player.getKnightsSum = function(){
      var sum = 0;
      for(var i in player.knights){
        if(player.knights[i].active == true){
          sum += player.knights[i].level;
          //strength ??? catan ?
        }
      }
      return sum;
    };

    player.offerTrade = function(offer,receiver){
      //TODO

    };

    player.acceptTrade = function(offer,willAccept){
      //TODO

    };

    player.setDefenderOfCatan = function(result){
      player.defenderOfCatan = result;
    };

    player.getDefenderOfCatan = function(){
      return player.defenderOfCatan;
    };
    //we are moving card from progress_cards to active cards
    player.useCard = function(card){
      console.log("Using card"+card);
      player.active_cards[player.progress_cards[card]] = player.progress_cards[card];
      delete player.progress_cards[card];
    }

    return player;
}
