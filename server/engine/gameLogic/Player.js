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
    player.resourcesAndCommodities = {[Enum.Resource.Wheat] : 0, [Enum.Resource.Brick] : 0, [Enum.Resource.Grain]: 0, [Enum.Resource.Ore]: 0, [Enum.Resource.Wool]:0, [Enum.Commodity.Cloth]: 0, [Enum.Commodity.Coin]: 0, [Enum.Commodity.Paper]: 0};
    player.progressCards = [];
    player.progressCardsCnt = 0;
    player.buildings = [];
    player.harbors = [];

    player.cityWallNum = 0;
    player.maxSafeCardNum = 7;
    player.game = null;


    /**
     *
     * @param points may be negative or positive, int
     */
    player.updateVP = function(points){
        this.VP += points;
        this.game.checkPlayerVP(this);
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