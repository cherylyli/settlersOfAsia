let HexTile = require('./HexTile.js');
let Dice = module.exports = {};
const eventDie = Object.freeze({"BlueCityGate":"BlueCityGate", "GreenCityGate":"GreenCityGate", "YellowCityGate":"YellowCityGate", "Ship":"Ship" });
let Barbarian = require('./Barbarian.js');

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

    dice.configureResult = function (match) {
        //TODO: event die
        /*TODO: add Enum for eventDie result
          1.robber & pirate. if (productionNum == 7) player should choose between move robber/ move pirate
          2.barbarian. if ship event - barbarian move 1 step. if barbarian.toAttack() -> attack catan
        */
        let event = dice.eventDie;
        let result = {};
        //number dice produce resource
        let productionNum = dice.yellowDie + dice.redDie;
        if(productionNum == 7){
          result.event = "Choose Between Robber Pirate";
        }
        // switch("Ship"){
        switch (event){
          case "Ship" :
            if(match.barbarian){
              if(match.barbarian.toAttack()){
                result.event = "Barbarian Attack";
                match.barbarian.getAttackResult(match.players);
                //player is undefined : console.log(match.players);
                match.barbarian.result = match.barbarian.applyResult(match.players);
                result.barbarianResult = match.barbarian.result;
                //console.log(match.barbarian.curPos);
                match.barbarian.restart();
              }
              else{
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
            break;
          case "YellowCityGate" :
            break;
          case "GreenCityGate" :
            break;
          default:
            console.log("Error");
        }

        if(match.map){
          let hexTileIDs = match.map.getHexTileByNumToken(productionNum);
          for (let id of hexTileIDs){
            if(!match.map.getHexTileById(id).blockedByRobber){
                match.map.getHexTileById(id).produceResource(match);
            }
          }
        }
        return result;
    };

    return dice;
};
