
let Enum = {};

Enum.PlayerState = {
    "LOBBY":'LOBBY',
    "GAME_ROOM":'GAME_ROOM'
};

Enum.SettlementLV = 1;

Enum.CityLV = 2;

Enum.cityImprovementCategory = {
    "Trade": "Trade",
    "Politics": "Politics",
    "Science": "Science"
};


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
    'Hills':'Hills'
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
    [Enum.Resource.Brick]: Enum.Resource.Brick,
    [Enum.Resource.Grain]: Enum.Resource.Grain,
    [Enum.Resource.Lumber]: Enum.Resource.Lumber,
    [Enum.Resource.Ore]: Enum.Resource.Ore,
    [Enum.Resource.Wool]: Enum.Resource.Wool,
    'General': 'General'
};

Enum.HarborRatio = {
    'SpecialHarbor': 2,
    'GeneralHarbor': 3
};

Enum.AllowedCommands = {
    'SetupRoundOne': ['buildEstablishment', 'buildRoad', 'buildShip', 'endTurn'],
    'SetupRoundTwo': ['buildEstablishment', 'buildRoad', 'buildShip', 'endTurn']
};


Enum.DieResult = Object.freeze({"BlueCityGate":"BlueCityGate", "GreenCityGate":"GreenCityGate", "YellowCityGate":"YellowCityGate", "Ship":"Ship" });
