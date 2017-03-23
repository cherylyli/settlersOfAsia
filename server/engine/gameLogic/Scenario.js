/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let Map = require('./Map.js');
let Enum = require('./Enum.js');

let Scenario = module.exports = {};
let Scenarios = {'Scenario1': 'Heading For New Shores'};

let loadScenario = function (playerCnt, scenario) {
    //check player number to load scenario!!
    if (scenario == Scenarios.Scenario1){
        if (playerCnt == 3) return Heading_For_New_Shores_3;
        else {
            //playerCnt == 4
            return Heading_For_New_Shores_4;
        }
    }

};


let scenario1_3_Data = {
    'hexTileNum': 37,
    'vertexNum': 96,
    'islandsNum': 4,
    'islands': [[1,2,3,5,6,7,8,11,12,13,14,18,19,20], [16, 23], [30, 31, 32, 36], [22, 28]],
    'hexTypes': [{'Desert':0, 'GoldField':0, 'Field':3, 'Hills':2, 'Mountains':2, 'Pasture':4, 'Forest':3}, {'Hills':1, 'Mountains':1}, {'GoldField':1, 'Field':1, 'Pasture':1, 'Mountains': 1}, {'GoldField':1, 'Hills':1}],
    'NumTokens': [{'2': 1, '3':1, '4':1, '5':2, '6':2, '8': 2, '9':1, '10':2, '11':2, '12':0}, {'10':1, '8':1}, {'2': 0, '3':1, '4':2, '5':0, '6':0, '8': 0, '9':1}, {'5':1, '12':1}],
    'harborPositions': [[10, 11], [2, 3], [5, 6], [7, 17], [30, 31], [57, 58], [54, 55], [22, 23]],
    'harborTypesData': {[Enum.HarborType.General]: 3, [Enum.HarborType.Wool]: 1, [Enum.HarborType.Grain]: 1, [Enum.HarborType.Lumber]: 1, [Enum.HarborType.Ore]: 1, [Enum.HarborType.Brick]: 1},
    'fishTilePositions':[[45, 44, 59], [53, 38, 37], [36, 51, 52], [49, 50, 64], [68, 69, 70], [70, 71, 72], [94, 84, 85], [81, 82, 92], [60, 61, 46], [63, 62, 76]],
    'fishTileNumTokens': {'2': 1, '3':1, '4':1, '5':1, '6':1, '8': 1, '9':1, '10':1, '11':1}
};

let scenario1_setUpMap = function (data) {
    let map = Map.createMap(data);

    for (let i = 0; i < data.islandsNum; i++){
        Map.setUpPartMap(map, data.islands[i], data.hexTypes[i], data.NumTokens[i]);
    }

    Map.setUpHarbors(map, data.harborPositions, data.harborTypesData);
    Map.setUpFishTiles(map, data.fishTilePositions, data.fishTileNumTokens);

    return map;
};

//change data later!!
let Heading_For_New_Shores_4 = {
    'mainIsland': [1,2,3,5,6,7,8,11,12,13,14,18,19,20],
    'smallIslands': [16,23,29,30,31,32,33,28,22,35,36,37],
    'hexTypeForMain': {'GoldField':0, 'Desert':1, 'Field':4, 'Forest':4, 'Pasture':4, 'Mountains':3, 'Hills':3},
    'hexTypeForIslands': {'Sea':4, 'GoldField':2, 'Desert':1, 'Field':1, 'Forest':1, 'Pasture':1, 'Mountains':2, 'Hills':2},
    'NumTokenForMain': {'2': 1, '3':2, '4':2, '5':2, '6':2, '8': 2, '9':2, '10':2, '11':2, '12':1},
    'NumTokenForIslands': {'2': 1, '3':1, '4':1, '5':1, '6':1, '8': 1, '9':1, '10':1, '11':1, '12':0}
}

let Heading_For_New_Shores_3 = {

    'data' : scenario1_3_Data,
    'setUpMap': scenario1_setUpMap,
}


Scenario.Scenarios = Scenarios;
Scenario.loadScenario = loadScenario;