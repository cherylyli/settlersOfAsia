/**
 * Created by emol on 2/17/17.
 */
/**
 * Created by emol on 1/4/17.
 */
let Map = require('./Map.js');
let HexTile = require('./HexTile.js');
let Player = require('./Player.js');
let VP = require('./VP.js');


/**
 * Building class is responsible for all building related task (vertex unit: settlement, city; edge unit: road, ship)
 * settlement: level 1 building
 * city: level 2 building
 */

let Building = module.exports = {};

/**
 *
 * @param player {Player}
 * @param vertex {int}
 * @param map {Map}
 */
Building.buildSettlement = function (player, vertex, map) {
    let building = {};
    building.owner = player;
    building.position = vertex;
    building.level = 1; //level 1 for settlement, 2 for city
    updateInfo(map, building);

    building.upgradeToCity = function(){
        if (building.level != 1) throw "You can only upgrade a settlement to city";
        building.level = 2;

        building.cityWall = false;
        building.owner.updateVP(VP.upgradeTocity);
    }

    building.buildCityWall = function(){
        if (building.level != 2) throw  "You can only build city wall on city";
        if (building.cityWall) throw "You may only build one city wall under each city";
        if (building.owner.cityWallNum == 3) throw "You can build at most 3 city walls";
        building.owner.cityWallNum ++;
        building.owner.maxSafeCardNum += 2;
        building.cityWall = true;
    }

    building.removeCityWall = function(){
        building.owner.cityWallNum --;
        building.owner.maxSafeCardNum -= 2;
        building.cityWall = false;
    }

    //pillage a city, pre: building is a city
    building.pillage = function () {
        if(building.cityWall) building.removeCityWall();
        else {
            //city becomes a settlement
            building.level = 1;
            building.owner.updateVP(-VP.upgradeTocity)
            //TODO: if it is the last city, what will happen to city improvement??
        }
    }

    return building;

}



/**
 *  build road or ship
 * @param player {Player}
 * @param edge {Edge}
 * @param map {Map}
 * @param type {String} road/ ship
 */
Building.buildRoad = function (player, edge, map, type) {
    //-----------------improvement needed-----------------
    let road = {'owner': player, 'type': type};
    //update map info
    map.setEdgeInfo(road, edge);
   /**
    let neighborHexTiles = map.getHexTileByEdge(edge);
    for (let i = 0; i<neighborHexTiles.length; i++){
        let [hexTileId, positionInHex] = neighborHexTiles[i];
        let hexTile = map.getHexTileById(hexTileId);
        if (hexTile.edgeInfo[positionInHex]) throw "You can only build road on empty road";
        hexTile.edgeInfo[positionInHex] = road;
    }**/

    //update player info
    player[ type + 's'].push(edge);
    player.calculateLongestRoad();

    if (type == 'ship'){

        /**
         *
         * @param oldPosition {Edge}
         * @param newPostion  {Edge}
         */
        road.move = function(oldPosition, newPostion){
            map.setEdgeInfo(undefined, oldPosition);
            map.setEdgeInfo(this, newPostion);
            this.owner.calculateLongestRoad();
        }
    }
    //-----------------------------------------------------
}



/**
 * TODO: improvement: make updateInfo universal for vertex unit and edge unit
 * private helper method for vertex unit
 * @param map {Map}
 * @param building {Building}
 */
function updateInfo(map, building){
    //update hexTile info
    map.setVertexInfo(building, building.position);
    /**
    let neighborHexTiles = map.getHexTileByVertex(building.position);
    for (let i = 0; i<neighborHexTiles.length; i++){
        let [hexTileId, positionInHex] = neighborHexTiles[i];
        let hexTile = map.getHexTileById(hexTileId);
        if (hexTile.verticesInfo[positionInHex]) throw "You can only build settlement/city on empty vertex";
        hexTile.verticesInfo[positionInHex] = building;
    }**/

    //update player info
    building.owner.buildings[building.position] = building;
    building.owner.updateVP(VP.buildSettlement);
}
