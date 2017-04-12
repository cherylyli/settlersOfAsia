/**
 * Created by emol on 1/10/17.
 */

/**
 * Created by emol on 1/10/17.
 */
let Enum = require('./Enum.js');
//import {ProgressCardDeck} from './ProgressCard.js';
//import {Dice} from './Dice.js';
let Map = require('./Map.js');
let Scenario = require('./Scenario.js');
//import {Map} from './OldMap.js';
//import {Bank} from './Bank.js';

let Match = {} =  module.exports;
let DATA = require('../Data.js');
let Dice = require('./Dice.js');
let Bank = require('./Bank.js');
let Player = require('./Player.js');
let Building = require('./Building.js');
let notify  = require('../../api/notify.js');
let Barbarian = require('./Barbarian.js');
let CircularJSON = require('circular-json');
let Knight = require('./Knight.js');
let _ = require('underscore');


// users is a list of String, names of the user in the room
/**
 *
 * @param scenario {String}
 * @param players {Player[]}
 */
Match.createNewMatch = function (scenario, players, id) {
    let match = {};

    match.id = id;

    // suppose it's a 3 people game, 3 is test data!!
    match.scenario = Scenario.loadScenario(3, scenario);
    match.players = players;
    match.playersToTakeTurn = [];   //array of string, values are player name
    match.currentPlayer = null; //String
    match.map = match.scenario.setUpMap(match.scenario.data);
    match.dice = Dice.createDice();
    match.diceRolled = false;
    match.shipMoved = false;
    match.bank = Bank.createBank(match);
    match.longestRoad = 0;
    match.phase = null;
    match.turnNum = 0;
    match.barbarian = Barbarian.createBarbarian();
    match.barbarianResult = null;
    match.Metropolis = {[Enum.cityImprovementCategory.Politics]: null, [Enum.cityImprovementCategory.Trade] : null, [Enum.cityImprovementCategory.Science] : null}; //value: building object  {Building}
    //match.redistributeM = {[Enum.cityImprovementCategory.Politics]: null, [Enum.cityImprovementCategory.Trade] : null, [Enum.cityImprovementCategory.Science] : null}; //value: building object  {Building}
    match.currentTrade = null;
    match.discardList = {};
    match.fish = null;
    match.knightInAction = null;
    assignColors(match);



    Match.nextPlayerToTakeTurn(match);


    return match;

    //match.
};


Match.rollDice = function (match) {
    Dice.rollEventDice(match.dice);
    Dice.rollProductionDice(match.dice);
    Dice.configureResult(match.dice, match);
    match.diceRolled = true;
};

Match.getPlayer = function (match, UserName) {
    return match.players[UserName];
};

Match.hasToDiscardCards = function(match, players){
    // if players has more than 7 cards, discard half (round down)
    for(var player in players){
        //console.log("name" + players[player].name );
        //console.log("discard cards num " + players[player].discardedCardsCnt());
        match.discardList[players[player].name] = Player.discardedCardsCnt(players[player]);
    }
    //console.log(discardCards);
    return match.discardList;
};

Match.checkPlayerVP = function(match, player){
    if (player.VP >= player.winningVP) {
        match.winner = player.name;
        Match.endGame(match);
    }
};

/**
 * First player who enters level 4 can get a metropolis -> later this metropolis will pass to the player who has highest improvement level
 * @param cityImprovementCategory {Enum.cityImprovementCategory}
 * @param {Player} now we give the metropolis to this guy
 * @return playerName {String} player who gets the metropolis of the cityImprovementCategory
 */
Match.distributeMetropolis = function(match, cityImprovementCategory, player, city){
    let oldCity = match.Metropolis[cityImprovementCategory];    // city of the guy who used to have this metropolis
    if (oldCity){
        // if there really exist this guy
        let theOldGuy = oldCity.owner;

        // ooops sorry now the metropolis is ours
        Building.removeMetropolis(oldCity);
    }

    match.Metropolis[cityImprovementCategory] = city;
    Building.upgradeToMetropolis(city, cityImprovementCategory);
    /**
     var improvementLevel = {};
     let players = match.players;
     var access = 0;
     for(var player in players){
        //console.log(players[player].cityImprovement[cityImprovementCategory]);
        if(players[player].cityImprovement[cityImprovementCategory] >= 4){
          improvementLevel[players[player].name] = players[player].cityImprovement[cityImprovementCategory];
          access = 1;
        }
      }
     if(!access){
        return;
      }
     //console.log("imrovementL" + improvementLevel);
     var maxKey = _.max(Object.keys(improvementLevel), function(player){
        return improvementLevel[player];
      });

     match.Metropolis[cityImprovementCategory] = maxKey;
     //console.log("max key is " + maxKey);
     var player = match.getPlayer(maxKey);
     //  player.hasMetropolis = true;
     return maxKey;**/
};

Match.endGame = function(match){
    match.phase = Enum.MatchPhase.Completed;
    notify.room(match.id, "GAME_ENDS", CircularJSON.stringify(DATA.getRoom(match.id)));
};

/**
 *
 * @return {String} the name of the player to take turn
 */
Match.nextPlayerToTakeTurn = function (match) {
  //  match.phase = Enum.MatchPhase.TurnPhase; //testing checkers.
    if (match.playersToTakeTurn.length == 0){
        //all players have token turn, start from the first player again
        match.playersToTakeTurn = Object.keys(match.players);
        match.turnNum ++;

        switch (match.phase){
            case null:
                match.phase = Enum.MatchPhase.SetupRoundOne;
                DATA.getRoom(match.id).state = Enum.MatchPhase.SetupRoundOne;
                break;
            case Enum.MatchPhase.SetupRoundOne:
                match.phase = Enum.MatchPhase.SetupRoundTwo;
                DATA.getRoom(match.id).state = Enum.MatchPhase.SetupRoundTwo;
                break;
            case Enum.MatchPhase.SetupRoundTwo:
                match.phase = Enum.MatchPhase.TurnPhase;
                DATA.getRoom(match.id).state = Enum.MatchPhase.TurnPhase;
        }

    }

    if (match.phase == Enum.MatchPhase.SetupRoundTwo){
        match.currentPlayer = match.playersToTakeTurn.pop();
    }
    else {
        match.currentPlayer = match.playersToTakeTurn.shift();
        //in set up phase, player doesn't need to roll dice

        //turn phase
        //initialize dice
        if (match.phase == Enum.MatchPhase.TurnPhase){
            match.diceRolled = false;
            match.dice.productionDiceSet = false;
            match.shipMoved = false;
            match.dice.moveThiefResultConfiged = false;

            // reset knight
            Knight.resetInNewTurn(match);

        }
    }

    if (match.barbarian.curPos == 7){
        Barbarian.restart(match.barbarian);
    }

    return match.currentPlayer;
    //notify the player to take turn

};



Match.endThisTurn = function (match) {
    if (match.phase == Enum.MatchPhase.SetupRoundTwo){
        //collect 1 resource per hexTile aournd city
        let city = Player.getCities(match.players[match.currentPlayer])[0];
        let hexTile = Map.getHexTileByVertex(match.map, city.position);

    }
};

function assignColors(match) {
    let colors = _.values(Enum.Color);
    let players = _.values(match.players);
    for (let i = 0; i < players.length; i++){
        /**
         *
         * @param UserName {String}
         * @return {Player|*}
         */
        players[i].color = colors[i];
    }
}
