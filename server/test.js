/**
 * Created by emol on 2/17/17.
 */
"use strict"
// let fakeRoom = module.exports = {};
let Commands = require("./engine/Commands.js");
let User = require("./engine/gameLogic/User.js");
let data = require("./engine/Data.js");
let Enum = require("./engine/gameLogic/Enum.js");
let Player = require("./engine/gameLogic/Player.js");
let Match = require("./engine/gameLogic/Match.js");
let Room = require("./engine/gameLogic/Room.js");

var _ = require('underscore');
/**
let rooms = data.rooms;
let users = data.users;
let match = data.matches;
**/

console.log("Test is being run");
let user_A = {username :  "Emol", profile_pic : '/img/default_profile_pic.png'};
let user_B = {username :  "Max", profile_pic : '/img/default_profile_pic.png'};
let user_C = {username :  "Cheryl", profile_pic : '/img/default_profile_pic.png'};
let user_D = {username :  "Yuan", profile_pic : '/img/default_profile_pic.png'};
// let userA = User.createUser(user_A);
// let userB = User.createUser(user_B);
// let userC = User.createUser(user_C);
// let userD = User.createUser(user_D);
// Commands.makeNewRoom(user_D, "123");
// Commands.joinRoom(userA, "123");
// Commands.joinRoom(userB, "123");
// Commands.joinRoom(userC, "123");

// Commands.makeNewRoom(user_A, "barba", "barba");

//Test cases start here


// Commands.startGame("123");
var match = data.getMatch("barba");
let currentPlayer = match.currentPlayer;
Commands.rollDice(match.currentPlayer,"123");
Commands.rollDice(match.currentPlayer,"123");
Commands.rollDice(match.currentPlayer,"123");
Commands.rollDice(match.currentPlayer,"123");
Commands.rollDice(match.currentPlayer,"123");
Commands.rollDice(match.currentPlayer,"123");
Commands.rollDice(match.currentPlayer,"123");


function endTurn (userName, roomID) {
    let player = data.getPlayer(userName, roomID);
    player.active_cards = {}; //we need to delete all of the previously active cards
    Player.freeRoadsOrShips = 0; // delete free roads
    Player.freeUpgradeKnights = 0; // delete free knight upgrades
    let match = data.getMatch(roomID);
    Match.nextPlayerToTakeTurn(match);
    // notify.user(match.currentPlayer, 'TAKE_TURN', CircularJSON.stringify(DATA.getRoom(roomID)));
};

// Commands.buildRoad("Emol","123",[1, 2]);
// Commands.buildRoad("Emol", "123", [2, 3]);
Commands.buildSettlement( match.currentPlayer, "123", {'position': 14});
endTurn( match.currentPlayer, "123");

_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("1");
    }
});

Commands.buildSettlement(match.currentPlayer, "123", {'position': 26});
Commands.upgradeToCity( match.currentPlayer, "123", {'position': 26});
endTurn( match.currentPlayer, "123");
_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("2");
    }
});

Commands.buildSettlement( match.currentPlayer, "123", {'position': 16});
endTurn( match.currentPlayer, "123");
_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("3");
    }
});

Commands.buildSettlement(match.currentPlayer, "123", {'position': 37});
_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("4.2");
    }
});
Commands.upgradeToCity( match.currentPlayer, "123", {'position': 37});
_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("4.1");
    }
});
endTurn( match.currentPlayer, "123");
Commands.buildSettlement( match.currentPlayer, "123", {'position': 1});
endTurn( match.currentPlayer, "123");
_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("4");
    }
});
Commands.buildSettlement(match.currentPlayer, "123", {'position': 2});
Commands.upgradeToCity( match.currentPlayer, "123", {'position': 2});
endTurn( match.currentPlayer, "123");

_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("5");
    }
});
Commands.buildSettlement( match.currentPlayer, "123", {'position': 4});
endTurn( match.currentPlayer, "123");

_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("6");
    }
});
Commands.buildSettlement(match.currentPlayer, "123", {'position': 7});
Commands.upgradeToCity( match.currentPlayer, "123", {'position': 7});
endTurn( match.currentPlayer, "123");
_.forEach(match.players, function (player) {
    if (player.resourcesAndCommodities.hasOwnProperty('undefined')){
        console.log("yii");
    }
});

