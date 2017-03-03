/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let Enum = require('./Enum.js');
let Cost = require('./Cost.js');
let Building = require('./Building.js');

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
    player.progressCards = [];
    player.progressCardsCnt = 0;
    player.buildings = {};  //key: position (vertex index / int); value: building object
    player.settlementCnt = 0;   //the number of settlements player has. used in check function -> player cannot have more than 5 settlements (he has to upgrade one to city build he builds another settlement
    player.roads = {};  // key: edge key, value: edge. Use edge key as hash function so it's easier to remove an element
    player.ships = {};  // key: edge key, value: edge. Use edge key as hash function so it's easier to remove an element
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

    player.cityWallNum = 0;
    player.maxSafeCardNum = 7;
    //player.match = null;







    /**
      * count the total number of cards (Resource+Commodity) current player owns
      * @param currentPlayer {Player}
      * @return sum {Integer}
      */
    player.resourceCardTotalNum = function(currentPlayer){
        let sum = 0;
        for (let card in currentPlayer.resourceAndCommandities){
            sum += currentPlayer.resourceAndCommandities[card];
        }
        return sum;
    };

    /**
     * this player is stolen by another player, will return the card type that's being stoled.
     * @param opponentPlayer {Player}
     * @return card {String}
     */
    player.stolenBy = function (opponentPlayer) {
        if (resourceCardTotalNum(player) < 1){
            console.log("Not enough resource")
            return null;
        }

        let keys = [];
        for (let card in player.resourceAndCommandities){
            if (player.resourceAndCommandities[card] > 0){
                for (var i = 0; i < player.resourceAndCommandities[card]; i++)
                    keys.push(card);
            }
        }
        //generate a random index
        let stolenCard = Math.floor(Math.random() * keys.length);
        opponentPlayer.resourceAndCommandities[keys[stolenCard]] ++;
        player.resourceAndCommandities[keys[stolenCard]]--;

        return keys[stolenCard];
    };

    /**
     *
     * @param points may be negative or positive, int
     */
    player.updateVP = function(points){
        player.VP += points;
        player.match.checkPlayerVP(this);
    };


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
        if (player.progCardSum < 1)
            return null;

        for (var i=0; i<cards.length; i++) {
            var found = player.progressCards.indexOf(cards[i]);
            if (found > -1) {
                player.progressCards.splice(found, 1);
            }
        }
        player.progCardSum();
    };

    /*
    console.log(player.progCardSum());
    console.log(player.progressCards);
    player.discardProgressCards(disProgCards);
    console.log(player.progressCards);
    console.log(player.progressCardsCnt);
    */


    /*
     calculate longest road based on player.ships and player.roads
     @return length of the longest road of current player. 
     so far : only works for roadList. 
        e.g if player.road =  [[1,2],[13,12],[3,13],[12,11],[2,3]]; //return 5
            if player.road =  [[1,2], [3,4], [10,11],[11,12],[2,3]]; //return 3 
        Note: edge should be stored in clockwise direction(refer to map-51.png):  1-2-3-13-12 
                [13,12] will work but [12,13] won't work in this case. 
    TODO: 
    1.verify the connection between ships and roads. <- not sure how to do this. ??????
            1.ships-settlement-roads 
            2.ships-roads  
    2.longest road was interrupted by a settlement (opponent's settlement)
        Longest Road - How can I interrupt an opponent's Longest Road?
        By building a settlement on an intersection of the Longest Road.
    */
    
        //For example:
        //player.roads = [[1,2], [2,3],[3,4], [10,11]]
        //player.ships = [[1,5]]
        //if there is settlement at vertex 1: longest road is [1,5]-[1,2]-[2,3]-[3,4] (4); if not then [1,5] is not in the route, the route length is 3

        //if larger than 5, also check whether with match.longestRoad to see whether the player can get the longest road card, also update VP
    
    player.calculateLongestRoad = function(){
    //var roadList = [[1,2], [2,3],[3,4], [6,7], [10,11],[11,12]]; //should return 3 
    //var roadList = [[1,2],[13,12],[3,13],[12,11],[2,3]]; //return 5
/**
        var road = player.roadList;

        //if player owns less than 5 roads 
        if(road.length<5){
            console.log("road length less than 5");
            return 0;   
        }

        //else
        var count;
        var pre; //left
        var post; //right
        var up;
        var down;

        var max = 0;
        var curLen;
        var set=[];
        var map = {};
        var visited = [];

        for(var i=0; i<road.length;i++){
            node = road[i][0]; //start node. 
            //pre = road[i][0];
            //next = road[i][1];  
            set.push(node); 
            //map: key = node[i][0], value = i 
            map[set[i]] = i; 
        }
        
        //console.log(set.toString());
        for (var val in map){
            var i = map[val];
            if (visited[i])
                continue;

            pre = val - 1;
            post = val + 1;
            up = val - 10; 
            down = val + 10; //e.g jump from 3 to 13 
            curLen = 1;
            
            //if map contains value pre. 
            while (map.hasOwnProperty(pre)) {
                visited[map[pre]] = true;
                curLen++;
                pre--;

            }
            while (map.hasOwnProperty(post)) {
                visited[map[post]] = true;
                curLen++;
                post++;
            }
             while (map.hasOwnProperty(up)) {
                visited[map[up]] = true;
                curLen++;
                up--;

            }   
             while (map.hasOwnProperty(down)) {
                visited[map[down]] = true;
                curLen++;
                down--;
            } 
            max = Math.max (curLen, max);
        }
        console.log("length of longest road is " + max);**/
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