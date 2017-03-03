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

    return harbor;
};

