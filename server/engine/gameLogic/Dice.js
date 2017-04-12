let HexTile = require('./HexTile.js');
let Dice = module.exports = {};
const eventDie = Object.freeze({"BlueCityGate":"BlueCityGate", "GreenCityGate":"GreenCityGate", "YellowCityGate":"YellowCityGate", "Ship":"Ship" });
let Barbarian = require('./Barbarian.js');
let Commands = require('../Commands.js');
let Match = require('./Match.js');
let Player = require('./Player.js');
let Map = require('./Map.js');
let Bank = require('./Bank.js');
let _ = require("underscore");
let Enum = require("./Enum.js");


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
    // let player = Match.getPlayer(match, match.currentPlayer);

    //number dice produce resource
    let productionNum = dice.yellowDie + dice.redD0ie;
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
                // if(match.barbarian.curPos === ){ //for testing
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

    }

    dice.eventDieResult = result;




    // configure number dice result
    if(match.map && ((dice.yellowDie + dice.redDie) != 7)){
        for (let player of Object.values(match.players)){
            player.oldResourceNum = player.resourceCardNum;
        }
        Bank.allocateResources(match.bank, dice.yellowDie, dice.redDie);

    }

    for (let player of Object.values(match.players)){
        configPlayerAction(dice, player, match);
    }

};


function configPlayerAction(dice, player, match) {
    // config event dice
    if (dice.eventDie == "Ship"){
        if (match.barbarianResult && _.contains(match.barbarianResult.toPlayers, player.name)){
            assignPlayerBarbarianAction(player, match);
        }
    }

    else {
        // progress card
        configPlayerEventCityDie(dice, player);
    }

    // config number dice
    configNumberDice(dice, player, match)
}


function assignPlayerBarbarianAction(player, match) {
    if (!match.barbarian) return;
    let result = match.barbarianResult.result;
    let act = null;
    if (_.contains(match.barbarianResult.toPlayers, player.name)){
        switch (result[0]){
            case Enum.BarbarianResult.CATAN_LOSE:
                act = {cmd: "chooseCityToBePillaged", msg: "Event die result: Barbarian attacks! Catan lose, You have to choose a city to pillage."};
                break;
            case Enum.BarbarianResult.CATAN_WIN_TIE:
                act = {cmd: "drawOneProgressCard", msg: "Event die result: Barbarian attacks! Catan win tie, You can draw a progress card of chosen type."};
                break;
        }
    }
    if (act){
        player.diceConfigResult.push(act);
    }
}

function configPlayerEventCityDie(dice, player) {
    let card = null;
    switch (dice.eventDie) {
        case "BlueCityGate" :
            if (player.cityImprovement.Politics == 1 && (dice.redDie == 1 || dice.redDie == 2)) {
                card = Enum.cityImprovementCategory.Politics;

            }
            if (player.cityImprovement.Politics == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)) {
                card = (Enum.cityImprovementCategory.Politics);

            }
            if (player.cityImprovement.Politics == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)) {
                card = (Enum.cityImprovementCategory.Politics);

            }
            if (player.cityImprovement.Politics == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)) {
                card = (Enum.cityImprovementCategory.Politics);

            }
            if (player.cityImprovement.Politics == 5) {
                card = (Enum.cityImprovementCategory.Politics);

            }
            break;

        case "YellowCityGate" :
            if (player.cityImprovement.Trade == 1 && (dice.redDie == 1 || dice.redDie == 2)) {
                card = (Enum.cityImprovementCategory.Trade);

            }
            if (player.cityImprovement.Trade == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)) {
                card = (Enum.cityImprovementCategory.Trade);

            }
            if (player.cityImprovement.Trade == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)) {
                card = (Enum.cityImprovementCategory.Trade);

            }
            if (player.cityImprovement.Trade == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)) {
                card = (Enum.cityImprovementCategory.Trade);
            }
            if (player.cityImprovement.Trade == 5) {
                card = (Enum.cityImprovementCategory.Trade);

            }
            break;

        case "GreenCityGate" :
            if (player.cityImprovement.Science == 1 && (dice.redDie == 1 || dice.redDie == 2)) {
                card = (Enum.cityImprovementCategory.Science);

            }
            if (player.cityImprovement.Science == 2 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3)) {
                card = (Enum.cityImprovementCategory.Science);
            }
            if (player.cityImprovement.Science == 3 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4)) {
                card = (Enum.cityImprovementCategory.Science);
            }
            if (player.cityImprovement.Science == 4 && (dice.redDie == 1 || dice.redDie == 2 || dice.redDie == 3 || dice.redDie == 4 || dice.redDie == 5)) {
                card = (Enum.cityImprovementCategory.Science);
            }
            if (player.cityImprovement.Science == 5) {
                card = (Enum.cityImprovementCategory.Science);
            }
            break;
    }

    if (card) {
        let action = {cmd: "drawOneProgressCard", data: card, msg: "Event die result: You can draw one " + card + "progress card."};
        player.diceConfigResult.push(action);
    }
}

function configNumberDice(dice, player, match) {
    if (dice.numberDiceResult == 7){
        let num = player.resourceCardNum - player.maxSafeCardNum;
        if (num > 0) {
            let action = {cmd: "discardResourceCards", data: num, msg: "7 is rolled, you can at most hold " + player.maxSafeCardNum + " cards safely. Please discard " + num + "cards."};
            player.diceConfigResult.push(action);
        }

        if (player.name == match.currentPlayer) {
            let action = {cmd: "moveThief", msg: "You rolled 7, you can move robber or pirate."};
            player.diceConfigResult.push(action);
        }
    }


    else {
        // science level 3 benefit
        if (player.cityImprovement[Enum.cityImprovementCategory.Science] >= 3) {
            if (player.resourceCardNum == player.oldResourceNum) {
                let action = {
                    cmd: "drawOneResourceCard",
                    msg: "Benefit of Science LV3: you didn't get any resource cards this turn, draw one resource card from bank."
                };
                player.diceConfigResult.push(action);
            }
        }

    }
}


Dice.diceActionPerfomed = function (cmd, player) {
    if (cmd == "moveRobber" || cmd == "movePirate"){
        cmd = "moveThief";
    }

    for (let i = 0; i < player.diceConfigResult.length; i++) {
        if (cmd == player.diceConfigResult[i].cmd) {
            player.diceConfigResult.splice(i, 1);
            break;
        }
    }
};

