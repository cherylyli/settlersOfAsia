/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let Enum = require('./Enum.js');

/**
 * Player stores the game info of a user in a game.
 */

let Player = module.exports = {};

Player.createPlayer = function () {
    let player = {};

    /**
     * progressCardsCnt doesn't count Vp cards
     * progressCards includes VP cards
     */

    player.VP = 0;
    player.resourcesAndCommodities = {[Enum.Resource.Lumber] : 0, [Enum.Resource.Brick] : 0, [Enum.Resource.Grain]: 0, [Enum.Resource.Ore]: 0, [Enum.Resource.Wool]:0, [Enum.Commodity.Cloth]: 0, [Enum.Commodity.Coin]: 0, [Enum.Commodity.Paper]: 0};
    player.progressCards = [];
    player.progressCardsCnt = 0;
    player.buildings = {};  //key: position (vertex index / int); value: building object
    player.roads = [];  // a list of edges
    player.ships = []  // a list of edges
    player.harbors = [];

    player.longestRoad = 0;

    player.cityWallNum = 0;
    player.maxSafeCardNum = 7;
    player.match = null;


    /**
     *
     * @param points may be negative or positive, int
     */
    player.updateVP = function(points){
        player.VP += points;
        player.match.checkPlayerVP(this);
    }


    /**
     *
     * @param vertex {int}
     * @return {Building}
     */
    player.getBuilding = function (vertex) {
        return player.buildings[vertex];
    }



    /**
     * helper function
     * Every we make changes to roads/ ships, we recalculate the longest road
     */
    player.calculateLongestRoad = function(){
        //TODO: Yuan
        //calculate longest road based on player.ships and player.roads
        //these two are just list of edges.

        //For example:
        //player.roads = [[1,2], [2,3],[3,4], [10,11]]
        //player.ships = [[1,5]]
        //if there is settlement at vertex 1: longest road is [1,5]-[1,2]-[2,3]-[3,4] (4); if not then [1,5] is not in the route, the route length is 3

        //if larger than 5, also check whether with match.longestRoad to see whether the player can get the longest road card
    }

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