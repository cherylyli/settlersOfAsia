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
        'owner': null,
        'active': false,
        'hasMovedThisTurn': false,
        'level': 1,
        'hasBeenPromotedThisTurn': false,
        'position': -1,           //vertex index, -1 if not on board
    };
    knight.owner = player;


    knight.placeKnight = function (vertex, map) {
        knight.position = vertex;
        map.setVertexInfo(knight, vertex);
    }



    return knight;
}