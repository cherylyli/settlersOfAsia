/**
 * Created by emol on 1/2/17.
 */
import {_} from 'underscore'

export const HexType = Object.freeze({'Sea': 1, 'GoldField': 2, 'Desert':3, 'Field':4, 'Forest':5, 'Pasture':6, 'Mountains':7, 'Hills':8});

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
}

