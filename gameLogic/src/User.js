/**
 * Created by emol on 12/31/16.
 */
/**
 * User stores the basic info about the user.
 * When a user starts a game, he acquires the identity of player.
 */
import {PlayerState} from './Enums.js';
import {Player} from './Player.js';

export class User {

    constructor (name) {
        this.name = name;
        this.state = PlayerState.LOBBY;
    }

    /**
     * @precondition gameRoom.state != Full
     * @param gameRoom
     */
    joinGameRoom (gameRoom) {
        gameRoom.addUser(this);
        this.gameRoom = gameRoom;
        this.state = PlayerState.GAME_ROOM;
    }


    logout (){
        this.state = PlayerState.DISCONNECTED;
    }


    /**
     * GameRoom calls this function to in startNewGame/ continueSavedGame
     * @return player
     */

    startGame(){
        this.player = new Player();
        //this.state = PlayerState.
        return this.player;
    }


}
