/**
 * Created by emol on 3/2/17.
 */
/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let HexTile = {};

let goldNumForSettlement = 2;
let goldNumForCity = 4;

HexTile.addHelperFunctions = function(hexTile) {

    hexTile.getVertices = function(){
        return hexTile.vertices;
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

    return hexTile;
};



