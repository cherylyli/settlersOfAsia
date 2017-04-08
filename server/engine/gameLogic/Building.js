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
let Harbor =  require('./Harbor.js');

/**
 * Building class is responsible for all building related task (vertex unit: settlement, city; edge unit: road, ship)
 * settlement: level 1 building
 * city: level 2 building
 */

let Building = {} = module.exports;

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
    building.vertexUnitType = "building";
    //building.hasMetropolis = false;
    updateInfo(map, building);
    player['longestRoad'] = Player.calculateLongestRoad(player, map);

    return building;

};




Building.upgradeToCity = function (building) {
    building.level = Enum.Building.City;
    building.cityWall = false;
    Player.updateVP(building.owner, VP.upgradeTocity);
    building.owner.settlementCnt--;    //because one of the settlement is upgraded to city
};

Building.buildCityWall = function (building) {
    /**
     if (building.level != 2) throw  "You can only build city wall on city";
     if (building.cityWall) throw "You may only build one city wall under each city";
     if (building.owner.cityWallNum == 3) throw "You can build at most 3 city walls";
     **/
    building.owner.cityWallNum++;
    building.owner.maxSafeCardNum += 2;
    building.cityWall = true;
};

Building.removeCityWall = function (building) {
    building.owner.cityWallNum--;
    building.owner.maxSafeCardNum -= 2;
    building.cityWall = false;
};

/**
 *
 * @param metropolisType {String} check Enum.Building
 */
Building.upgradeToMetropolis = function(building, metropolisType){
    building.level = metropolisType;
    Player.updateVP(building.owner, VP.metropolis);
};

Building.removeMetropolis = function(building){
    building.level = Enum.Building.City;
    Player.updateVP(building.owner, -VP.metropolis);
};
//pillage a city, pre: building is a city
Building.pillage = function (building) {
    if (building.cityWall) Building.removeCityWall(building);
    else {
        //city becomes a settlement
        building.level = Enum.Building.Settlement;
        Player.updateVP(building.owner, -VP.upgradeTocity);
        //TODO: if it is the last city, what will happen to city improvement??
    }
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
    if(Map.getHexTileByEdge(match.map, edge)){
        let hextile = Map.getHexTileByEdge(match.map, edge);
        let blockedByPirate = false;
        for(let i of hextile){
          let hexTile = Map.getHexTileById(match.map, i[0]);
          if(hexTile.blockedByPirate == true){
              blockedByPirate = true;
          }
        }
        if(blockedByPirate == false){
          //console.log("blocked" + blockedByPirate);
          Map.setEdgeInfo(match.map, road, edge);
          //update player info
          player[type + 's'][Map.edgeKey(edge)] = edge;
          player['longestRoad'] = Player.calculateLongestRoad(player, match.map);
          
        //   console.log(player.getEmptyAdjacentVertices(26, match));
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


          // TO TEST IN SERVER SIDE
          /**
          let blockedByPirate = false;
          for (let hexTileInfo of info){
              let hexTile = match.map.getHexTileById(hexTileInfo[0]);
              if (hexTile.blockedByPirate) blockedByPirate = true;
          }**/

          // FIXME: Cheryl, there is a bug, so I comment it out for now :p
          // this.owner.calculateLongestRoad();


        road.builtTurnNum = match.turnNum;



    }
    //-----------------------------------------------------
}

/**
 *
 * @param oldPosition {Edge}
 * @param newPostion  {Edge}
 * @param map {Map}
 */

//can't build new ships along the pirate hex
//cannot move a ship along the pirate hex
Building.move = function (ship, oldPosition, newPosition, match) {
    var info = Map.getHexTileByEdge(match.map, newPosition);
    Map.setEdgeInfo(match.map, undefined, oldPosition);
    Map.setEdgeInfo(match.map, ship, newPosition);
    delete ship.owner[ship.type + 's'][Map.edgeKey(oldPosition)];
    ship.owner[ship.type + 's'][Map.edgeKey(newPosition)] = newPosition;


};

/**
 * TODO: implement this
 * @return {Array<edge>}
 */
Building.getAvailbleEdgesToMoveTo = function (ship) {
    return [];
};

Building.getPositionToPlaceAnShip = function (ship) {
    return [];
};



/**
 * TODO: improvement: make updateInfo universal for vertex unit and edge unit
 * private helper method for vertex unit
 * @param map {Map}
 * @param building {Building}
 */
function updateInfo(map, building) {
    //update hexTile info
    Map.setVertexInfo(map, building, building.position);
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
    Player.updateVP(building.owner, VP.buildSettlement);
    building.owner.settlementCnt++;


    //check if the the vertex can acquire unoccupied harbor
    for (let edgeKey in map.harbors) {
        if (map.harbors.hasOwnProperty(edgeKey)) {
            let harbor = map.harbors[edgeKey];
            if (((harbor.position[0] == building.position) || (harbor.position[1] == building.position)) && !harbor.owner) {
                Harbor.acquireBy(harbor, building.owner);
            }
        }
    }

    // check for fish tile

}
