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
        'vertexUnitType': 'knight',
        'id': player.knights.length,
        'owner': null,
        'active': false,
        'activatedInRound' : null,
        'hasMovedThisTurn': false,
        'level': 1,
        'hasBeenPromotedThisTurn': false,
        'position': -1,           //vertex index, -1 if not on board
        'possibleSpots': null
    };
    knight.owner = player;
    player.knights.push(knight);







    return knight;
};


Knight.place = function (knight, vertex, map) {
    knight.position = vertex;
    Map.setVertexInfo(map, knight, vertex);
    knight.owner['longestRoad'] = Player.calculateLongestRoad(knight.owner, map);
    knight.possibleSpots = Player.getEmptyAdjacentVertices(knight, vertex, map);
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
    let result = null;

    if (!knight.owner.displacedKnight){
        knight.hasMovedThisTurn = true;
        knight.active = false;
        let opponentKnight = Map.getVertexInfo(map, vertex);

        if (opponentKnight&& opponentKnight.vertexUnitType == "knight") {
            opponentKnight.owner.displacedKnight = opponentKnight;
            Knight.place(opponentKnight, 0, map);
            result = {victim: opponentKnight.owner.name, player: knight.owner.name, displacedKnight: opponentKnight};
        }
    }

    // if we are being chased
    else{
        knight.owner.displacedKnight = null;
    }

    Map.setVertexInfo(map, null, knight.position);
    Knight.place(knight, vertex, map);

    return result;

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
