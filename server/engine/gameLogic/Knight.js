/**
 * Created by emol on 2/19/17.
 */
let Map = require('./Map.js');
let Knight = {} = module.exports;
let Player = require('./Player.js');

/**
 *
 * @param player {Player}
 */
Knight.createKnight = function (player, map) {

    let knight = {
        'id': player.knights.length,
        'owner': null,
        'active': false,
        'activatedInRound' : null,
        'hasMovedThisTurn': false,
        'level': 1,
        'hasBeenPromotedThisTurn': false,
        'position': -1,           //vertex index, -1 if not on board
    };
    knight.owner = player;
    player.knights.push(knight);







    return knight;
};


Knight.place = function (knight, vertex, map) {
    knight.position = vertex;
    Map.setVertexInfo(map, knight, vertex);
    knight.owner['longestRoad'] = Player.calculateLongestRoad(knight.owner, map);
};

Knight.activate = function (knight, match) {
    knight.activatedInRound = match.turnNum;
    knight.active = true;
};

Knight.deactivate = function (knight){
    knight.active = false;
};

Knight.promote = function (knight) {
    knight.hasBeenPromotedThisTurn = true;
    knight.level ++;
};

Knight.move = function (knight, vertex, map) {
    knight.hasMovedThisTurn = true;
    knight.active = false;
    let opponentKnight = Map.getVertexInfo(map, vertex);
    Map.setVertexInfo(map, undefined, knight.position);
    Knight.place(knight, vertex, map);
    knight.owner['longestRoad'] = Player.calculateLongestRoad(knight.owner, map);

    if (opponentKnight) {
        map.opponentKnight = opponentKnight.owner;
        return {owner: opponentKnight.owner.name, knightID: opponentKnight.id};
    }
};

/**
 *
 * @param map {Map}
 * @param thiefPosition {int}
 * @param newPosition {int}
 */
Knight.chaseAwayThief = function (knight, match) {
    knight.active = false;
    // if(map.piratePositon == thiefPosition) map.piratePositon = newPosition;
    // else map.robborPositon = newPosition
    match.knightInAction = knight;
};
/**
Knight.getVertexUnitType = function(knight){
    return "knight";
};**/



Knight.hireKnight = function(player, map, position = null){
    let knight = Knight.createKnight(player, map);
    if (position) Knight.place(knight, position, map);
};
