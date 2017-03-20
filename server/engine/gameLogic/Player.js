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
    player.progressCards = [];
    player.progressCardsCnt = 0;
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
    player.metropolitans = [];  //a list of integer -> position of the metropolitan
    player.cityImprovement = {[Enum.cityImprovementCategory.Politics]: 0, [Enum.cityImprovementCategory.Trade]: 0, [Enum.cityImprovementCategory.Science]: 0};


    /**TODO: Yuan change this later. Some stuff may not be able to trade!!
     * delete all resourece that cannot be trade, add stuff can can be traded
     *
     */
    player.tradeRatio = {[Enum.Resource.Lumber] : Cost.defaultTradeRatio, [Enum.Resource.Brick] : Cost.defaultTradeRatio, [Enum.Resource.Grain]: Cost.defaultTradeRatio, [Enum.Resource.Ore]: Cost.defaultTradeRatio, [Enum.Resource.Wool]: Cost.defaultTradeRatio, [Enum.Commodity.Cloth]: Cost.defaultTradeRatio, [Enum.Commodity.Coin]: Cost.defaultTradeRatio, [Enum.Commodity.Paper]: Cost.defaultTradeRatio};

    player.longestRoad = 0;
    player.rolledSeven = false;
    player.defenderOfCatan = false;

    player.cityWallNum = 0;
    player.maxSafeCardNum = 7;

    //player.match = null;


    /**
     *
     * @return {Number}
     */
    player.getBuildingCnt = function () {
        return Object.keys(player.buildings).length;
    }

    /**
     *
     * @return {Number}
     */
    player.getCityCnt = function () {
        return player.getCities().length;
    }
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
    }

    player.getFishSum = function(){
      return player.fishSum;
    }

    //TODO if player has a boot, then player requires to have 1 extra VP to win. i.e 10 VP
    player.drawRandomFish = function(){
      let keys = [];
      for (var fish in player.fishToken){
        keys.push(fish);
      }
      //generate a random index
      let randomToken = Math.floor(Math.random() * keys.length);
      switch(randomToken){
        case 0 : //one fish
          player.fishSum += 1;
        case 1 : //two fish
          player.fishSum += 2;
        case 2 : //three fish
          player.fishSum += 3;
        case 3 : //boot TODO: only one boot
          player.hasBoot = true;
      }
      //player.fishToken[keys[randomToken]]++;
      return keys[randomToken];
    }

    player.drawRandomFishNoBoat = function(){
      let keys = [Enum.fishToken.ONE_FISH,Enum.fishToken.TWO_FISH,
      Enum.fishToken.THREE_FISH
      ];
      //generate a random index
      let randomToken = Math.floor(Math.random() * keys.length);
      switch(randomToken){
        case 0 : //one fish
          player.fishSum += 1;
        case 1 : //two fish
          player.fishSum += 2;
        case 2 : //three fish
          player.fishSum += 3;
      }
      //player.fishToken[keys[randomToken]]++;
      return keys[randomToken];
    }


    /**
      * @param action Enum.fishEvent
      * @param data whatever the data is
      * @return player's current fishSum
      */
    player.spendFishToken = function(action, data){
      let newSum = 0;
      switch(action){
        case "MOVE_ROBBER" :
        //TODO check knight chase away thief.
          if(player.getFishSum() >= 2){
            robber.moveAway();
            newSum = player.fishSum - 2;
            player.setFishSum(newSum);
          }
          break;

        case "MOVE_PIRATE" :
          if(player.getFishSum() >= 2){
            pirate.moveAway();
            newSum = player.fishSum - 2;
            player.setFishSum(newSum);
          }
          break;

        case "STEAL_CARD" :
          if(player.getFishSum() >= 3){
            player.stealCard(data);
            newSum = player.fishSum - 3;
            player.setFishSum(newSum);
          }
          break;

        case "DRAW_RES_FROM_BANK" :
          if(player.getFishSum() >= 4){
            //draw one resource card but not Commodity
            player.resourcesAndCommodities[card]++;
            newSum = player.fish - 4;
            player.setFishSum(newSum);
          }
          break;

        case "BUILD_ROAD" :
          if(player.getFishSum() >= 5){
            //TODO

            newSum = player.fish - 5;
            player.setFishSum(newSum);
          }

        case "BUILD_SHIP" :
        if(player.getFishSum() >= 5){
          //TODO
          newSum = player.fish - 5;
          player.setFishSum(newSum);
        }

        case "DRAW_PROG" :
        if(player.getFishSum() >= 7){
          player.drawOneProgressCard(data);
          newSum = player.fish - 7;
          player.setFishSum(newSum);
        }
      }
      return player.fishSum;
    }

    player.giveAwayBoat = function(opponentPlayer){
      if(player.VP <= opponentPlayer.VP){
        opponentPlayer.hasBoot = true;
        player.hasBoot = false;
        return true;
      }
      else
        return false;
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
    player.drawOneProgressCard = function(progCard){
      player.progressCards.push(progCard);
      player.progressCardsCnt++;
      return player.progressCards;
    }

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
        opponentPlayer.resourceAndCommandities[keys[stolenCard]] ++;
        player.resourceAndCommandities[keys[stolenCard]]--;

        return keys[stolenCard];
    };

    player.stealCard = function (opponentPlayer) {
        let keys = [];
        for (let card in opponentPlayer.resourceAndCommandities){
            if (opponentPlayer.resourceAndCommandities[card] > 0){
                for (var i = 0; i < opponentPlayer.resourceAndCommandities[card]; i++)
                    keys.push(card);
            }
        }
        //generate a random index
        let stolenCard = Math.floor(Math.random() * keys.length);
        player.resourceAndCommandities[keys[stolenCard]] ++;
        opponentPlayer.resourceAndCommandities[keys[stolenCard]]--;

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
            if (player.buildings.hasOwnProperty(vertex) && player.buildings[vertex].level == 2){
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
            if (player.buildings.hasOwnProperty(vertex) && player.buildings[vertex].level == 1){
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
    //var disProgCards = [ "Crane","Alchemist"];
    player.discardProgressCards = function(cards){
        if (player.progressCardsCnt < 1)
            return false;
        for (var i=0; i < player.progressCardsCnt; i++) {
            var found = player.progressCards.indexOf(cards[i]);
            if (found > -1) {
                player.progressCards.splice(found, 1);
            }
        }
        player.progCardSum();
    };



    /*TODO:
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
    player.calculateLongestRoad = function(){

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
        numToBeDiscarded = Math.floor(player.resourceCardTotalNum/2);
      }
      return numToBeDiscarded;
    }


    //var disProgResCards = ["Wood":2,"Brick":1];
  //  player.resourcesAndCommodities = {[Enum.Resource.Lumber] : 0, [Enum.Resource.Brick] : 0, [Enum.Resource.Grain]: 0, [Enum.Resource.Ore]: 0, [Enum.Resource.Wool]:0, [Enum.Resource.Gold]: initialGoldNum, [Enum.Commodity.Cloth]: 0, [Enum.Commodity.Coin]: 0, [Enum.Commodity.Paper]: 0};

    player.discardResourceCards = function(cards){
      let keys = [];
      for (var card in player.resourceAndCommandities){
        for (var discard in cards){
          //TODO
          //hasOwnProperty;

          }

        }
      player.resourceCardTotalNum(player);
    }


    player.getCitySum = function(){
      var sum = 0;
      for(var i in player.buildings){
        if(player.buildings[i].level == 2 && player.buildings.hasOwnProperty(i))
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

    player.printKnightInfo = function(){
      console.log("player : " + player.name);
      for (var knight in player.knights){
        console.log("active knight " +player.knights[knight].active);
        console.log("knight level " + player.knights[knight].level)
      }
     console.log("knight/barbarian strength" + player.getKnightsSum());
   };

    player.printBuildingInfo = function(){
      console.log("player : " + player.name);
      for(var building in player.buildings){
        if (player.buildings.hasOwnProperty(building)){
          console.log("building level " + player.buildings[building].level);
        }
      }
      console.log("city/catan strength" + player.getCitySum());
    };

    player.setDefenderOfCatan = function(result){
      player.defenderOfCatan = result;
    };

    player.getDefenderOfCatan = function(){
      return player.defenderOfCatan;
    };

    return player;






    /**
     *
     * @return {number} the card number players hold
     *//**
     getCardNums(){
        let num = 0;
        for (let card in this.resourcesAndCommodities){
            if (this.hasOwnProperty(card)) num += this.resourcesAndCommodities[card];
        }
        return num;
    }
     hasToDiscardCards(){
        return this.maxSafeCardNum < this.getCardNums();
    }**/

    /**
     *
     * @param cards a list of string (card type), the cards player choose to discard
     *//**
     discardCards(cards){
        for (let card of cards){
            this.resourcesAndCommodities[card] --;
        }
    }
     /**
     *
     * @return {string[]} resource selected
     *//**
     selectResource(num){
        //change later
        if (num > 2) throw "Num should be smaller or equal to 2.";
        if (num == 2) return [Resource.Wool, Resource.Grain];
        return [Resource.Brick];
    }**/




}
