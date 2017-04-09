let HexTile = require('./HexTile.js');
let Dice = module.exports = {};
const eventDie = Object.freeze({"BlueCityGate":"BlueCityGate", "GreenCityGate":"GreenCityGate", "YellowCityGate":"YellowCityGate", "Ship":"Ship" });
let Barbarian = require('./Barbarian.js');
let Commands = require('../Commands.js');
let Match = require('./Match.js');
let Player = require('./Player.js');
let Map = require('./Map.js');


Dice.createDice = function () {
    let dice = {};

    dice.eventDie = "BlueCityGate";
    dice.yellowDie = 6;
    dice.redDie = 6;
    dice.productionDiceSet = false;
    dice.eventDieResult = null;
    dice.numberDiceResult = 0;


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
    dice.numberDiceResult = productionNum;
    //let productionNum = dice.yellowDie + dice.redDie;
    if(dice.numberDiceResult == 7){
        result.event = "Choose Between Robber Pirate";
    }
    match.barbarianResult = null;
    switch ("YellowCityGate"){
        case "Ship" :
            if(match.barbarian){
                //  if(match.barbarian.toAttack()){
                //if(match.barbarian.curPos === 3){ //for testing
                if(match.barbarian.curPos == 6){
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
        case "BlueCityGate" :
            if(player.cityImprovement.Politics == 1 && (dice.redDie == 1 || dice.redDie == 2)){
                Player.drawOneProgressCard(player, match, "Politics");

            }
            if(player.cityImprovement.Politics == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)){
                Player.drawOneProgressCard(player, match, "Politics");

            }
            if(player.cityImprovement.Politics == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)){
                Player.drawOneProgressCard(player, match, "Politics");

            }
            if(player.cityImprovement.Politics == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)){
                Player.drawOneProgressCard(player, match, "Politics");

            }
            if(player.cityImprovement.Politics == 5){
                Player.drawOneProgressCard(player, match, "Politics");

            }

            // TODO: Max / Cheryl
            // result = blablabla
            break;
        case "YellowCityGate" :
            if(player.cityImprovement.Trade == 1 && (dice.redDie == 1 || dice.redDie == 2)){
                Player.drawOneProgressCard(player, match, "Trade");

            }
            if(player.cityImprovement.Trade == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)){
                Player.drawOneProgressCard(player, match, "Trade");

            }
            if(player.cityImprovement.Trade == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)){
                Player.drawOneProgressCard(player, match, "Trade");

            }
            if(player.cityImprovement.Trade == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)){
                Player.drawOneProgressCard(player, match, "Trade");

            }
            if(player.cityImprovement.Trade == 5){
                Player.drawOneProgressCard(player, match, "Trade");

            }

            break;
        case "GreenCityGate" :
            if(player.cityImprovement.Science == 1 && (dice.redDie == 1 || dice.redDie == 2)){
                Player.drawOneProgressCard(player, match, "Science");

            }
            if(player.cityImprovement.Science == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)){
                Player.drawOneProgressCard(player, match, "Science");

            }
            if(player.cityImprovement.Science == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)){
                Player.drawOneProgressCard(player, match, "Science");

            }
            if(player.cityImprovement.Science == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)){
                Player.drawOneProgressCard(player, match, "Science");

            }
            if(player.cityImprovement.Science == 5){
                Player.drawOneProgressCard(player, match, "Science");

            }
            break;
        default:
            console.log("Error");
    }

    dice.eventDieResult = result;




    // configure number dice result
    if(match.map){
        let hexTileIDs = Map.getHexTileByNumToken(match.map, productionNum);
        for (let id of hexTileIDs){
            if(!Map.getHexTileById(match.map, id).blockedByRobber){
                HexTile.produceResource(Map.getHexTileById(match.map, id), match);
            }
        }
    }

};
