/**
 * Created by emol on 2/18/17.
 */
let Cost = {};

//reference: http://www.unc.edu/~rvp/GameRules/RulesSettlersCitiesAndKnights.html
//TODO: progress cards + city improvements.
Cost.buildSettlement = {[Enum.Resource.Lumber]: 1, [Enum.Resource.Wool]: 1, [Enum.Resource.Brick]: 1, [Enum.Resource.Grain]: 1};
Cost.upgradeToCity = {[Enum.Resource.Ore]: 3, [Enum.Resource.Grain]: 2};
//Cost.settlementToCity = {[Enum.Resource.Ore]: 3, [Enum.Resource.Grain]: 2};
Cost.buildRoad = {[Enum.Resource.Lumber]: 1, [Enum.Resource.Brick]: 1};
Cost.buildShip = {[Enum.Resource.Lumber]: 1, [Enum.Resource.Wool]: 1};
Cost.buildCityWall = {[Enum.Resource.Brick]: 2};

Cost.cityImprove_Trade_1 = {[Enum.Commodity.Cloth]: 1};
Cost.cityImprove_Trade_2 = {[Enum.Commodity.Cloth]: 2};
Cost.cityImprove_Trade_3 = {[Enum.Commodity.Cloth]: 3};
Cost.cityImprove_Trade_4 = {[Enum.Commodity.Cloth]: 4};
Cost.cityImprove_Trade_5 = {[Enum.Commodity.Cloth]: 5};
Cost.cityImprove_Politics_1 = {[Enum.Commodity.Coin]: 1};
Cost.cityImprove_Politics_2 = {[Enum.Commodity.Coin]: 2};
Cost.cityImprove_Politics_3 = {[Enum.Commodity.Coin]: 3};
Cost.cityImprove_Politics_4 = {[Enum.Commodity.Coin]: 4};
Cost.cityImprove_Politics_5 = {[Enum.Commodity.Coin]: 5};
Cost.cityImprove_Science_1 = {[Enum.Commodity.Paper]: 1};
Cost.cityImprove_Science_2 = {[Enum.Commodity.Paper]: 2};
Cost.cityImprove_Science_3 = {[Enum.Commodity.Paper]: 3};
Cost.cityImprove_Science_4 = {[Enum.Commodity.Paper]: 4};
Cost.cityImprove_Science_5 = {[Enum.Commodity.Paper]: 5};

//Cost.hireKnight = {};
Cost.basicKnights = {[Enum.Resource.Wool]: 1, [Enum.Resource.Ore]: 1};
Cost.activateKnight = {[Enum.Resource.Grain]: 1};
Cost.promoteKnight = {[Enum.Resource.Grain]: 1};

//====================trade facts======================
Cost.defaultTradeRatio = 4;
Cost.goldTradeRatio = 2;
Cost.generalHarborTradeRatio = 3;
Cost.specialHarborTradeRatio = 2;
Cost.merchantTradeRatio = -1;

//================fish token====
Cost.moveUseFish = 2;
Cost.stealUseFish = 3;
Cost.drawResUseFish = 4;
Cost.buildRoadUseFish = 5;
Cost.drawProgUseFish = 7;
