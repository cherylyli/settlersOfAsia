/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */



let Enum = require('./Enum.js');
let _ = require('underscore');
let HexTile = require('./HexTile.js');
let Scenario = require('./Scenario.js');
let Harbor = require('./Harbor.js');

let Map = {} = module.exports;


//const numToken = {'2':1, '3':2, '4':3, '5':4, '6':5, '8':5, '9':4, '10':3, '11':2, '12':1};


Map.createMap = function (scenarioData) {
    let map = {};

    map.hexTileNum = scenarioData.hexTileNum;
    map.hexTiles = [];
    map.vertexInfo = [];
    map.edgeInfo = {}; //key: "vertes1-vertex2", e.g. edge[12, 23] -> "12-23"
    map.hexTileInfo = [];
    map.verticesToEdges = initVerticesToEdges(scenarioData.vertexNum);
    //start from 1 (just use vertex id)
    map.verticesToHex = initVerticesToHex(scenarioData.vertexNum);
    map.row = initRow(scenarioData.hexTileNum);
    map.numTokenToHexTiles = initNumTokenToHexTiles();


    map.piratePositon = 1;  //for testing, change it later
    map.robborPositon = 2;
    map.harbors = {};   //key: edgeKey, value: harbor


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
    };


    /**
     *
     * @param edge {edge}
     * @return {Building}
     */
    map.getEdgeInfo = function (edge) {
        return map.edgeInfo[Map.edgeKey(edge)];
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
        map.edgeInfo[Map.edgeKey(edge)] = edgeUnit;
    };


    /**
     *
     * @param vertex
     * @return {Array<edge>}
     */
    map.getEdgeByVertex = function (vertex) {
        return _.values(map.verticesToEdges[vertex]);
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

    /**
     *
     * @param vertex
     * @return {Array<int>}
     */
    map.getHexTileArrayByVertex = function (vertex) {
        return _.zip.apply(this, map.getHexTileByVertex(vertex))[0];
    };


    /**
     *
     * @param edge
     * @return {Array} each item: [{int}hexTileID, {String}positionOfTheEdgeInThisHex]
     */
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
    map.getHexTileByNumToken = function(numToken){
        return this.numTokenToHexTiles[numToken];
    };




    return map;
};


Map.setUpHarbors = function (map, harborPositions, harborTypesData) {
    let harborTypes = readMapInputToGenStrList(harborTypesData);
    while (harborPositions.length > 0){
        let edge = PickRandomItem(harborPositions);
        let harborType = PickRandomItem(harborTypes);
        map.harbors[Map.edgeKey(edge)] = Harbor.createHarbor(edge, harborType);
    }
};

/**
 * helper function
 * NumTokenToHexTiles is a map that map each number token to a list of hextile that has this num token. So we can get hextiles by number token
 * @return {[number]}
 */
function initNumTokenToHexTiles() {
    let numTokenToHexTiles = [13];
    for (let i = 0; i< 13; i++){
        numTokenToHexTiles[i] = [];
    }
    return numTokenToHexTiles;
}

/**
 * @param vertexNum {int}
 * @return {[[]]}
 */
function initVerticesToEdges(vertexNum) {
    let verticesToEdges = [vertexNum + 1];
    for (let i = 0; i <= vertexNum; i++){
        verticesToEdges[i] = {};
    }
    return verticesToEdges;
}

/**
 *
 * @param vertexNum
 * @return {[[]]}
 */
function initVerticesToHex(vertexNum) {
    let verticesToHex = [vertexNum + 1];
    for (let i = 0; i <= vertexNum; i++){
        verticesToHex[i] = [];
    }
    return verticesToHex;
}


/**
 *
 * @param hexTileNum {int}
 * @return {[number,number,number,number,number,number,number]}
 */
