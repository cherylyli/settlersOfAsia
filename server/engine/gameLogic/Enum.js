/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/9/17.
 */

let Enum = module.exports = {};
let PlayerState = {"LOBBY":'LOBBY', "GAME_ROOM":'GAME_ROOM'};

/**
 * "Waiting" : Player number in the room is under the minimum required player number to start a game
 * "Ready" : Player number in the room satisfy the minimum number (new player can still join the game room if the game did not start)
 * "Full" : Player number reach the maximum number, new player cannot join the game room
 * "Playing" : Player selected the game and game started
 */
let GameRoomState = {"Waiting":"Waiting", "Ready":"Ready", "Full":"Full", "Playing":"Playing"};
/**TODO: change here
 *
 * @type {{SetupRoundOne: string, SetupRoundTwo: string, TurnPhase: string, TurnDiceRolled: string, TurnSecondPhase: string, Completed: string}}
 */
Enum.MatchPhase = {"SetupRoundOne": "SetupRoundOne", "SetupRoundTwo": "SetupRoundTwo", "TurnPhase": "TurnPhase", "TurnDiceRolled": "TurnDiceRolled", "TurnSecondPhase": "TurnSecondPhase", "Completed": "Completed"};

module.exports.ProgressCardType = {
    "Trade":{"CommercialHarbor":"CommercialHarbor", "MasterMerchant":"MasterMerchant", "Merchant":"Merchant", "MerchantFleet":"MerchantFleet", "ResourceMonopoly":"ResourceMonopoly", "TradeMonopoly":"TradeMonopoly"},
    "Politics":{"Bishop":"Bishop", "Constitution":"Constitution", "Diplomat":"Diplomat", "Deserter":"Deserter", "Intrigue":"Intrigue", "Saboteur":"Saboteur", "Spy":"Spy", "Wedding":"Wedding", "Warlord":"Warlord"},
    "Science":{"Alchemist":"Alchemist", "Crane":"Crane", "Inventor":"Inventor", "Irrigation":"Irrigation", "Engineer":"Engineer", "Medicine":"Medicine", "Mining":"Mining", "Printer":"Printer", "RoadBuilding":"RoadBuilding", "Smith":"Smith"}
};

module.exports.DevCardType = {"VP":1, "LongestRoad":2, "LargestArmy":3, "YearOfPlenty":4, "Monopoly":5, "Knight":6};

module.exports.KnightType = {"Regular":1, "Strong":2, "Mighty":3};

//FIXME: what's default color?
module.exports.Color = {"RED":"RED", "YELLOW":"YELLOW", "GREEN":"GREEN", "ORANGE":"ORANGE"};

module.exports.HexType = Object.freeze({'Sea': 'Sea', 'GoldField': 'GoldField', 'Desert':'Desert', 'Field':'Field', 'Forest':'Forest', 'Pasture':'Pasture', 'Mountains':'Mountains', 'Hills':'Hills'});
module.exports.SettlementResources = Object.freeze({'GoldField': 'Gold', 'Field': 'Grain', 'Forest': 'Lumber', 'Pasture': 'Wool', 'Hills': 'Brick', 'Mountains': 'Ore'});
module.exports.AdditionalCityResources = Object.freeze({'GoldField': 'Gold', 'Field': 'Grain', 'Forest': 'Paper', 'Pasture': 'Cloth', 'Hills': 'Brick', 'Mountains': 'Coin'});

module.exports.Resource = Object.freeze({"Lumber":"Lumber", "Wool":"Wool", "Ore":"Ore", "Brick":"Brick", "Grain":"Grain", "Gold": "Gold"});
module.exports.Commodity = Object.freeze({"Coin":"Coin", "Cloth":"Cloth", "Paper":"Paper"});




//FIXME: two gamestate in concept model, one is more like lobby state
//export let Resource = deepFreeze({"Wheat":1, "Wool":2, "Ore":3, "Brick":4, "Grain":5, "Coin":6, "Cloth":7, "Paper":8});




module.exports.PlayerState = PlayerState;
module.exports.GameRoomState = GameRoomState;