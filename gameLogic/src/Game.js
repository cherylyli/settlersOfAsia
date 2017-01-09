/**
 * Created by emol on 12/31/16.
 */
import {GameRoomState, Color} from './Enums.js';
import {ProgressCardDeck} from './ProgressCard.js';
import {Dice} from './Dice.js';
export class Game{
    constructor(map, players, winningVP = 12){
        this.map = map;
        this.winningVP = winningVP;

        this.players = players;
        this.updatePlayerInfo();

        this.progressCardDeck = new ProgressCardDeck();

        this.currentPlayer = players[0];
        this.currentPlayerIndex = 0;

        this.dice = null;
        this.diceRolled = false;
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

    }

    checkPlayerVP(player){
        if (player.VP >= this.winningVP) this.endGame();
    }

    endGame(){
        console.log("Game ends!");
    }

}