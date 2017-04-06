/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/9/17.
 */

let Enum = module.exports = {};

Enum.PlayerState = {
    "LOBBY":'LOBBY',
    "GAME_ROOM":'GAME_ROOM'
};

Enum.Building = {
    "Settlement": "Settlement",
    "City": "City",
    "Science": "Science",
    "Trade": "Trade",
    "Politics": "Politics"
};
Enum.SettlementLV = 1;

Enum.CityLV = 2;

Enum.cityImprovementCategory = {
    "Trade": "Trade",
    "Politics": "Politics",
    "Science": "Science"
};

Enum.BarbarianResult = {
    "CATAN_WIN" : "CATAN_WIN",
    "CATAN_LOSE" : "CATAN_LOSE",
    "CATAN_WIN_TIE" : "CATAN_WIN_TIE"
};

Enum.fishToken = {
  "ONE_FISH" : "ONE_FISH",
  "TWO_FISH" : "TWO_FISH",
  "THREE_FISH" : "THREE_FISH",
  "BOOT" : "BOOT"
}

Enum.fishEvent = {
  "MOVE_ROBBER" : "MOVE_ROBBER",
  "MOVE_PIRATE" : "MOVE_PIRATE",
  "STEAL_CARD" : "STEAL_CARD",
  "BUILD_ROAD" : "BUILD_ROAD",
  "BUILD_SHIP" : "BUILD_SHIP",
  "DRAW_PROG" : "DRAW_PROG",
  "DRAW_RES_FROM_BANK" : "DRAW_RES_FROM_BANK"
}
/**
 * "Waiting" : Player number in the room is under the minimum required player number to start a game
 * "Ready" : Player number in the room satisfy the minimum number (new player can still join the game room if the game did not start)
 * "Full" : Player number reach the maximum number, new player cannot join the game room
 * "Playing" : Player selected the game and game started
 */
Enum.GameRoomState = {
    "Waiting":"Waiting",
    "Ready":"Ready",
    "Full":"Full",
    "Playing":"Playing"
};
/**TODO: change here
 *
 * @type {{SetupRoundOne: string, SetupRoundTwo: string, TurnPhase: string, TurnDiceRolled: string, TurnSecondPhase: string, Completed: string}}
 */
Enum.MatchPhase = {
    "SetupRoundOne": "SetupRoundOne",
    "SetupRoundTwo": "SetupRoundTwo",
    "TurnPhase": "TurnPhase",
    "TurnDiceRolled": "TurnDiceRolled",
    "TurnSecondPhase": "TurnSecondPhase",
    "Completed": "Completed"
};

Enum.ProgressCardType = {
    "Trade":{
        "CommercialHarbor":"CommercialHarbor",
        "MasterMerchant":"MasterMerchant",
        "Merchant":"Merchant",
        "MerchantFleet":"MerchantFleet",
        "ResourceMonopoly":"ResourceMonopoly",
        "TradeMonopoly":"TradeMonopoly"
    },
    "Politics":{
        "Bishop":"Bishop",
        "Constitution":"Constitution",
        "Diplomat":"Diplomat",
        "Deserter":"Deserter",
        "Intrigue":"Intrigue",
        "Saboteur":"Saboteur",
        "Spy":"Spy",
        "Wedding":"Wedding",
        "Warlord":"Warlord"
    },
    "Science":{
        "Alchemist":"Alchemist",
        "Crane":"Crane",
        "Inventor":"Inventor",
        "Irrigation":"Irrigation",
        "Engineer":"Engineer",
        "Medicine":"Medicine",
        "Mining":"Mining",
        "Printer":"Printer",
        "RoadBuilding":"RoadBuilding",
        "Smith":"Smith"
    }
};

Enum.DevCardType = {
    "VP": "VP",
    "LongestRoad": "LongestRoad",
    "LargestArmy": "LargestArmy",
    "YearOfPlenty": "YearOfPlenty",
    "Monopoly": "Monopoly",
    "Knight": "Knight"
};

Enum.KnightType = {
    "Regular": "Regular",
    "Strong": "Strong",
    "Mighty": "Mighty"
};

Enum.Color = {
    "RED":"RED",
    "GREEN":"GREEN",
    "ORANGE":"ORANGE",
    "BLUE":"BLUE"
};


Enum.HexType = {
    'Sea': 'Sea',
    'GoldField': 'GoldField',
    'Desert':'Desert',
    'Field':'Field',
    'Forest':'Forest',
    'Pasture':'Pasture',
    'Mountains':'Mountains',
    'Hills':'Hills',
    'Lake': 'Lake'
};

Enum.SettlementResources = {
    'GoldField': 'Gold',
    'Field': 'Grain',
    'Forest': 'Lumber',
    'Pasture': 'Wool',
    'Hills': 'Brick',
    'Mountains': 'Ore'
};

Enum.AdditionalCityResources = {
    'GoldField': 'Gold',
    'Field': 'Grain',
    'Forest': 'Paper',
    'Pasture': 'Cloth',
    'Hills': 'Brick',
    'Mountains': 'Coin'
};

Enum.Resource = {
    "Lumber":"Lumber",
    "Wool":"Wool",
    "Ore":"Ore",
    "Brick":"Brick",
    "Grain":"Grain",
    "Gold": "Gold"
};

Enum.Commodity = {
    "Coin":"Coin",
    "Cloth":"Cloth",
    "Paper":"Paper"
};

Enum.Tradable = {
    "Lumber":"Lumber",
    "Wool":"Wool",
    "Ore":"Ore",
    "Brick":"Brick",
    "Grain":"Grain",
    "Gold": "Gold",
    "Coin":"Coin",
    "Cloth":"Cloth",
    "Paper":"Paper"
};


Enum.HarborType = {
    'Brick': Enum.Resource.Brick,
    'Grain': Enum.Resource.Grain,
    'Lumber': Enum.Resource.Lumber,
    'Ore': Enum.Resource.Ore,
    'Wool': Enum.Resource.Wool,
    'General': 'General'
};

Enum.HarborRatio = {
    'SpecialHarbor': 2,
    'GeneralHarbor': 3
};