/*
Commands.buildSettlement("Yuan", "123", {'position': 27});
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
Commands.rollDice("Yuan","123");
console.log("Test is being run");
// player.getEmptyAdjacentVertices(player, 1, data.getMatch("123"));
*/

var addInfiniteResources = function(resources){
    Object.kes(resources).forEach(res => {
        resources[res] = 99;
    });
}


/*
 - You cannot trade when you don't have resources
 */

var progressCardsTest = function(){
    Match.createNewMatch();
    console.log("Testing: Progress Cards");
    let roomID = '123';
    console.log(data.getMatch(roomID));
   //addInfiniteResources(data.getPlayer('Max').resourcesAndCommodities);


    Commands.drawOneProgressCard('Max', roomID, {'kind': 'Trade'});
    Commands.executeProgressCard('Max', roomID, {'cardname': 'CommercialHarbor'});
    Commands.requestTrade('Max', roomID, {'selling': {'Lumber': 1}, 'buying': null, 'targetPlayer':'Emol'});
};

progressCardsTest();



/*
// Commands.stealCard("Emol", "123", {'victim': "Yuan"});
// DATA.getMatch().players[]
Commands.giveAwayBoot("Emol", "123", {transferTo: "Yuan"});

Commands.buildShip("Emol", "123", [53, 54]);
Commands.moveShip("Emol", "123", {'oldPosition':[53, 54], 'newPosition':[1,2]});
Commands.buildSettlement("Emol", "123", {'position': 1});
Commands.upgradeToCity("Emol", "123", {'position': 1});
Commands.buildSettlement("Yuan", "123", {'position': 3});
Commands.buildSettlement("Emol", "123", {'position': 10});


// console.log("spend fish");
// data.getMatch("123").getPlayer("Emol").setFishSum(20);
// console.log(data.getMatch("123").getPlayer("Emol").fishSum);
// console.log(data.getMatch("123").getPlayer("Emol").progressCards);
Commands.drawOneProgressCard("Emol","123",{'kind':"Trade"});
Commands.spendFishToken("Emol","123",{'action' : "MOVE_ROBBER"});
// console.log(data.getMatch("123").fish);
// console.log(data.getMatch("123").getPlayer("Emol").progressCards);
// console.log(data.getMatch("123").getPlayer("Emol").fishSum);

//Commands.drawOneProgressCard("Emol","123",{'kind': "Trade"});

Commands.buyCityImprovement("Yuan","123",{'cityImprovementCategory' : Enum.cityImprovementCategory.Trade});
Commands.buyCityImprovement("Yuan","123",{'cityImprovementCategory' : Enum.cityImprovementCategory.Trade});
Commands.buyCityImprovement("Yuan","123",{'cityImprovementCategory' : Enum.cityImprovementCategory.Trade});
Commands.buyCityImprovement("Yuan","123",{'cityImprovementCategory' : Enum.cityImprovementCategory.Trade});
//console.log(data.getMatch("123").getMetropolisOwner(Enum.cityImprovementCategory.Science));
//console.log(data.getMatch("123").Metropolis);
Commands.drawOneProgressCard("Yuan","123",{'kind' : "Trade"});
// let player = data.getMatch("123").getPlayer("Yuan");
// console.log(?player.progressCards);
Commands.rollDice("Emol","123","");
// console.log("red die " + data.getMatch("123").dice.redDie);
// console.log("event die" + data.getMatch("123").dice.eventDie);
// console.log(player.progr?essCards);
// Commands.hireKnight("Emol","123",7);
// Commands.activateKnight("Emol","123",7);
// Commands.hireKnight("Max","123",7);
// Commands.moveRobber("Emol","123",7);
Commands.hireKnight("Emol","123",{'position': 7});
Commands.activateKnight("Emol","123",{'position': 7});
Commands.hireKnight("Max","123",{'position': 1});
// Commands.moveRobber("Emol","123",7);
Commands.buildRoad("Emol","123",[1, 2]);
Commands.buildRoad("Emol", "123", [2, 3]);

// Commands.activateKnight("Max","123",7);

// fakeRoom.room = data.getRoom("123");
//TODO test barbarian applyResult + robber produce resource from bank
//
Commands.rollDice("Emol","123");
// Commands.rollDice("Emol","123");
// Commands.rollDice("Emol","123");
// Commands.rollDice("Emol","123");
// Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
/**Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");
Commands.rollDice("Emol","123");

Commands.rollDice("Emol","123");**/
//barbarian
// console.log("dice result" + data.getMatch("123").dice.eventDie);
// data.getMatch("123").barbarian.canMove(data.getMatch("123").dice.eventDie);
// console.log(match.barbarian.getAttackResult(players));
// console.log("barbarian curPos " + match.barbarian.getCurrentPosition());
////console.log(match.barbarian.getAttackResult(my.players));
// console.log(match.barbarian.applyResult(my.players));
// console.log(match.barbarian.getPlayerContribution());

