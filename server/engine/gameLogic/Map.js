/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */



let Enum = require('./Enum.js');
let _ = require('underscore');
let HexTile = require('./HexTile.js');

let Map = module.exports = {};

let mapHexTypeData = {'Sea':2, 'GoldField':2, 'Desert':1, 'Field':4, 'Forest':2, 'Pasture':4, 'Mountains':1, 'Hills':0};
let mapTokenDate = {'5':3, '2':4, '9':9};
let tileIDs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

const numToken = {'2':1, '3':2, '4':3, '5':4, '6':5, '8':5, '9':4, '10':3, '11':2, '12':1};

Map.createMap = function (hexTileNum) {
    let map = {};

    map.hexTileNum = hexTileNum;
    map.hexTiles = [];
    map.vertexInfo = [];
    map.edgeInfo = {}; //key: "vertes1-vertex2", e.g. edge[12, 23] -> "12-23"

    //start from 1 (just use vertex id)
    map.verticesToHex = [250];
    //may be use edge map too
    for (let i = 0; i<250; i++){
        map.verticesToHex[i] = [];
    }

    //for number 3, numTokenToHexTiles[3]
    map.numTokenToHexTiles = [13];
    for (let i = 0; i< 13; i++){
        map.numTokenToHexTiles[i] = [];
    }


    map.row = (hexTileNum == 37)? [4, 5, 6, 7, 6, 5, 4] : (hexTileNum == 44)? [4, 5, 6, 7, 7, 6, 5, 4] : [4, 5, 6, 7, 7, 7, 6, 5, 4];


    generateHexTiles(map);
    setHexTileVertices(map);
    setHexTileEdges(map);


    /**
     *
     * @param vertex {int}
     * @return {Building|Knight}
     */
    map.getVertexInfo = function(vertex){
        return map.vertexInfo[vertex];
    }


    /**
     *
     * @param edge {edge}
     * @return {Building}
     */
    map.getEdgeInfo = function (edge) {
        return map.edgeInfo[edgeKey(edge)];
    }


    /**
     *
     * @param vertexUnit {Building|Knight}
     * @param vertex {int}
     */
    map.setVertexInfo = function (vertexUnit, vertex) {
        map.vertexInfo[vertex] = vertexUnit;
    }


    /**
     *
     * @param edgeUnit {Building}
     * @param edge {edge}
     */
    map.setEdgeInfo = function (edgeUnit, edge) {
        map.edgeInfo[edgeKey(edge)] = edgeUnit;
    }

    /**
     *
     * @param hexTileId int
     * @returns {*} hexTile
     */
    map.getHexTileById = function(hexTileId){
        if (hexTileId <=0 || hexTileId > map.hexTileNum) throw "Invalid hexTileID";
        return map.hexTiles[hexTileId - 1];
    }

    /**
     *
     * @param vertex vertex number
     * @returns {*|number}
     */
    map.getHexTileByVertex = function(vertex){
        if (vertex < 1 || vertex >= 250 || !map.verticesToHex[vertex]) throw "Invalid vertex";
        return map.verticesToHex[vertex];
    }


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
    }

    /**
     * @return a list of hexTiles (not id, hexTile objec)
     * @param numToken int
     */
    map.getHexTileByNumToken = function(map, numToken){
        return map.numTokenToHexTiles[numToken];
    }




    return map;
};



function generateHexTiles(map){
    let id = 1;
    for (let rowIndex = 1; rowIndex <= map.row.length; rowIndex++){
        let rowTileCnt = map.row[rowIndex - 1];
        for (let posInRow = 1; posInRow <= rowTileCnt; posInRow++){
            map.hexTiles.push(HexTile.createHexTile(id, rowIndex, posInRow));
            id ++;
        }
    }
}

