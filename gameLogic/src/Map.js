/**
 * Created by emol on 1/2/17.
 */
import {HexTile, HexType} from './HexTile.js';
import {_} from  'underscore';
/**
const scenariosFor3 = Object.freeze({'Heading For New Shores': {'hexTileNum': 37,
                                        'mainIsland': [1, 2, 3, 5, 6, 7, 8, 11, 12, 13, 14, 18, 19, 20],
                                        'seaAroundMainIsland': [10, 17, 24, 25, 26, 27, 21, 15, 9, 4],
                                        'smallIslands': [16, 23, 29, 30, 31, 32, 33, 28, 22, 35, 36, 37],
    'SpecialHarbor': 5, 'GenericHarbor':3}})
**/
let mapHexTypeData = {'Sea':2, 'GoldField':2, 'Desert':1, 'Field':4, 'Forest':2, 'Pasture':4, 'Mountains':1, 'Hills':0};
let mapTokenDate = {'5':3, '2':4, '9':9};
let tileIDs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

export const numToken = {'2':1, '3':2, '4':3, '5':4, '6':5, '8':5, '9':4, '10':3, '11':2, '12':1};

export class Map {
    constructor(hexTileNum){
        this.hexTileNum = hexTileNum;
        //starts from 0, id -1
        this.hexTiles = [];

        //start from 1 (just use vertex id)
        this.verticesToHex = [250];
        //may be use edge map too
        for (let i = 0; i<250; i++){
            this.verticesToHex[i] = [];
        }

        //for number 3, numTokenToHexTiles[3]
        this.numTokenToHexTiles = [13];
        for (let i = 0; i< 13; i++){
            this.numTokenToHexTiles[i] = [];
        }


        this.row = (hexTileNum == 37)? [4, 5, 6, 7, 6, 5, 4] : (hexTileNum == 44)? [4, 5, 6, 7, 7, 6, 5, 4] : [4, 5, 6, 7, 7, 7, 6, 5, 4];

        this.generateHexTiles();
        this.setHexTileVertices();
        this.setHexTileEdges();
    }


    generateHexTiles(){
        let id = 1;
        for (let rowIndex = 1; rowIndex <= this.row.length; rowIndex++){
            let rowTileCnt = this.row[rowIndex - 1];
            for (let posInRow = 1; posInRow <= rowTileCnt; posInRow++){
                this.hexTiles.push(new HexTile(id, rowIndex, posInRow));
                id ++;
            }
        }
    }

    setHexTileVertices(){
        //set the top 3 vertices
        //set first row
        let id = 1;

        for (let posInRow = 1; posInRow <= this.row[0]; posInRow++){
            let hexTile = this.hexTiles[id - 1];

            hexTile.vertices.TopLeft = (id - 1)*2 + 1;
            hexTile.vertices.Top = hexTile.vertices.TopLeft + 1;
            hexTile.vertices.TopRight = hexTile.vertices.Top + 1;
            id ++;
        }

        for (let row = 2; row <= this.row.length; row++){
            //set first tile of the row
            let preHexTile = this.hexTiles[id - 2];
            let hexTile = this.hexTiles[id - 1];

            if(this.row[row - 1] > this.row[row - 2]){
                hexTile.vertices.TopLeft = preHexTile.vertices.TopRight + 1;
            }
            else{
                hexTile.vertices.TopLeft = preHexTile.vertices.TopRight + 2;
            }
            if (row > 2 && this.row[row - 2] < this.row[row - 3]){
                hexTile.vertices.TopLeft ++;
            }

            hexTile.vertices.Top = hexTile.vertices.TopLeft + 1;
            hexTile.vertices.TopRight = hexTile.vertices.Top + 1;
            id++;

            // the rest tiles
            for (let posIndex = 2; posIndex <= this.row[row - 1]; posIndex++){
                preHexTile = this.hexTiles[id - 2];
                hexTile = this.hexTiles[id - 1];

                hexTile.vertices.TopLeft = preHexTile.vertices.TopRight;
                hexTile.vertices.Top = hexTile.vertices.TopLeft + 1;
                hexTile.vertices.TopRight = hexTile.vertices.Top + 1;
                id ++;
            }
        }

        //set the bottom 3 vertices
        id = 1;
        for (let row = 1; row <= this.row.length; row++){
            //set the first tile in the row
            let lastHexInRow = this.hexTiles[id + this.row[row-1] - 2];

            let hexTile = this.hexTiles[id - 1];

            if (row > 1 && row < this.row. length && this.row[row - 2] < this.row[row - 1] && this.row[row - 1] >= this.row [row]){
                hexTile.vertices.BottomLeft = lastHexInRow.vertices.TopRight + 1;
            }
            else{
                hexTile.vertices.BottomLeft = lastHexInRow.vertices.TopRight + 2;
            }
            hexTile.vertices.Bottom = hexTile.vertices.BottomLeft + 1;
            hexTile.vertices.BottomRight = hexTile.vertices.Bottom + 1;
            this.updateVerticesToHex(hexTile);
            id ++;

            //the rest tiles
            for (let posIndex = 2; posIndex <= this.row[row - 1]; posIndex++){
                let preHexTile = this.hexTiles[id - 2];
                hexTile = this.hexTiles[id - 1];

                hexTile.vertices.BottomLeft = preHexTile.vertices.BottomRight;
                hexTile.vertices.Bottom = hexTile.vertices.BottomLeft + 1;
                hexTile.vertices.BottomRight = hexTile.vertices.Bottom + 1;
                this.updateVerticesToHex(hexTile);
                id ++;
            }
        }
    }


