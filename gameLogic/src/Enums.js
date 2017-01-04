/**
 * Created by emol on 12/31/16.
 */
export let PlayerState = deepFreeze({"LOBBY":1, "GAME_ROOM":2, "DISCONNECTED":3});

//FIXME: is loading and end state necessary?
/**
 * "Waiting" : Player number in the room is under the minimum required player number to start a game
 * "Ready" : Player number in the room satisfy the minimum number (new player can still join the game room if the game did not start)
 * "Full" : Player number reach the maximum number, new player cannot join the game room
 * "Playing" : Player selected the game and game started
 */
export let GameRoomState = deepFreeze({"Waiting":1, "Ready":2, "Full":3, "Playing":3});

export let ProgressCardType = deepFreeze({
    "Trade":{"CommercialHarbor":1, "MasterMerchant":2, "Merchant":3, "MerchantFleet":4, "ResourceMonopoly":5, "TradeMonopoly":6},
    "Politics":{"Bishop":1, "Constitution":2, "Diplomat":3, "Deserter":4, "Intrigue":5, "Saboteur":6, "Spy":7, "Wedding":9, "Warlord":8},
    "Science":{"Alchemist":1, "Crane":2, "Inventor":3, "Irrigation":4, "Engineer":5, "Medicine":6, "Mining":7, "Printer":8, "RoadBuilding":9, "Smith":10}
});

export let DevCardType = deepFreeze({"VP":1, "LongestRoad":2, "LargestArmy":3, "YearOfPlenty":4, "Monopoly":5, "Knight":6});

export let KnightType = deepFreeze({"Regular":1, "Strong":2, "Mighty":3});

//FIXME: what's default color?
export let Color = deepFreeze({"RED":1, "YELLOW":2, "GREEN":3, "ORANGE":4});

//FIXME: two gamestate in concept model, one is more like lobby state
export let Resource = deepFreeze({"Wheat":1, "Wool":2, "Ore":3, "Brick":4, "Grain":5, "Coin":6, "Cloth":7, "Paper":8});




//helper function
function deepFreeze(obj) {
    let propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(function(name) {
        let prop = obj[name];
        if (typeof prop == 'object' && prop !== null)
            deepFreeze(prop);
    });
    return Object.freeze(obj);
}