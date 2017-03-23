/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let _ = require('underscore');
let Enum = require('./Enum.js');
let Map = require('./Map.js');
let fishTile = {} = module.exports;

FishTile.createFishTile = function (id, row, posInRow, HexType = 'FishTile', productionNums = '1', visible = true) {
    let fishTile = {};
    fishTile.productionNum = productionNums;
    fishTile.vertices = {'1': null, '2': null, '3':null};
    fishTile.getVertices = function () {
        return fishTile.vertices;
    };

    /**
     *
     * @return {int} vertex
     */
    fishTile.getMiddleVertex = function () {
        return this.vertices['2'];
    };


    /**
     * @param map {Map}
     * @param players List<Player>
     * add resources to all players that has a building on its vertices
     */
    fishTile.produceResource = function (match) {
        for (let vertex in fishTile.vertices) {
            if (fishTile.vertices.hasOwnProperty(vertex)){
            //there is a builidng on the vertex
            let building = match.map.getVertexInfo(fishTile.vertices[vertex]);
            if (building) {
                let player = building.owner;
                fishTile.produceResourceToSingleUser(match, player, building);
            }
            }
        }
    };

    fishTile.produceResourceToSingleUser = function (match, player) {
        var boot = 0;
        var token;
        for (var p in match.players) {
            if (match.players[p].hasBoot == true) {
                boot = 1;
            }
        }

        if (boot) { //boot has been distributed previously
            token = player.drawRandomFishNoBoot();
        }
        else {
            token = player.drawRandomFish();
        }
        return token;
    };

    return fishTile;
};
/**
 * Created by emol on 3/20/17.
 */