function initRow(hexTileNum) {
    let row = (hexTileNum == 37)? [4, 5, 6, 7, 6, 5, 4] :
        (hexTileNum == 44)?
            [4, 5, 6, 7, 7, 6, 5, 4] : [4, 5, 6, 7, 7, 7, 6, 5, 4];
    return row;
}


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
    for (let id = 1; id <= map.hexTiles.length; id++){
        let hexTile = map.hexTiles[id - 1];
        hexTile.edge.TopLeft = Map.edge(hexTile.vertices.TopLeft, hexTile.vertices.Top, map);
        hexTile.edge.TopRight = Map.edge(hexTile.vertices.Top, hexTile.vertices.TopRight, map);
        hexTile.edge.Right = Map.edge(hexTile.vertices.TopRight, hexTile.vertices.BottomRight, map);
        hexTile.edge.BottomRight = Map.edge(hexTile.vertices.Bottom, hexTile.vertices.BottomRight, map);
        hexTile.edge.BottomLeft = Map.edge(hexTile.vertices.BottomLeft, hexTile.vertices.Bottom, map);
        hexTile.edge.Left = Map.edge(hexTile.vertices.TopLeft, hexTile.vertices.BottomLeft, map);
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
 * @param hexTiles {int[]}, a list of HexTile id
 * @param numTokens {String[]}, a list of numTokens like ['1','1','2','4','5','5','6'] (1*2, 2*1, 3*0, 4*1, 5*2, 6*1)
 * @param check {boolean} a flag, true if we r assigning 6 and 8s.
 */

function setHexTilesRandomNumToken(map, hexTiles, numTokens, check){

    let hexId = null;
    let token = null;
    //we first assign 6, 8 so the hexTiles.length > numTokens.length (which only contains 6 & 8)
    while(numTokens.length > 0){
        hexId = PickRandomItem(hexTiles);
        if (!token) token = PickRandomItem(numTokens);
        let canPut = true;

        if (check) {
            //we do the check because we r assigning 6 & 8s
            let neighbors = map.getHexTileById(hexId).getNeighbors(map);
            for (let id in neighbors){
                if (neighbors[id].productionNum == 8 || neighbors[id].productionNum == 6){
                    // we cannot put 8/6 here
                    // put the number token back and hex back
                    hexTiles.push(hexId);
                    canPut = false;
                    break;
                }
            }

        }
        if (canPut) {
            putNumTokenOnHexTile(map, parseInt(token), hexId);
            token = null;
        }
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
    let [result6And8, resultN] = readNumTokenMapInputToGenStrList(_.clone(numsData));
    setHexTilesRandomNumToken(map, landTiles, result6And8, true);
    setHexTilesRandomNumToken(map, landTiles, resultN, false);
    //bank should have a copy of numberTokenToTile mapping list
}




//edge is just a array of two vertices (integer), the smaller integer is the first one
Map.edge = function(v1, v2, map) {
    let e = null;
    if (v1 < v2) {
        e = [v1, v2];
    }
    else e = [v2, v1];

    map.verticesToEdges[v1][Map.edgeKey(e)] = e;
    map.verticesToEdges[v2][Map.edgeKey(e)] = e;
    return e;
}


/**
 * convert edge to edge key used in map.edgeInfo
 * @param edge {edge}
 * @return {string}
 */
Map.edgeKey = function(edge) {
    return edge[0] + '-' + edge[1];
}


/**
 *
 * @param edge  {edge}
 * @param vertex    {int} this end
 * @return {int} the other end
 */
Map.getOtherEndOfEdge = function (edge, vertex) {
    if (edge[0] == vertex) return edge[1];
    return edge[0];
};

/**
 *
 * @param arr
 * @return {*|T}
 * @constructor
 */
function PickRandomItem(arr) {
    let index = Math.random()*arr.length;
    return (arr.splice(index, 1))[0];
}


/**
 * helper function
 * @param data (a object that specify map data) for mapHexTypeData, mapTokenData and harborTypeData
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

function readNumTokenMapInputToGenStrList(data) {
    let keys = Object.keys(data);
    let resultN = [];
    let result6And8 = [];
    for (let key of keys){
        let cnt = data[key];
        for (let i = 0; i<cnt; i++){
            if (key == 6 || key == 8){
                result6And8.push(key);
            }
            else resultN.push(key);
        }
    }
    return [result6And8, resultN];
}
Map.setUpPartMap = setUpPartMap;

