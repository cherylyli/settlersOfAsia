/**
 * Created by emol on 3/3/17.
 */
let Enum = require('./Enum.js');
let Harbor = module.exports = {};


/**
 *
 * @param position {edge}
 * @param type {Enum.HarborType}
 * @return {Harbor}
 */
Harbor.createHarbor = function (position, type) {
    let harbor = {
        'position': position,
        'type': type,
        'owner': null
    };
    if (type == Enum.HarborType.General) harbor.ratio = Enum.HarborRatio.GeneralHarbor;
    else harbor.ratio = Enum.HarborRatio.SpecialHarbor;


    /**
     *
     * @param player {Player}
     */
    harbor.acquireBy = function(player){
        this.owner = player;

        //change player trade ratio if it offers lower ratio
        if (this.type == Enum.HarborType.General){
            for (let resourceType in player.tradeRatio){
                if (player.tradeRatio[resourceType] > harbor.ratio){
                    player.tradeRatio[resourceType] = harbor.ratio;
                }
            }
        }
        else {
            if (player.tradeRatio[harbor.type] > harbor.ratio){
                player.tradeRatio[harbor.type] = harbor.ratio;
            }
        }
    };

    return harbor;
};

