/**
 * Created by emol on 1/3/17.
 */
import {Player} from './Player.js';
export class Harbor{
    constructor(edge, type = 'generic', ratio = 3){
        this.position = edge;
        this.owner = null;
        this.type = type;
        this.ratio = ratio;
    }

    /**
     * check if the harbor is occupied by vertex
     * @param vertex, player
     */
    isOccupiedBy(vertex, player){
        if (edge[0] == vertex || edge[1] == vertex){
            this.owner = player;
            player.harbors.push(this);
        }
    }
}