function setHexTileVertices(map){
    //set the top 3 vertices
    //set first row
    let id = 1;

    for (let posInRow = 1; posInRow <= map.row[0]; posInRow++){
        let hexTile = map.hexTiles[id - 1];

        hexTile.vertices.TopLeft = (id - 1)*2 + 1;
        hexTile.vertices.Top = hexTile.vertices.TopLeft + 1;
        hexTile.vertices.TopRight = hexTile.vertices.Top + 1;
        id ++;
    }

    for (let row = 2; row <= map.row.length; row++){
        //set first tile of the row
        let preHexTile = map.hexTiles[id - 2];
        let hexTile = map.hexTiles[id - 1];
        let pPreRowLen = row > 2 ? map.row[row - 3] : -1;
        let preRowLen = map.row[row - 2];
        let rowLen = map.row[row -1];
        if (row == 6){
            let a = 23;
        }


        if(pPreRowLen >= preRowLen && preRowLen > rowLen){
            hexTile.vertices.TopLeft = preHexTile.vertices.TopRight + 3;
        }

        else {
            if(preRowLen > rowLen || (pPreRowLen == preRowLen && rowLen == preRowLen)){
                hexTile.vertices.TopLeft = preHexTile.vertices.TopRight + 2;
            }
            else {
                hexTile.vertices.TopLeft = preHexTile.vertices.TopRight + 1;
            }
        }

        hexTile.vertices.Top = hexTile.vertices.TopLeft + 1;
        hexTile.vertices.TopRight = hexTile.vertices.Top + 1;
        id++;

        // the rest tiles
        for (let posIndex = 2; posIndex <= map.row[row - 1]; posIndex++){
            if (id == 28){
                let a = 234;
            }
            preHexTile = map.hexTiles[id - 2];
            hexTile = map.hexTiles[id - 1];

            hexTile.vertices.TopLeft = preHexTile.vertices.TopRight;
            hexTile.vertices.Top = hexTile.vertices.TopLeft + 1;
            hexTile.vertices.TopRight = hexTile.vertices.Top + 1;
            id ++;
        }
    }

    //set the bottom 3 vertices
    id = 1;
    for (let row = 1; row <= map.row.length; row++){
        //set the first tile in the row
        let lastHexInRow = map.hexTiles[id + map.row[row-1] - 2];

        let hexTile = map.hexTiles[id - 1];
        let preRowLen = map.row[row - 2];
        let rowLen = map.row[row -1];
        let nextRowLen = row < map.row.length ? map.row[row] : -1;

        if (preRowLen < rowLen && rowLen > nextRowLen){
            hexTile.vertices.BottomLeft = lastHexInRow.vertices.TopRight + 1;
        }
        else {
            if (preRowLen == rowLen && rowLen == nextRowLen){
                hexTile.vertices.BottomLeft = lastHexInRow.vertices.TopRight + 3;
            }
            else {
                hexTile.vertices.BottomLeft = lastHexInRow.vertices.TopRight + 2;
            }
        }


        hexTile.vertices.Bottom = hexTile.vertices.BottomLeft + 1;
        hexTile.vertices.BottomRight = hexTile.vertices.Bottom + 1;
        updateVerticesToHex(map,hexTile);
        id ++;

        //the rest tiles
        for (let posIndex = 2; posIndex <= map.row[row - 1]; posIndex++){
            let preHexTile = map.hexTiles[id - 2];
            hexTile = map.hexTiles[id - 1];

            hexTile.vertices.BottomLeft = preHexTile.vertices.BottomRight;
            hexTile.vertices.Bottom = hexTile.vertices.BottomLeft + 1;
            hexTile.vertices.BottomRight = hexTile.vertices.Bottom + 1;
            updateVerticesToHex(map, hexTile);
            id ++;
        }
    }
}


/**
 * set vertices first
 */
function setHexTileEdges(map){
    for (let id = 1; id < map.hexTiles.length; id++){
        let hexTile = map.hexTiles[id - 1];
        hexTile.edge.TopLeft = edge(hexTile.vertices.TopLeft, hexTile.vertices.Top);
        hexTile.edge.TopRight = edge(hexTile.vertices.Top, hexTile.vertices.TopRight);
        hexTile.edge.Right = edge(hexTile.vertices.TopRight, hexTile.vertices.BottomRight);
        hexTile.edge.BottomRight = edge(hexTile.vertices.Bottom, hexTile.vertices.BottomRight);
        hexTile.edge.BottomLeft = edge(hexTile.vertices.BottomLeft, hexTile.vertices.Bottom);
        hexTile.edge.Left = edge(hexTile.vertices.TopLeft, hexTile.vertices.BottomLeft);
    }
}