// console.log(player1.resourceCardTotalNum());
//Commands.buildSettlement("Emol","123",{'position' : 4}); //hextile2
//Commands.moveRobber("Emol", "123", {'oldHexID' : null, 'newHexID' : 2});
// console.log(myHex2.productionNum);





/**
console.log(player1.resourceCardTotalNum());
//check map distribute resourcesAndCommodities


/*
CommandCheck.moveRobber = function(oldHexID,newHexID){
}
console.log(
  CommandCheck.moveRobber(2,1)
);
*/
/*
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
console.log(player1.getFishSum());
console.log("fish sum " + player1.getFishSum());

//test these commands - work :)
//console.log("random fish: " + player1.drawRandomFish());
//console.log("random fish no boot: " + player1.drawRandomFishNoBoot());
Commands.drawOneProgressCard("Emol","123",{'progCard' : "HELLO"});

console.log(player1.progressCards);
//Commands.spendFishToken("Emol","123",{'action' : Enum.fishEvent.MOVE_ROBBER, 'oldHexID' : 1, 'newHexID' : 2});
Commands.spendFishToken("Emol","123",{'action' : Enum.fishEvent.BUILD_ROAD, 'data' : [39,40]});
console.log(player1.progressCards);
console.log(player1.roads);
*/



//robber
//move test - working
// console.log(match.map.getHexTileById(2).blockedByRobber);
Commands.moveRobber("Emol", "123", {'oldHexID' : null, 'newHexID' : 2});
// console.log(match.map.getHexTileById(2).blockedByRobber);
Commands.moveRobber("Emol", "123", {'oldHexID' : 2, 'newHexID' : 1});
// console.log(match.map.getHexTileById(2).blockedByRobber);
// console.log(match.map.getHexTileById(1).blockedByRobber);

//get stealFrom - working
Commands.buildSettlement("Max", "123", 3);
Commands.buildSettlement("Yuan", "123", 11);
// let p = myHex1.getPlayersAroundByBuildings(my);
// let steal = my.robber.stealFrom(myHex1, my);
// for(var i in steal){
//   console.log(steal[i].name);
// }
//

//steal card - working : Error -1 grain
// console.log(player1.resourceCardTotalNum());
// Commands.stealCard("Emol", "123", {'thief' : "Emol", 'victim' : "Yuan"});
// console.log(player1.resourceCardTotalNum());

//hasToDiscardCards - test player > 7

//player2
//Commands.moveRobber("Emol", "123", {'oldHexID' : 1, 'newHexID' : 2});
Commands.buildSettlement("Yuan", "123", {'position': 4});
Commands.moveRobber("Emol", "123", {'oldHexID' : 2, 'newHexID' : 1});
// console.log("myhex1 " + myHex1.productionNum);
// console.log("myhex2 " + myHex2.productionNum);
// console.log("myHex1 blocked " + myHex1.blockedByRobber);
// console.log("myHex2 blocked " + myHex2.blockedByRobber);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
// myHex2.produceResource(match);
Commands.buildCityWall("Yuan", "123", {'position': 4});
//player1
// console.log(match.map.getHexTileById(2).blockedByRobber);
// console.log("total cards player 2 : " + player2.resourceCardTotalNum());
// console.log("# to be discarded " + player2.discardedCardsCnt());
// console.log(my.robber.hasToDiscardCards(players));
// */


