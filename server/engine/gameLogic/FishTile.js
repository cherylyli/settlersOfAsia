/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let _ = require('underscore');
let Enum = require('./Enum.js');
let Map = require('./Map.js');
let FishTile = module.exports = {};

/**
 *
 * @param position an array of 3 integers
 * @param productionNums
 * @param visible
 * @return {{}}
 */
FishTile.createFishTile = function (id, position, productionNums = '1', visible = true) {
    let fishTile = {};
    fishTile.id = id;
    fishTile.type = 'FishTile';
    fishTile.productionNum = productionNums;
    fishTile.vertices = {'1': position[0], '2': position[1], '3': position[2]};

    return fishTile;
};


FishTile.getVertices = function (fishTile) {
    return fishTile.vertices;
};

/**
 *
 * @return {int} vertex
 */
FishTile.getMiddleVertex = function (fishTile) {
    return fishTile.vertices['2'];
};


/**
 * @param map {Map}
 * @param players List<Player>
 * add resources to all players that has a building on its vertices
 */
FishTile.produceResource = function (fishTile, match) {
    for (let vertex in fishTile.vertices) {
        if (fishTile.vertices.hasOwnProperty(vertex)){
            //there is a builidng on the vertex
            let building = Map.getVertexInfo(match.map, fishTile.vertices[vertex]);

            if (building) {
                let player = building.owner;
                FishTile.produceResourceToSingleUser(fishTile, match, player, building);
            }
        }
    }
};

FishTile.produceResourceToSingleUser = function (fishTile, match, player) {
    var boot = 0;
    var token;
    for (var p in match.players) {
        if (match.players[p].hasBoot == true) {
            boot = 1;
        }
    }

    if (boot) { //boot has been distributed previously
        token = Player.drawRandomFishNoBoot(player);
    }
    else {
        token = Player.drawRandomFish(player);
    }
    return token;
};

/**
 * Created by emol on 3/20/17.
 */
