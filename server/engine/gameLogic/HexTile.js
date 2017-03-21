/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let _ = require('underscore');
let Enum = require('./Enum.js');
let Map = require('./Map.js');
let HexTile = {} = module.exports;

let goldNumForSettlement = 2;
let goldNumForCity = 4;
//TODO hextile type checker - for robber & pirate
HexTile.createHexTile = function(id, row, posInRow, HexType = 'Sea', productionNum = undefined, visible = true) {
    let hexTile = {};
    hexTile.id = id;
    hexTile.row = row;
    hexTile.posInRow = posInRow;
    hexTile.type = HexType;
    hexTile.productionNum = productionNum;
    hexTile.visible = visible;
    hexTile.edge =  {'TopRight': null, 'Right': null, 'BottomRight': null, 'BottomLeft': null, 'Left': null, 'TopLeft': null};
    hexTile.vertices = {'Top': undefined, 'TopLeft': undefined, 'BottomLeft': undefined, 'Bottom': undefined, 'BottomRight': undefined, 'TopRight': undefined};
    hexTile.blockedByRobber = false;
    hexTile.blockedByPirate = false;
    hexTile.getVertices = function(){
        return hexTile.vertices;
    };

    /**
     *
     * @param map {Map}
     * @return {object} key:hexID, value:hexTile
     */
    hexTile.getNeighbors = function (map) {
      let neighbors = {};
      for (let edgePosition in hexTile.edge){
          if (hexTile.edge.hasOwnProperty(edgePosition)){
              if (!hexTile.edge[edgePosition]){
                  console.log("he");
              }
              for (let [hexID, edgeP] of map.getHexTileByEdge(hexTile.edge[edgePosition])){
                  neighbors[hexID] = map.getHexTileById(hexID);
              }
          }
      }

      //delete ourselves
        delete neighbors[this.id];
        return neighbors;
    };

    /**
     * find the edge position in hex
     * @param edge
     * @returns string / undefined
     */
    hexTile.getEdgePositionInHex = function(edge){

        if (_.isEqual(edge, hexTile.edge.BottomLeft)){
            return 'BottomLeft';
        }
        if (_.isEqual(edge, hexTile.edge.Left)){
            return 'Left';
        }
        if (_.isEqual(edge, hexTile.edge.TopLeft)){
            return 'TopLeft';
        }
        if (_.isEqual(edge, hexTile.edge.BottomRight)){
            return 'BottomRight';
        }
        if (_.isEqual(edge, hexTile.edge.Right)){
            return 'Right';
        }
        if (_.isEqual(edge, hexTile.edge.TopRight)){
            return 'TopRight';
        }

        return undefined;
    };


    hexTile.getEdges = function(){
        return hexTile.edge;
    };

    hexTile.getPlayersAroundByBuildings = function(map){
        var stealable = [];
        //get players who have one or more settlements/cities on the vertice of that hextile.
        for (let vertex in hexTile.vertices) {
            if (hexTile.vertices.hasOwnProperty(vertex)) {
                //there is a builidng on the vertex
                let building = map.getVertexInfo(hexTile.vertices[vertex]);
                if (building){
                    let player = building.owner;
                    console.log("building owner is " + player);
                    stealable.push(player);
                }
            }
        }
        return stealable;
      };

      hexTile.getPlayersAroundByShips = function(map){
        var stealable = [];
        //get players who have one or more settlements/cities on the vertice of that hextile.
        for (let e in hexTile.edge) {
            if (hexTile.edge.hasOwnProperty(e)) {
                //there is a builidng on the vertex
                let ship = map.getEdgeInfo(hexTile.edge[e]);
                if (ship){
                    let player = ship.owner;
                    console.log("ship owner is " + player);
                    stealable.push(player);
                }
            }
        }
        return stealable;
      };

    /**
     *
     * add resources to all players that has a building on its vertices
     */
    hexTile.produceResource = function(map) {
        for (let vertex in hexTile.vertices) {
            if (hexTile.vertices.hasOwnProperty(vertex)) {
                //there is a builidng on the vertex
                let building = map.getVertexInfo(hexTile.vertices[vertex]);
                if (building){
                    let player = building.owner;
                    hexTile.produceResourceToSingleUser(map, player, building);
                }
            }
        }
    };

    hexTile.produceResourceToSingleUser = function (map, player, building) {
        let resource = Enum.SettlementResources[this.type];
        if (resource == Enum.SettlementResources.GoldField) {
            if (building.level == Enum.Building.Settlement) {
                player.resourcesAndCommodities[Enum.SettlementResources.GoldField] += goldNumForSettlement;
            }
            else {
                player.resourcesAndCommodities[Enum.SettlementResources.GoldField] += goldNumForCity;
            }
        }
        else {
            player.resourcesAndCommodities[resource]++;
            if (building.level == Enum.Building.City) {
                resource = Enum.AdditionalCityResources[hexTile.type];
                player.resourcesAndCommodities[resource]++;
            }
        }
        player.resourceCardNum = player.resourceCardTotalNum();
    };

    return hexTile;
};
