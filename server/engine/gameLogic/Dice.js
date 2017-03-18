let HexTile = require('./HexTile.js');
let Dice = module.exports = {};
const eventDie = Object.freeze({"BlueCityGate":"BlueCityGate", "GreenCityGate":"GreenCityGate", "YellowCityGate":"YellowCityGate", "Ship":"Ship" });

Dice.createDice = function () {
    let dice = {};

    dice.eventDie = "Ship";
    dice.yellowDie = 6;
    dice.redDie = 6;
    dice.productionDiceSet = false;

    dice.rollEventDice = function () {

        let random = Math.floor(Math.random() * 6 + 1);

        switch (random){
            case 1:
                dice.eventDie = eventDie.BlueCityGate;
                break;
            case 2:
                dice.eventDie = eventDie.GreenCityGate;
                break;
            case 3:
                dice.eventDie = eventDie.YellowCityGate;
                break;
            default:
                dice.eventDie = eventDie.Ship;
        }
    };

    dice.rollProductionDice = function (){
        if (dice.productionDiceSet) return;
        let random = Math.floor(Math.random() * 6 + 1);
        dice.yellowDie = random;
        random = Math.floor(Math.random() * 6 + 1);
        dice.redDie = random;
    };

    dice.setProductionDice = function(yellowDie, redDie){
        dice.yellowDie = yellowDie;
        dice.redDie = redDie;
        dice.productionDiceSet = true;
    };

    dice.configureResult = function (map) {
        //TODO: event die
        //number dice produce resource
        let productionNum = dice.yellowDie + dice.redDie;
        let hexTileIDs = map.getHexTileByNumToken(productionNum);
        for (let id of hexTileIDs){
            map.getHexTileById(id).produceResource(map);
        }
    };

    return dice;
};
