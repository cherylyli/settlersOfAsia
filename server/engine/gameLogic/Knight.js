/**
 * Created by emol on 2/19/17.
 */
let Map = require('./Map.js');
let Knight = module.exports = {};

/**
 *
 * @param player {Player}
 */
Knight.createKnight = function (player, map) {

    let knight = {
        'id': player.knights.length,
        'owner': null,
        'active': false,
        'hasMovedThisTurn': false,
        'level': 1,
        'hasBeenPromotedThisTurn': false,
        'position': -1,           //vertex index, -1 if not on board
    };
    knight.owner = player;
    player.knights.push(knight);



    knight.place = function (vertex, map) {
        knight.position = vertex;
        map.setVertexInfo(knight, vertex);
    }

    knight.activate = function () {
        this.active = true;
    }

    knight.promote = function () {
        this.level ++;
    }

    knight.move = function (vertex, map) {
        this.active = false;
        let opponentKnight = map.getVertexInfo(vertex);
        map.setVertexInfo(undefined, knight.position);
        knight.place(vertex, map);

        if (opponentKnight) return {owner: opponentKnight.owner.name, knightID: opponentKnight.id};
    }

    /**
     *
     * @param map {Map}
     * @param thiefPosition {int}
     * @param newPosition {int}
     */
    knight.chaseAwayThief = function (map, thiefPosition, newPosition) {
        this.active = false;
        if(map.piratePositon == thiefPosition) map.piratePositon = newPosition;
        else map.robborPositon = newPosition
    }




    return knight;
}

Knight.hireKnight = function(player, map, position = null){
    let knight = Knight.createKnight(player, map);
    if (position) knight.place(position, map);
}