// drawOneProgressCard - woking
Commands.drawOneProgressCard("Emol","123",{'progCard' : "sdjiosjdojao"});
// console.log(player1.progressCards);
// */

//produceResource
//TODO MOVE SHIP IN COMMANDS !!!!!!!!!!! BARBARIAN IN DICE!!!!!!!!!!
//pirate
//move pirate from 1 to 2
/*
let myHex3 = my.getHexTileById(10);
let myHex4 = my.getHexTileById(17);
*/
//Commands.buildShip("Emol", "123", [53, 54]);
//Commands.movePirate("Emol", "123", {'oldHexID' : 10 , 'newHexID' : 17})
// console.log("pirate removed: blocked :" + myHex3.blockedByPirate);
// console.log("pirate placed :blocked:" + myHex4.blockedByPirate);


// TODO check this:
// */
//Commands.buildShip("Yuan", "123", [52,53]);
// Commands.moveShip("Emol", "123", {'oldPosition': [21,22], 'newPosition' :[37,38]});
// Commands.moveShip("Yuan", "123", {'oldPosition': [51,52], 'newPosition' :[36,51]});
// console.log(player2.ships);

//move away - assume hexid 0 = off the board
// Commands.movePirate("Emol", "123", {'oldHexID' : 17 , 'newHexID' : null});
// console.log("now move away : blocked :" + myHex4.blockedByRobber);

//get stealable player list - working
//Commands.buildShip("Emol", "123", [21,22]);
//Commands.buildShip("Yuan", "123", [51,52]);
/*
//let p = myHex1.getPlayersAroundByBuildings(my);
//get stealable player list - working
let steal = my.pirate.stealFrom(myHex4, my);
for(var i in steal){
  console.log(steal[i].name);
}
*/


/*
//TODO fix this: cityImprovement - not working when city improvemet level is < 4
player1.buyCityImprovement("Trade");
player1.buyCityImprovement("Trade");
player1.buyCityImprovement("Trade"); //player 1 has cityimprovemnt level 4 now
player2.buyCityImprovement("Trade");
player2.buyCityImprovement("Trade"); //player 2 has cityimprovemnt level 5 now
//player2.buyCityImprovement("Trade");
//player2.buyCityImprovement("Trade");
var player = match.distributeMetropolis("Trade");
//console.log("player has trade metropolis" + player);

//fishermen
//commands: giveAwayBoat, moveRobber, buildRoad, buildShip
/*allocating fish token when red+yellow dice = lake number token / player has a settlement/city on fish hex
player.drawRandomFish();
*/
/*
//TODO test buildroad, buildship
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
console.log(player1.getFishSum());
console.log("here " + player1.getFishSum());

//test these commands - work :)
console.log("random fish: " + player1.drawRandomFish());
console.log("random fish no boot: " + player1.drawRandomFishNoBoot());

Commands.spendFishToken("Emol","123",{'action' : Enum.fishEvent.DRAW_PROG, 'data' : "SHUI", 'match' : match})
//Commands.spendFishToken("Emol","123",Enum.fishEvent.DRAW_PROG,"SHUI");
console.log(player1.progressCards);
/*
//progress cards
//draw one progress card
player1.drawOneProgressCard("111");
player1.drawOneProgressCard("222");
player1.drawOneProgressCard("333");
console.log(player1.progressCards);
console.log(player1.progressCardsCnt);
//discard multiple progress cards
let discard = ["111","222"];
player1.discardProgressCards(discard);
console.log(player1.progressCards);
console.log(player1.progressCardsCnt);
*/
/**

Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
**/
/**
Commands.buyCityImprovement("Emol", '123', 'trade');
Commands.moveShip('123', [53, 54], [1, 2]);
Commands.chooseCityToBePillaged('123', 6);

Commands.hireKnight('Emol', '123', 4);
Commands.activateKnight('123', 4);
Commands.moveKnight('123', 4, 5);
Commands.chaseAwayThief('123', 5, 1, 3);
**/