/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let _ = require('underscore');
let Enum = require('./Enum.js');
let Map = require('./Map.js');
let Player = require('./Player.js');
let HexTile = {} = module.exports;

let goldNumForSettlement = 2;
let goldNumForCity = 4;
//TODO hextile type checker - for robber & pirate

HexTile.setLakeTile = function (hexTile) {

    hexTile.productionNum = [2, 3, 11, 12];
    hexTile.type = Enum.HexType.Lake;

    return hexTile;
};




HexTile.produceResource = function (hexTile, match) {
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

HexTile.produceResourceToSingleUser = function (hexTile, match, player) {
    let boot = 0;
    let token;
    for (let p in match.players) {
        if (match.players.hasOwnProperty(p) && match.players[p].hasBoot == true) {
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

    return hexTile;
};


HexTile.getVertices = function(hexTile){
    return hexTile.vertices;
};

/**
 *
 * @param map {Map}
 * @return {object} key:hexID, value:hexTile
 */
HexTile.getNeighbors = function (hexTile, map) {
    let neighbors = {};
    for (let edgePosition in hexTile.edge){
        if (hexTile.edge.hasOwnProperty(edgePosition)){
            if (!hexTile.edge[edgePosition]){
                console.log("he");
            }
            for (let [hexID, edgeP] of Map.getHexTileByEdge(map, hexTile.edge[edgePosition])){
                neighbors[hexID] = Map.getHexTileById(map, hexID);
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
HexTile.getEdgePositionInHex = function(hexTile, edge){

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


HexTile.getEdges = function(hexTile){
    return hexTile.edge;
};

HexTile.getPlayersAroundByBuildings = function(hexTile, map){
    var stealable = [];
    //get players who have one or more settlements/cities on the vertice of that hextile.
    for (let vertex in hexTile.vertices) {
        if (hexTile.vertices.hasOwnProperty(vertex)) {
            //there is a builidng on the vertex
            let building = Map.getVertexInfo(map, hexTile.vertices[vertex]);
            if (building){
                let player = building.owner;
                console.log("building owner is " + player);
                stealable.push(player);
            }
        }
    }
    return stealable;
};

HexTile.getPlayersAroundByKnight = function(hexTile, map){
    var hasKnight = [];
    //get players who have one or more settlements/cities on the vertice of that hextile.
    for (let vertex in hexTile.vertices) {
        if (hexTile.vertices.hasOwnProperty(vertex)) {
            //there is a builidng on the vertex
            let knight = Map.getVertexInfo(map, hexTile.vertices[vertex]);
            if (knight && knight.active){
                let player = knight.owner;
                //    console.log("knight owner is " + player);
                hasKnight.push(player);
            }
        }
    }
    return hasKnight;
};


HexTile.getPlayersAroundByShips = function(hexTile, map){
    var stealable = [];
    //get players who have one or more settlements/cities on the vertice of that hextile.
    for (let e in hexTile.edge) {
        if (hexTile.edge.hasOwnProperty(e)) {
            //there is a builidng on the vertex
            let ship = Map.getEdgeInfo(map, hexTile.edge[e]);
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
HexTile.produceResource = function(hexTile, match) {
    for (let vertex in hexTile.vertices) {
        if (hexTile.vertices.hasOwnProperty(vertex)) {
            //there is a builidng on the vertex
            let building = Map.getVertexInfo(match.map, hexTile.vertices[vertex]);
            if (building){
                let player = building.owner;
                HexTile.produceResourceToSingleUser(hexTile, match, player, building);
            }
        }
    }
};

HexTile.produceResourceToSingleUser = function (hexTile, match, player, building) {
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
    player.resourceCardNum = Player.resourceCardTotalNum(player);
};

