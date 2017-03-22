/**
 * Created by emol on 2/17/17.
 */
"use strict"

let fakeRoom = module.exports = {};
let Commands = require("./engine/Commands.js");
let User = require("./engine/gameLogic/User.js");
let data = require("./engine/Data.js");
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
Commands.joinRoom(userD, "123");

Commands.startGame("123");
//console.log(map.getHexTileByEdge([2,3]));
Commands.buildRoad("Emol", "123", [53, 54]);
Commands.buildShip("Emol", "123", [54, 55]);
Commands.buildSettlement("Emol", "123", {'position': 1});
Commands.upgradeToCity("Emol", "123", {'position': 1});

Commands.hireKnight("Emol","123",7);
Commands.activateKnight("Emol","123",7);
Commands.hireKnight("Max","123",7);
//Commands.activateKnight("Max","123",7);




/*
//barbarian
let my = data.getMatch("123");
data.getMatch("123").barbarian.toMove(data.getMatch("123").dice);
my.barbarian.toMove(data.getMatch("123").dice);
my.barbarian.toMove(data.getMatch("123").dice);
let barStrength = data.getMatch("123").barbarian.getStrength(data.getMatch("123").players);
*/

//robber

/*
//move robber from 1 to 2
my.robber.moveTo(myHex1,myHex2);

//move away
my.robber.moveAway();

//TODO: test hasToDiscardCards, stealFrom
//!!!!not working - steable player list
*/
//???? steal card from player
//Commands.stealCard("Emol", "Max", "123");

//TODO: test hasToDiscardCards, stealFrom
//!!!!not working - steable player list

Commands.buildSettlement("Max", "123", 3);
Commands.buildSettlement("Yuan", "123", 11);
//let steal = my.robber.stealFrom(myHex2, my);


//produceResource
let player1 = data.getMatch("123").getPlayer("Emol");
let player2 = data.getMatch("123").getPlayer("Yuan");

//pirate
//TODO test stealFrom, applyAction

//fishermen
//commands: giveAwayBoat, moveRobber, movePirate, drawOneProgressCard, buildRoad, buildShip, tradeWithBank(special ver)
/*allocating fish token when red+yellow dice = lake number token / player has a settlement/city on fish hex
player.drawRandomFish();
*/

Commands.stealCard("Emol","Yuan","123");

//progress cards
//draw one progress card
player1.drawOneProgressCard("111");
player1.drawOneProgressCard("222");
player1.drawOneProgressCard("333");
//discard multiple progress cards
let discard = ["111","222"];
player1.discardProgressCards(discard);

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
fakeRoom.room = data.getRoom("123");