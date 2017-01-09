/**
 * Created by emol on 12/31/16.
 */
import {GameRoomState, Color} from './Enums.js';
import {Game} from './Game.js';
import {Player} from './Player.js';


const MIN_PLAYER_NUM = 3;
const MAX_PLAYER_NUM = 4;

export class GameRoom{
    constructor(){
        this.state = GameRoomState.Waiting;
        this.users = [];
        this.messages = [];
    }

    //precondition: game is not full
    addUser(user){
        this.users.push(user);
        if (this.users.length == MIN_PLAYER_NUM){
            this.state = GameRoomState.Ready;
        }
        if (this.users.length == MAX_PLAYER_NUM){
            this.state = GameRoomState.Full;
        }
    }


    /**
     * @precondition (gameRoom.state == ready || Full) && gameRoom.game == undefined
     * @param map
     */
    startNewGame(map){
        //each user now acquire player identity
        let players = this.users.reduce(function (playerList, user){
        //FIXME: reduce can recognize concat but not push
            return playerList.concat([user]);
        }, []);

        this.game = new Game(map, players);
    }



    //TODO: systemMessage
}