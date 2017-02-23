/**
 * Created by emol on 2/18/17.
 */
let Cost = module.exports = {};

Cost.buildSettlement = {"Lumber":1, "Wool":1, "Brick":1, "Grain":1};
Cost.buildCity ={"Brick":1,"Lumber":1,"Grain":1, "Wool":1};
Cost.settlementToCity = {'Ore':3, 'Grain':2};

//TODO: Yuan, store all costs here
//reference: http://www.unc.edu/~rvp/GameRules/RulesSettlersCitiesAndKnights.html 
Cost.buildRoad = {"Lumber":1, "Brick":1};
Cost.buildShip = {"Lumber":1, "Wool":1};
Cost.buildCityWall = {"Brick":2};

Cost.cityImprove_trade_1 = {};
Cost.cityImprove_trade_2 = {};
Cost.cityImprove_trade_3 = {};
Cost.cityImprove_trade_4 = {};
Cost.cityImprove_trade_5 = {};
Cost.cityImprove_politics_1 = {};
Cost.cityImprove_politics_2 = {};
Cost.cityImprove_politics_3 = {};
Cost.cityImprove_politics_4 = {};
Cost.cityImprove_politics_5 = {};
Cost.cityImprove_science_1 = {};
Cost.cityImprove_science_2 = {};
Cost.cityImprove_science_3 = {};
Cost.cityImprove_science_4 = {};
Cost.cityImprove_science_5 = {};
