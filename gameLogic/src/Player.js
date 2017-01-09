/**
 * Created by emol on 12/31/16.
 */
import {PlayerState} from './Enums.js';

/**
 * Player stores the game info of a user in a game.
 */
export class Player {

    /**
     * progressCardsCnt doesn't count Vp cards
     * progressCards includes VP cards
     */
    constructor () {
        this.VP = 0;
        this.resources = [];
        this.progressCards = [];
        this.progressCardsCnt = 0;
        this.buildings = [];
        this.harbors = [];

        this.cityWallNum = 0;
        this.maxSafeCardNum = 7;
        this.game = null;
    }

    /**
     *
     * @param points may be negative or positive, int
     */
    updateVP(points){
        this.VP += points;
        this.game.checkPlayerVP(this);
    }






}
