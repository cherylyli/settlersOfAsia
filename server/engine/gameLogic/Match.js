/**
 * Created by emol on 1/10/17.
 */

/**
 * Created by emol on 1/10/17.
 */
let Enums = require('./Enum.js');
//import {ProgressCardDeck} from './ProgressCard.js';
//import {Dice} from './Dice.js';
let Map = require('./Map.js');
let Scenario = require('./Scenario.js');
//import {Map} from './OldMap.js';
//import {Bank} from './Bank.js';

let Match = {} =  module.exports;

// users is a list of String, names of the user in the room
Match.createNewMatch = function (scenario, players) {
    let match = {};

    // suppose it's a 3 people game, 3 is test data!!
    match.scenario = Scenario.loadScenario(3, scenario);
    match.players = players;
    match.map = match.scenario.setUpMap(match.scenario.data);


}
/**
 function initPlayers(userNames) {
    let players = {};
    return players;
}**/


/**
 export class Game{
    /**
     *
 * @param mapType should just a String, "like heading to new shore"
 * @param players
 * @param winningVP
 constructor(mapType, players, winningVP = 12){
        this.map = this.initializeMap(mapType);
        this.bank = new Bank(this.map);
        this.winningVP = winningVP;
        this.players = players;
        this.updatePlayerInfo();
        // this.progressCardDeck = new ProgressCardDeck();
        this.currentPlayer = players[0];
        this.currentPlayerIndex = 0;
        this.dice = null;
        this.diceRolled = false;
    }
 initializeMap(mapType){
        let map = new Map(37);
        map.setUpMap(1);
        //bank should have a copy of the numToken to hexTile mapping
        //this.bank.numTokenToHexTiles = map.numTokenToHexTiles;
        return map;
    }
 updatePlayerInfo(){
        for (let i = 0; i<this.players.length; i++){
            let colorKey = (Object.keys(Color))[i];
            this.players[i].color = Color[colorKey];
            this.players[i].game = this;
        }
    }
 newTurn(){
        //set up
        this.diceRolled = false;
        this.dice.productionDiceSet = false;
        this.currentPlayerIndex = (this.currentPlayerIndex+1) % this.players.length;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        //getPlayerAction (Command)

        //for next player check if he has left room
    }
 checkPlayerVP(player){
        if (player.VP >= this.winningVP) this.endGame();
    }
 endGame(){
        console.log("Game ends!");
    }
 }**/