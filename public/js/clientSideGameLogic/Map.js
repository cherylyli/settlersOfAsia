/**
 * Created by emol on 2/26/17.
 */


let Map = {};

Map.addHelperFunctions = function (map) {

    /**
     *
     * @param vertex {int}
     * @return {Building|Knight}
     */
    map.getVertexInfo = function(vertex){
        return map.vertexInfo[vertex];
    };


    /**
     *
     * @param edge {edge}
     * @return {Building}
     */
    map.getEdgeInfo = function (edge) {
        return map.edgeInfo[edgeKey(edge)];
    };



    /**
     *
     * @param hexTileId int
     * @returns {*} hexTile
     */
    map.getHexTileById = function(hexTileId){
        if (hexTileId <=0 || hexTileId > map.hexTileNum) throw "Invalid hexTileID";
        return map.hexTiles[hexTileId - 1];
    };

    /**
     *
     * @param vertex vertex number
     * @returns {*|number}
     */
    map.getHexTileByVertex = function(vertex){
        if (vertex < 1 || vertex >= 250 || !map.verticesToHex[vertex]) throw "Invalid vertex";
        return map.verticesToHex[vertex];
    };


    map.getHexTileByEdge = function(edge){
        let t1 = map.getHexTileByVertex(edge[0]);
        let t2 = map.getHexTileByVertex(edge[1]);

        //find common tiles commonV
        let commonT = [];
        for (let ta  = 0; ta < t1.length; ta++){
            for (let tb = 0; tb< t2.length; tb++){
                if (t1[ta][0] == t2[tb][0]) commonT.push(t1[ta][0]);
            }
        }

        let result = [];
        for (let t of commonT){
            let tile = map.hexTiles[t - 1];
            result.push([t, tile.getEdgePositionInHex(edge)]);
        }
        if (!result) throw "Invalid edge";
        return result;
    };

    /**
     * @return a list of hexTiles (not id, hexTile objec)
     * @param numToken int
     */
    map.getHexTileByNumToken = function(map, numToken){
        return map.numTokenToHexTiles[numToken];
    };

    return map;
};




//edge is just a array of two vertices (integer), the smaller integer is the first one
Map.edge= function(v1, v2) {
    //check here if valid edge
    if (v1 < v2) return [v1, v2];
    return [v2, v1];
}

/**
 * convert edge to edge key used in map.edgeInfo
 * @param edge {edge}
 * @return {string}
 */
function edgeKey(edge) {
    return edge[0] + '-' + edge[1];
}