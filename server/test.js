/**
 * Created by emol on 2/17/17.
 */
"use strict"
let Commands = require("./engine/Commands.js");
let User = require("./engine/gameLogic/User.js");
let data = require("./engine/Data.js");
let Enum = require("./engine/gameLogic/Enum.js");
/**
let rooms = data.rooms;
let users = data.users;
let match = data.matches;
**/
let user_A = {username :  "Emol"};
let user_B = {username :  "Max"};
let user_C = {username :  "Cheryl"};
let user_D = {username :  "Yuan"};
let userA = User.createUser(user_A);
let userB = User.createUser(user_B);
let userC = User.createUser(user_C);
let userD = User.createUser(user_D);

Commands.makeNewRoom(user_D, "123");
Commands.joinRoom(userA, "123");
Commands.joinRoom(userB, "123");
Commands.joinRoom(userC, "123");

Commands.startGame("123");
let map2 = data.getMatch("123").map;
//console.log(map.getHexTileByEdge([2,3]));
Commands.buildRoad("Emol", "123", [53, 54]);
Commands.buildShip("Emol", "123", [53, 54]);
Commands.buildSettlement("Emol", "123", {'position': 1});
Commands.upgradeToCity("Emol", "123", {'position': 1});

Commands.hireKnight("Emol","123",7);
Commands.activateKnight("Emol","123",7);
Commands.hireKnight("Max","123",7);
//Commands.activateKnight("Max","123",7);

let my = data.getMatch("123").map;
let match = data.getMatch("123");
let myHex1 = my.getHexTileById(1);
let myHex2 = my.getHexTileById(2);
let player1 = data.getMatch("123").getPlayer("Emol");
let player2 = data.getMatch("123").getPlayer("Yuan");
let players = data.getMatch("123").players;
/*
//barbarian
let my = data.getMatch("123");
data.getMatch("123").barbarian.toMove(data.getMatch("123").dice.eventDie);
console.log(data.getMatch("123").getPlayer("Emol").getKnightsSum());
my.barbarian.toMove(data.getMatch("123").dice);
my.barbarian.toMove(data.getMatch("123").dice);
console.log("barbarian curPos " + my.barbarian.getCurrentPosition());
let barStrength = data.getMatch("123").barbarian.getStrength(data.getMatch("123").players);
console.log(my.barbarian.getAttackResult(my.players));
console.log(my.barbarian.applyResult(my.players));
console.log(my.barbarian.getPlayerContribution());
*/

/* robber test done
//robber
//move robber from 1 to 2
my.robber.moveTo(myHex1,myHex2);
console.log("robber removed: blocked :" + myHex1.blockedByRobber);
console.log("robber placed :blocked:" + myHex2.blockedByRobber);

//move away - assume hexid 0 = off the board
my.robber.moveAway();
console.log("now move away : blocked :" + myHex2.blockedByRobber);

//get stealable player list
Commands.buildSettlement("Max", "123", 3);
Commands.buildSettlement("Yuan", "123", 11);
//let p = myHex1.getPlayersAroundByBuildings(my);
let steal = my.robber.stealFrom(myHex1, my);
for(var i in steal){
  console.log(steal[i].name);
}

//hasToDiscardCards - test player > 7
myHex1.produceResource(my);
myHex1.produceResource(my);
myHex1.produceResource(my);
myHex1.produceResource(my);
myHex1.produceResource(my);
myHex1.produceResource(my);
console.log(player1.resourcesAndCommodities);
console.log("total cards " + player1.resourceCardTotalNum());
console.log("# to be discarded " + player1.discardedCardsCnt());
console.log(my.robber.hasToDiscardCards(players));

//discard resource cards - working
console.log(player1.resourceCardTotalNum());
console.log(player1.resourcesAndCommodities);
var ds = {[Enum.Resource.Lumber] : 0, [Enum.Resource.Brick] : 0, [Enum.Resource.Grain]: 0, [Enum.Resource.Ore]: 0, [Enum.Resource.Wool]:0, [Enum.Resource.Gold]: 1, [Enum.Commodity.Cloth]: 0, [Enum.Commodity.Coin]: 0, [Enum.Commodity.Paper]: 0};
player1.discardResourceCards(ds);
console.log(player1.resourcesAndCommodities);
console.log(player1.resourceCardTotalNum());
*/

//produceResource
//TODO MOVE SHIP IN COMMANDS !!!!!!!!!!! BARBARIAN IN DICE!!!!!!!!!!
//pirate
//move pirate from 1 to 2
let myHex3 = my.getHexTileById(21);
let myHex4 = my.getHexTileById(27);
my.pirate.moveTo(myHex3,myHex4);
console.log("pirate removed: blocked :" + myHex3.blockedByPirate);
console.log("pirate placed :blocked:" + myHex4.blockedByPirate);
//move away - assume hexid 0 = off the board
my.pirate.moveAway();
console.log("now move away : blocked :" + myHex4.blockedByRobber);
//get stealable player list
//TODO HERE

Commands.buildShip("Max", "123", [44,45]);
console.log(my.getEdgeInfo([44,45]));
Commands.buildShip("Yuan", "123", [72,73]);
//let p = myHex1.getPlayersAroundByBuildings(my);
let steal = my.pirate.stealFrom(myHex1, my);
for(var i in steal){
  console.log(steal[i].name);
}


Commands.buildShip("Yuan", "123", [72,73]);
Commands.moveShip("Yuan", "123", {'oldPosition': [72,73], 'newPosition' :[71,72]});

//Commands.moveShip = function (userName, roomID, data)
Commands.moveShip("Emol", "123", [44,45]);
//Error: Map.js 494: return edge[0] + '-' edge[1]; -> cannot read property '0' of undefined

//TODO test apply action


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
//TODO test buildroad, buildship
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
player1.drawRandomFishNoBoot();
console.log(player1.getFishSum());
console.log("here " + player1.getFishSum());

/*
//test these commands - work :)
console.log("random fish: " + player1.drawRandomFish());
console.log("random fish no boot: " + player1.drawRandomFishNoBoot());
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

Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");
Commands.rollDice("Emol", "123");

/**
Commands.buyCityImprovement("Emol", '123', 'trade');
Commands.moveShip('123', [53, 54], [1, 2]);
Commands.chooseCityToBePillaged('123', 6);

Commands.hireKnight('Emol', '123', 4);
Commands.activateKnight('123', 4);
Commands.moveKnight('123', 4, 5);
Commands.chaseAwayThief('123', 5, 1, 3);
**/
