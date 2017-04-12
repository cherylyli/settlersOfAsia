let HexTile = require('./HexTile.js');
let Dice = module.exports = {};
const eventDie = Object.freeze({"BlueCityGate":"BlueCityGate", "GreenCityGate":"GreenCityGate", "YellowCityGate":"YellowCityGate", "Ship":"Ship" });
let Barbarian = require('./Barbarian.js');
let Commands = require('../Commands.js');
let Match = require('./Match.js');
let Player = require('./Player.js');
let Map = require('./Map.js');
let Bank = require('./Bank.js');


Dice.createDice = function () {
    let dice = {};

    dice.eventDie = "BlueCityGate";
    dice.yellowDie = 6;
    dice.redDie = 6;
    dice.productionDiceSet = false;
    dice.eventDieResult = null;
    dice.numberDiceResult = 0;
    dice.moveThiefResultConfiged = false;


    return dice;
};


Dice.rollEventDice = function (dice) {

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

Dice.rollProductionDice = function (dice){
    if (dice.productionDiceSet) return;
    let random = Math.floor(Math.random() * 6 + 1);
    dice.yellowDie = random;
    random = Math.floor(Math.random() * 6 + 1);
    dice.redDie = random;
};

Dice.setProductionDice = function(dice, yellowDie, redDie){
    dice.yellowDie = yellowDie;
    dice.redDie = redDie;
    dice.productionDiceSet = true;
};




Dice.configureResult = function (dice, match) {
    //TODO: event die
    /*TODO: add Enum for eventDie result
     1.robber & pirate. if (productionNum == 7) player should choose between move robber/ move pirate
     2.barbarian. if ship event - barbarian move 1 step. if barbarian.toAttack() -> attack catan
     */
    let event = dice.eventDie;
    let result = {};
    let player = Match.getPlayer(match, match.currentPlayer);

    //number dice produce resource
    let productionNum = dice.yellowDie + dice.redDie;
    dice.numberDiceResult = null;
    //let productionNum = dice.yellowDie + dice.redDie;
    if(productionNum == 7){
        dice.numberDiceResult = productionNum;
        result.event = "Choose Between Robber Pirate";
    }
    match.barbarianResult = null;
    switch (event){
        case "Ship" :
            if(match.barbarian){
                //  if(match.barbarian.toAttack()){
                if(match.barbarian.curPos === 2){ //for testing
          //      if(match.barbarian.curPos == 6){
                    result.event = "Barbarian Attack";
                    match.barbarianResult = Barbarian.applyResult(match.barbarian, match.players);
                    Barbarian.restart(match.barbarian);
                    //match.barbarian.curPos = 0;
                }
                else{
                    match.barbairanResult = null;
                    Barbarian.canMove(match.barbarian, event);
                    result.event = "Barbarian Move";
                }
            }
            else{
                match.barbarian = Barbarian.createBarbarian();
            }

            //active barbarian
            break;

    }

    dice.eventDieResult = result;




    // configure number dice result
    if(match.map && ((dice.yellowDie + dice.redDie) != 7)){
        Bank.allocateResources(match.bank, dice.yellowDie, dice.redDie);

    }

};
