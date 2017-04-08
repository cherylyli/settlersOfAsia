let HexTile = require('./HexTile.js');
let Dice = module.exports = {};
const eventDie = Object.freeze({"BlueCityGate":"BlueCityGate", "GreenCityGate":"GreenCityGate", "YellowCityGate":"YellowCityGate", "Ship":"Ship" });
let Barbarian = require('./Barbarian.js');
let Commands = require('../Commands.js');

Dice.createDice = function () {
    let dice = {};

    dice.eventDie = "BlueCityGate";
    dice.yellowDie = 6;
    dice.redDie = 6;
    dice.productionDiceSet = false;
    dice.eventDieResult = null;
    dice.numberDiceResult = 0;

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




    dice.configureResult = function (match) {
        //TODO: event die
        /*TODO: add Enum for eventDie result
          1.robber & pirate. if (productionNum == 7) player should choose between move robber/ move pirate
          2.barbarian. if ship event - barbarian move 1 step. if barbarian.toAttack() -> attack catan
        */
        let event = dice.eventDie;
        let result = {};
        let player = match.getPlayer(match.currentPlayer);

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
                match.barbarianResult = match.barbarian.applyResult(match.players);
                match.barbarian.restart();
                //match.barbarian.curPos = 0;
              }
              else{
                match.barbairanResult = null;
                match.barbarian.canMove(event);
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
              player.drawOneProgressCard(match, "Politics");

            }
            if(player.cityImprovement.Politics == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)){
              player.drawOneProgressCard(match, "Politics");

            }
            if(player.cityImprovement.Politics == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)){
              player.drawOneProgressCard(match, "Politics");

            }
            if(player.cityImprovement.Politics == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)){
              player.drawOneProgressCard(match, "Politics");

            }
            if(player.cityImprovement.Politics == 5){
              player.drawOneProgressCard(match, "Politics");

            }

              // TODO: Max / Cheryl
                // result = blablabla
            break;
          case "YellowCityGate" :
            if(player.cityImprovement.Trade == 1 && (dice.redDie == 1 || dice.redDie == 2)){
              player.drawOneProgressCard(match, "Trade");

            }
            if(player.cityImprovement.Trade == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)){
              player.drawOneProgressCard(match, "Trade");

            }
            if(player.cityImprovement.Trade == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)){
              player.drawOneProgressCard(match, "Trade");

            }
            if(player.cityImprovement.Trade == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)){
              player.drawOneProgressCard(match, "Trade");

            }
            if(player.cityImprovement.Trade == 5){
              player.drawOneProgressCard(match, "Trade");

            }

            break;
          case "GreenCityGate" :
            if(player.cityImprovement.Science == 1 && (dice.redDie == 1 || dice.redDie == 2)){
              player.drawOneProgressCard(match, "Science");

            }
            if(player.cityImprovement.Science == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)){
              player.drawOneProgressCard(match, "Science");

            }
            if(player.cityImprovement.Science == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)){
              player.drawOneProgressCard(match, "Science");

            }
            if(player.cityImprovement.Science == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)){
             player.drawOneProgressCard(match, "Science");

            }
            if(player.cityImprovement.Science == 5){
              player.drawOneProgressCard(match, "Science");

            }
            break;
          default:
            console.log("Error");
        }

        dice.eventDieResult = result;




        // configure number dice result
        if(match.map){
          let hexTileIDs = match.map.getHexTileByNumToken(productionNum);
          for (let id of hexTileIDs){
            if(!match.map.getHexTileById(id).blockedByRobber){
                match.map.getHexTileById(id).produceResource(match);
            }
          }
        }

    };

    return dice;
};
