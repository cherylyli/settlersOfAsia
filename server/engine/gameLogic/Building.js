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
let Enum = require('./Enum.js');


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
    building.level = Enum.Building.Settlement;
    //building.hasMetropolis = false;
    updateInfo(map, building);
    player['longestRoad'] = player.calculateLongestRoad(map);

    building.upgradeToCity = function () {
        building.level = Enum.Building.City;
        building.cityWall = false;
        building.owner.updateVP(VP.upgradeTocity);
        building.owner.settlementCnt--;    //because one of the settlement is upgraded to city
    };

    building.buildCityWall = function () {
        /**
        if (building.level != 2) throw  "You can only build city wall on city";
        if (building.cityWall) throw "You may only build one city wall under each city";
        if (building.owner.cityWallNum == 3) throw "You can build at most 3 city walls";
        **/
        building.owner.cityWallNum++;
        building.owner.maxSafeCardNum += 2;
        building.cityWall = true;
    };

    building.removeCityWall = function () {
        building.owner.cityWallNum--;
        building.owner.maxSafeCardNum -= 2;
        building.cityWall = false;
    };

    /**
     *
     * @param metropolisType {String} check Enum.Building
     */
    building.upgradeToMetropolis = function(metropolisType){
        building.level = metropolisType;
    };

    building.removeMetropolis = function(){
      building.level = Enum.Building.City;
    };
    //pillage a city, pre: building is a city
    building.pillage = function () {
        if (building.cityWall) building.removeCityWall();
        else {
            //city becomes a settlement
            building.level = Enum.Building.Settlement;
            building.owner.updateVP(-VP.upgradeTocity)
            //TODO: if it is the last city, what will happen to city improvement??
        }
    };

    return building;

};


/**
 *  build road or ship
 * @param player {Player}
 * @param edge {Edge}
 * @param match {Match}
 * @param type {String} road/ ship
 */
Building.buildRoad = function (player, edge, match, type) {
    //-----------------improvement needed-----------------
    let road = {'owner': player, 'type': type};
    road.canBuild = true;
    road.canMove = true;
    //update map info
    if(match.map.getHexTileByEdge(edge)){
        let hextile = match.map.getHexTileByEdge(edge);
        let blockedByPirate = false;
        for(let i of hextile){
          let hexTile = match.map.getHexTileById(i[0]);
          if(hexTile.blockedByPirate == true){
              blockedByPirate = true;
          }
        }
        if(blockedByPirate == false){
          //console.log("blocked" + blockedByPirate);
          match.map.setEdgeInfo(road, edge);
          //update player info
          player[type + 's'][Map.edgeKey(edge)] = edge;
          player['longestRoad'] = player.calculateLongestRoad(match.map);
          
          console.log(player.getEmptyAdjacentVertices(26, match));
        }
      }


    /**
     let neighborHexTiles = map.getHexTileByEdge(edge);
     for (let i = 0; i<neighborHexTiles.length; i++){
        let [hexTileId, positionInHex] = neighborHexTiles[i];
        let hexTile = map.getHexTileById(hexTileId);
        if (hexTile.edgeInfo[positionInHex]) throw "You can only build road on empty road";
        hexTile.edgeInfo[positionInHex] = road;
    }**/



    if (type == 'ship') {

      //ship -> movable

        /**
         *
         * @param oldPosition {Edge}
         * @param newPostion  {Edge}
         * @param map {Map}
         */

        //can't build new ships along the pirate hex
        //cannot move a ship along the pirate hex
        road.move = function (oldPosition, newPosition, match) {
            var info = match.map.getHexTileByEdge(newPosition);
            match.map.setEdgeInfo(undefined, oldPosition);
            match.map.setEdgeInfo(this, newPosition);
            delete player[type + 's'][Map.edgeKey(oldPosition)];
            player[type + 's'][Map.edgeKey(newPosition)] = newPosition;

          // TO TEST IN SERVER SIDE
          /**
          let blockedByPirate = false;
          for (let hexTileInfo of info){
              let hexTile = match.map.getHexTileById(hexTileInfo[0]);
              if (hexTile.blockedByPirate) blockedByPirate = true;
          }**/

          // FIXME: Cheryl, there is a bug, so I comment it out for now :p
          // this.owner.calculateLongestRoad();
        };

        road.builtTurnNum = match.turnNum;


        /**
         * TODO: implement this
         * @return {Array<edge>}
         */
        road.getAvailbleEdgesToMoveTo = function () {
            return [];
        };

        road.getPositionToPlaceAnShip = function () {
            return [];
        };
    }
    //-----------------------------------------------------
}


/**
 * TODO: improvement: make updateInfo universal for vertex unit and edge unit
 * private helper method for vertex unit
 * @param map {Map}
 * @param building {Building}
 */
function updateInfo(map, building) {
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
    building.owner.settlementCnt++;


    //check if the the vertex can acquire unoccupied harbor
    for (let edgeKey in map.harbors) {
        if (map.harbors.hasOwnProperty(edgeKey)) {
            let harbor = map.harbors[edgeKey];
            if (((harbor.position[0] == building.position) || (harbor.position[1] == building.position)) && !harbor.owner) {
                harbor.acquireBy(building.owner);
            }
        }
    }
}