    /**
     * set vertices first
     */
    setHexTileEdges(){
        for (let id = 1; id < this.hexTiles.length; id++){
            let hexTile = this.hexTiles[id - 1];
            hexTile.edge.TopLeft = edge(hexTile.vertices.TopLeft, hexTile.vertices.Top);
            hexTile.edge.TopRight = edge(hexTile.vertices.Top, hexTile.vertices.TopRight);
            hexTile.edge.Right = edge(hexTile.vertices.TopRight, hexTile.vertices.BottomRight);
            hexTile.edge.BottomRight = edge(hexTile.vertices.Bottom, hexTile.vertices.BottomRight);
            hexTile.edge.BottomLeft = edge(hexTile.vertices.BottomLeft, hexTile.vertices.Bottom);
            hexTile.edge.Left = edge(hexTile.vertices.TopLeft, hexTile.vertices.BottomLeft);
        }
    }

    updateVerticesToHex(hexTile){
        this.verticesToHex[hexTile.vertices.TopLeft].push([hexTile.id, 'TopLeft']);
        this.verticesToHex[hexTile.vertices.Top].push([hexTile.id, 'Top']);
        this.verticesToHex[hexTile.vertices.TopRight].push([hexTile.id, 'TopRight']);
        this.verticesToHex[hexTile.vertices.BottomLeft].push([hexTile.id, 'BottomLeft']);
        this.verticesToHex[hexTile.vertices.Bottom].push([hexTile.id, 'Bottom']);
        this.verticesToHex[hexTile.vertices.BottomRight].push([hexTile.id, 'BottomRight']);

    }


    /**
     *
     * @param hexTiles int[], a list of HexTile id
     * @param types List<String>, a list of HexTile Type.
     */
    setHexTilesRandomType(hexTiles, types){
        if (hexTiles.length != types.length) throw "HexTile number should be equal to HexType numbers";
        let hexTile = null;
        let type = null;
        while(hexTiles.length > 0){
            hexTile = this.hexTiles[PickRandomItem(hexTiles) - 1];
            type = PickRandomItem(types);
            if (HexType[type]) hexTile.type = HexType[type];
            else throw "HexType does not exist";
        }
    }


    /**
     * set all the hexTiles this type
     * @param hexTiles a list of HexTile id
     * @param type String a HexTile Type
     */
    setHexTilesFixedType(hexTiles, type){
        if (! HexType[type]) throw "HexType does not exist";
        let hexTile = null;
        for (let hexTileId of hexTiles){
            hexTile = this.hexTiles[hexTileId - 1];
            hexTile.type = HexType[type];
        }
    }

    /**
     *
     * @param hexTiles int[], a list of HexTile id
     * @param numTokens String[], a list of numTokens like ['1','1','2','4','5','5','6'] (1*2, 2*1, 3*0, 4*1, 5*2, 6*1)
     */
    setHexTilesRandomNumToken(hexTiles, numTokens){
        if (hexTiles.length != numTokens.length) throw "HexTile number should be equal to numTokens numbers";
        let hexId = null;
        let token = null;
        while(hexTiles.length > 0){
            hexId = PickRandomItem(hexTiles);
            token = PickRandomItem(numTokens);
            if (numToken[token]) this.putNumTokenOnHexTile(parseInt(token), hexId);
            else throw  "numToken does not exist";
        }
    }

    /**
     *
     * @param hexTileId int
     * @returns {*} hexTile
     */
    getHexTileById(hexTileId){
        if (hexTileId <=0 || hexTileId > this.hexTileNum) throw "Invalid hexTileID";
        return this.hexTiles[hexTileId - 1];
    }

    /**
     *
     * @param vertex vertex number
     * @returns {*|number}
     */
    getHexTileByVertex(vertex){
        if (vertex < 1 || vertex >= 250 || !this.verticesToHex[vertex]) throw "Invalid vertex";
        return this.verticesToHex[vertex];
    }

    getHexTileByEdge(edge){
        let t1 = this.getHexTileByVertex(edge[0]);
        let t2 = this.getHexTileByVertex(edge[1]);

        //find common tiles commonV
        let commonT = [];
        for (let ta  = 0; ta < t1.length; ta++){
            for (let tb = 0; tb< t2.length; tb++){
                if (t1[ta][0] == t2[tb][0]) commonT.push(t1[ta][0]);
            }
        }

        let result = [];
        for (let t of commonT){
            let tile = this.hexTiles[t - 1];
            let a = tile.getEdgePositionInHex(edge);
            result.push([t, tile.getEdgePositionInHex(edge)]);
        }
        if (!result) throw "Invalid edge";
        return result;
    }



    /**
     *
     * @param numToken int
     * @param hexTile hexTileId
     */
    putNumTokenOnHexTile(numToken, hexId){
        let hexTile = this.hexTiles[hexId - 1];
        hexTile.productionNum = numToken;
        this.numTokenToHexTiles[numToken].push(hexId);
    }


    /**
     *
     * @param numToken int
     */
    getHexTileByNumToken(numToken){
        return this.numTokenToHexTiles[numToken];
    }

    setUpMap(mapData){
        this.setHexTilesRandomNumToken(_.clone(tileIDs), readMapInputToGenStrList(mapTokenDate));
        this.setHexTilesRandomType(_.clone(tileIDs), readMapInputToGenStrList(mapHexTypeData));
    }

}

//edge is just a array of two vertices (integer), the smaller integer is the first one
function edge(v1, v2) {
    return [v1, v2];
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
