/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let Map = require('./Map.js');

let Scenario = {} = module.exports;
let Scenarios = {'Scenario1': 'Heading For New Shores'
};

let loadScenario = function (playerCnt, scenario) {
    //check player number to load scenario!!
    if (scenario == Scenarios.Scenario1){
        if (playerCnt == 3) return Heading_For_New_Shores_3;
        else {
            //playerCnt == 4
            return Heading_For_New_Shores_4;
        }
    }

}


let scenario1_3_Data = {
    'hexTileNum': 37,
    'mainIsland': [1,2,3,5,6,7,8,11,12,13,14,18,19,20],
    'smallIslands': [16,23,29,30,31,32,33,28,22,35,36,37],
    'hexTypeForMain': {'Desert':0,'GoldField':0, 'Field':3, 'Hills':2, 'Mountains':2, 'Pasture':4,'Forest':3},
    'hexTypeForIslands': {'Sea':4,'Desert':0,'GoldField':2, 'Field':1, 'Hills':2, 'Mountains':2, 'Pasture':1,'Forest':0},
    'NumTokenForMain': {'2': 1, '3':1, '4':1, '5':2, '6':2, '8': 2, '9':1, '10':2, '11':2, '12':0},
    'NumTokenForIslands': {'2': 0, '3':1, '4':2, '5':1, '6':0, '8': 1, '9':1, '10':1, '11':0, '12':1}
}

let scenario1_setUpMap = function (data) {
    let map = Map.createMap(data.hexTileNum);
    Map.setUpPartMap(map, data.mainIsland, data.hexTypeForMain, data.NumTokenForMain);
    Map.setUpPartMap(map, data.smallIslands, data.hexTypeForIslands, data.NumTokenForIslands);
    return map;
}

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