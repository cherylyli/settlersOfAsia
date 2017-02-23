/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let _ = require('underscore');
let Enum = require('./Enum.js');
let HexTile = {} = module.exports;

HexTile.createHexTile = function(id, row, posInRow, HexType = 'Sea', productionNum = '1', visible = true) {
    let hexTile = {};
    hexTile.id = id;
    hexTile.row = row;
    hexTile.posInRow = posInRow;
    hexTile.type = HexType;
    hexTile.productionNum = productionNum;
    hexTile.visible = visible;
    hexTile.edge =  {'TopRight': null, 'Right': null, 'BottomRight': null, 'BottomLeft': null, 'Left': null, 'TopLeft': null};
    //Now map is responsible for edge info and vertex info
    //hexTile.edgeInfo =  {'TopRight': null, 'Right': null, 'BottomRight': null, 'BottomLeft': null, 'Left': null, 'TopLeft': null};
    hexTile.vertices = {'Top': undefined, 'TopLeft': undefined, 'BottomLeft': undefined, 'Bottom': undefined, 'BottomRight': undefined, 'TopRight': undefined};
    //hexTile.verticesInfo = {'Top': null, 'TopLeft': null, 'BottomLeft': null, 'Bottom': null, 'BottomRight': null, 'TopRight': null};
    hexTile.blockedByRobber = false;

    hexTile.getVertices = function(){
        return hexTile.vertices;
    }

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
    }


    hexTile.getEdges = function(){
        return hexTile.edge;
    }

    return hexTile;
}




/**
 *
 * add resources to all players that has a building on its vertices
 *//**
 function produceResource(hexTile){
    for (edge in hexTile.edgeInfo){
        if(hexTile.edgeInfo.hasOwnProperty(edge) && hexTile.edgeInfo[edge]) {
            //there is a builidng on the edge
            let building = hexTile.edgeInfo[edge];
            let player = building.owner;
            let resource = SettlementResources[hexTile.type];
            if (resource == SettlementResources.GoldField){
                if (building.level == 1){
                    let chosenResource = player.selectResource(1);
                    player.resourcesAndCommodities[chosenResource[0]] ++;
                }
                else {
                    let [resourceA, resourceB] = player.selectResource(2);
                    player.resourcesAndCommodities[resourceA] ++;
                    player.resourcesAndCommodities[resourceB] ++;
                }
            }
            else {
                player.resourcesAndCommodities[resource] ++;
                if (building == 2){
                    resource = AdditionalCityResources[hexTile.type];
                    player.resourcesAndCommodities[resource] ++;
                }
            }
        }
**/
