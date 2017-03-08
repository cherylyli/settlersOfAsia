/**
 * Created by emol on 2/17/17.
 */

let Enums = require('./Enum.js');
let Hextile = require('./HexTile.js');
let Map = require('./Map.js');
let Player = require('./Player.js');
let Trade = require('./Trade.js');
let Cost = require('./Cost.js'); //TODO: move all costs to bank

let Bank = module.exports = {};

Bank.createBank = function (match) {
    let bank = {};
    bank.match = match;
    //later move progress cards details to bank, delete progresscardDeck class


    /**
     *
     * @param yellowDie
     * @param redDie
     */
    bank.allocateResources = function(yellowDie, redDie){
        let hexTileIDs = bank.map.getHexTileByNumToken(yellowDie + redDie);
        for (let id of hexTileIDs) {
            bank.map.getHexTileById(id).produceResource();
        }
    }


    bank.tradeWithPlayer = function (playerA, playerB, trade) {
        bank.updatePlayerAsset(playerA, null, trade.offer);
        for (let card in trade.request){
            if (trade.request.hasOwnProperty(card)){
                player.resourcesAndCommodities[card] += trade.request[card];
            }
        }

        bank.updatePlayerAsset(playerB, null, trade.request);
        for (let card in trade.offer){
            if (trade.offer.hasOwnProperty(card)){
                player.resourcesAndCommodities[card] += trade.offer[card];
            }
        }

        playerA.resourceCardNum = playerA.resourceCardTotalNum();
        playerB.resourceCardNum = playerB.resourceCardTotalNum();

    };


    /**
     *
     * @param player {Player}
     * @param src {String} resource name
     * @param tradeFor {String} resource name
     */
    bank.tradeWithBank = function (player, src, tradeFor) {
        let ratio;
        if (src == Enums.Resource.Gold) ratio = Cost.goldTradeRatio;
        else ratio = player.tradeRatio[tradeFor];

        player.resourcesAndCommodities[src] -= ratio;
        player.resourcesAndCommodities[tradeFor] += 1;

        player.resourceCardNum = player.resourceCardTotalNum();
    }

    /**
     * every player performs an action, there may be some cost associated with this action.
     * This method update player's asset.
     * @param player
     * @param costName {String} name of the cost
     * @param cost {object} a object, key: Card nume (string); value: number of the card (int), positive for deduction, negative for addition
     */
    bank.updatePlayerAsset = function (player, costName = null, cost) {
        if (!cost && costName){
            cost = Cost[costName];
        }
        for (let card in cost){
            if (cost.hasOwnProperty(card)){
                player.resourcesAndCommodities[card] -= cost[card];
            }
        }

        player.resourceCardNum = player.resourceCardTotalNum();
    };


    return bank;

}

