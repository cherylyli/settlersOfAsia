/**
 * Created by emol on 1/2/17.
 */
import {_} from 'underscore';
import {Player} from './Player.js';

export const HexType = Object.freeze({'Sea': 1, 'GoldField': 2, 'Desert':3, 'Field':4, 'Forest':5, 'Pasture':6, 'Mountains':7, 'Hills':8});
export const SettlementResources = Object.freeze({'GoldField': 'Any', 'Field': 'Grain', 'Forest': 'Lumber', 'Pasture': 'Wool', 'Hills': 'Brick', 'Mountains': 'Ore'});
export const AdditionalCityResources = Object.freeze({'GoldField': 'Any', 'Field': 'Grain', 'Forest': 'Paper', 'Pasture': 'Cloth', 'Hills': 'Brick', 'Mountains': 'Coin'});
export const Resource = Object.freeze({"Wheat":1, "Wool":2, "Ore":3, "Brick":4, "Grain":5});
export const Commodity = Object.freeze({"Coin":6, "Cloth":7, "Paper":8});

export class HexTile{
    constructor(id, row, posInRow, HexType = 'Sea', productionNum = '1', visible = true){
        this.id = id;
        this.row = row;
        this.posInRow = posInRow;
        this.type = HexType;
        this.productionNum = productionNum;
        this.visible = visible;
        this.edge =  {'TopRight': null, 'Right': null, 'BottomRight': null, 'BottomLeft': null, 'Left': null, 'TopLeft': null};
        this.edgeInfo =  {'TopRight': null, 'Right': null, 'BottomRight': null, 'BottomLeft': null, 'Left': null, 'TopLeft': null};
        this.vertices = {'Top': undefined, 'TopLeft': undefined, 'BottomLeft': undefined, 'Bottom': undefined, 'BottomRight': undefined, 'TopRight': undefined};
        this.verticesInfo = {'Top': null, 'TopLeft': null, 'BottomLeft': null, 'Bottom': null, 'BottomRight': null, 'TopRight': null};
        this.blockedByRobber = false;
    }

    getVertices(){
        return this.vertices;
    }

    /**
     * find the edge position in hex
     * @param edge
     * @returns string / undefined
     */
    getEdgePositionInHex(edge){

        if (_.isEqual(edge, this.edge.BottomLeft)){
            return 'BottomLeft';
        }
        if (_.isEqual(edge, this.edge.Left)){
            return 'Left';
        }
        if (_.isEqual(edge, this.edge.TopLeft)){
            return 'TopLeft';
        }
        if (_.isEqual(edge, this.edge.BottomRight)){
            return 'BottomRight';
        }
        if (_.isEqual(edge, this.edge.Right)){
            return 'Right';
        }
        if (_.isEqual(edge, this.edge.TopRight)){
            return 'TopRight';
        }

        return undefined;
        }


    getEdges(){
        return this.edge;
    }

    /**
     * add resources to all players that has a building on its vertices
     */
    produceResource(){
        for (let player of this.playersReceivedResource){

        }
    }
}

