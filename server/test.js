/**
 * Created by emol on 2/17/17.
 */
"use strict"
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

Commands.startGame("123");
let map = data.getMatch("123").map;
console.log(map.getHexTileByEdge([2,3]));
Commands.buildRoad("Emol", "123", [53, 54]);
Commands.buildShip("Emol", "123", [53, 54]);
Commands.buildSettlement("Emol", "123", 6);
Commands.buildSettlement("Emol", "123", 7);
Commands.buildSettlement("Emol", "123", 8);
Commands.buildSettlement("Emol", "123", 9);
Commands.upgradeToCity("Emol", "123", 7);

data.getMatch("123").barbarian.getStrength(data.getMatch("123").players));
data.getMatch("123").barbarian.applyResult(data.getMatch("123").players));

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
console.log("fsdf");