function updateVerticesToHex(map, hexTile){
    map.verticesToHex[hexTile.vertices.TopLeft].push([hexTile.id, 'TopLeft']);
    map.verticesToHex[hexTile.vertices.Top].push([hexTile.id, 'Top']);
    map.verticesToHex[hexTile.vertices.TopRight].push([hexTile.id, 'TopRight']);
    map.verticesToHex[hexTile.vertices.BottomLeft].push([hexTile.id, 'BottomLeft']);
    map.verticesToHex[hexTile.vertices.Bottom].push([hexTile.id, 'Bottom']);
    map.verticesToHex[hexTile.vertices.BottomRight].push([hexTile.id, 'BottomRight']);

}


/**
 *
 * @param hexTiles int[], a list of HexTile id
 * @param types List<String>, a list of HexTile Type.
 * @return landTiles <int>, a list of land HexTile id
 */
function setHexTilesRandomType(map, hexTiles, types){
    if (hexTiles.length != types.length) throw "HexTile number should be equal to HexType numbers";
    let hexTile = null;
    let type = null;
    let landTiles = [];
    while(hexTiles.length > 0){
        hexTile = map.hexTiles[PickRandomItem(hexTiles) - 1];
        type = PickRandomItem(types);
        //console.log(HexType[type]);
        if (Enum.HexType[type]){
            hexTile.type = Enum.HexType[type];
            //if land tile, add to landTiles (because number token can only be placed on land
            if (hexTile.type !== Enum.HexType.Sea) landTiles.push(hexTile.id);
        }
        //if (HexType[type]) hexTile.type = HexType[type];
        else throw "HexType does not exist";
    }
    return landTiles;
}


/**
 * set all the hexTiles map type
 * @param hexTiles a list of HexTile id
 * @param type String a HexTile Type
 */
function setHexTilesFixedType(map, hexTiles, type){
    if (! Enum.HexType[type]) throw "HexType does not exist";
    let hexTile = null;
    for (let hexTileId of hexTiles){
        hexTile = map.hexTiles[hexTileId - 1];
        hexTile.type = Enum.HexType[type];
    }
}

/**
 *
 * @param hexTiles int[], a list of HexTile id
 * @param numTokens String[], a list of numTokens like ['1','1','2','4','5','5','6'] (1*2, 2*1, 3*0, 4*1, 5*2, 6*1)
 */

function setHexTilesRandomNumToken(map, hexTiles, numTokens){
    if (hexTiles.length != numTokens.length) throw "HexTile number should be equal to numTokens numbers";
    let hexId = null;
    let token = null;
    while(hexTiles.length > 0){
        hexId = PickRandomItem(hexTiles);
        token = PickRandomItem(numTokens);
        if (numToken[token]) putNumTokenOnHexTile(map, parseInt(token), hexId);
        else throw  "numToken does not exist";
    }
}



/**
 *
 * @param numToken int
 * @param hexId hexTileId
 */
function putNumTokenOnHexTile(map, numToken, hexId){
    let hexTile = map.hexTiles[hexId - 1];
    hexTile.productionNum = numToken;
    map.numTokenToHexTiles[numToken].push(hexId);
}



function setUpPartMap(map, tilesData, typeData, numsData){
    let landTiles = setHexTilesRandomType(map, _.clone(tilesData), readMapInputToGenStrList(typeData));
    setHexTilesRandomNumToken(map, landTiles, readMapInputToGenStrList(numsData));
    //bank should have a copy of numberTokenToTile mapping list
}



//edge is just a array of two vertices (integer), the smaller integer is the first one
function edge(v1, v2) {
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
/**
 *
 * @param arr
 * @returns {Array.<T>}
 * @constructor
 */
function PickRandomItem(arr) {
    let index = Math.random()*arr.length;
    return (arr.splice(index, 1))[0];
}

/**
 * helper function
 * @param data (a object that specify map data) for mapHexTypeData and mapTokenDate
 * @returns {Array} string array
 */
function readMapInputToGenStrList(data) {
    let keys = Object.keys(data);
    let result = [];
    for (let key of keys){
        let cnt = data[key];
        for (let i = 0; i<cnt; i++){
            result.push(key);
        }
    }
    return result;
}


Map.setUpPartMap = setUpPartMap;