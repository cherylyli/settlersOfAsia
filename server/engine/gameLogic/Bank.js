/**
 * Created by emol on 2/17/17.
 */

let Enums = require('./Enum.js');
let Hextile = require('./HexTile.js');
let Map = require('./Map.js');
let Player = require('./Player.js');
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
    }

    return bank;

}

