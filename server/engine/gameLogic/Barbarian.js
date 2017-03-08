let Barbarian = module.exports = {};
let Dice = require('./Dice.js');
let Player = require('./Player.js');
let Knight = require('./Knight.js');
let Building = require('./Building.js');
let Scenario = require('./Scenario.js');
let Map = require('./Map.js');

//barbarian strength = total # of cities.

//Array<Player>
Barbarian.createBarbarian = function(){
  let barbarian = {};

  barbarian.curPos = 0;
  barbarian.strength = 0;
  barbarian.toAttack = false;
  barbarian.win = false;

  barbarian.toMove = function(dice){
    if(dice.eventDie === "Ship"){
      barbarian.curPos++;
      return true;
    }
    return false;
  }

  barbarian.init = function(){
    barbarian.curPos = 0;
    barbarian.strength = 0;
    barbarian.attack = false;
    barbarian.win = false;
  }
  //0,1,2,3,
  barbarian.getCurrentPosition = function(){
    return barbarian.curPos;
  }

  barbarian.toAttack = function(){
    if(barbarian.curPos === 7)
      barbarian.attack = true;
    return barbarian.attack;
  }

  barbarian.getStrength = function(players){
    for(var i in players){
      //check rules , city wall? metropolis?
      //count the # of cities each player has = barbarian.strength
      //console.log("player strength " + players[i].getCitySum());
      barbarian.strength += players[i].getCitySum();
      //barbarian.strength += players[i].citySum;
    }
    return barbarian.strength;
  }

  barbarian.attackResult = function(players){
    var catanStrength = 0;
    var contribute = [];
    var hasCity = [] //store player object.

    if(barbarian.toAttack() == false){
      return -1;
    }

    for(var i in players){
      catanStrength += players[i].getKnightsSum();
      contribute.push(players[i].getKnightsSum());
      //restart
      if(players[i].getDefenderOfCatan == true){
        players[i].setDefenderOfCatan(false);
      }
      if(players[i].getCitySum() > 0){
        hasCity.push(players[i]); //for later pillage if catan loses.
      }
    }
    //return the result
    if(catanStrength < barbarian.getStrength(players)){
      barbarian.win = true;
    }
    else {
      barbarian.win = false;
    }
    return barbarian.win;
  }

  //return true if barbarian won
  //NOTE! player.buildings  player.buildings = {};  //key: position (vertex index / int); value: building object
  barbarian.getResult = function(players){
    var catanStrength = 0;
    var contribute = [];
    var hasCity = [];
    var fewest;
    var most;

    if(barbarian.toAttack() == false){
      return -1;
    }

    for(var i in players){
      catanStrength += players[i].getKnightsSum();
      contribute.push(players[i].getKnightsSum());
      //restart
      if(players[i].getDefenderOfCatan == true){
        players[i].setDefenderOfCatan(false);
      }
      if(players[i].getCitySum() > 0){
        //push it to hasCity!! TODO
        hasCity.push(players[i]); //for later pillage if catan loses.
      }
    }

    console.log("catan " + catanStrength);
    console.log("bar " +barbarian.getStrength(players));
    /*
    if barbarian win :
    player with the fewest active knights:
    1. if only 1 settlement -> won't lose anything
    2. metropolis???
     https://boardgamegeek.com/thread/405470/simple-rule-question-about-metropolis
    3. if player has at least one city on the map
      a.player / tie players who contribute the least value of kinghts
        -> city reduces to a settlement (destroy city wall if has one on it)
      c.extreme case: no player activated a knight - all lose a city
      d.extreme case: no player activated a knight and no cities on the map - do nothing
      city wall of that city being reduced is also gone.
    */
    if(catanStrength < barbarian.getStrength(players)){
      barbarian.win = true;
      //barbarian stronger
      console.log(contribute);
      //TODO change this!!! only push player if he >= 1 cities..
      //change contribute to hasCity {}
      var min = Math.min(...contribute);
      console.log("min is " + min);
      for(var i in contribute){
        if(contribute[i] == min && players[i].getCitySum() > 0){
          let cities = players[i].getCities();
          console.log()
          console.log("need to be pillage" + cities[0]);
          //TODO check pillage
          //do player chooose which city to be pillaged?
            cities[0].pillage();
            //city reduces to a settlement
            //destroy the city wall if any
            //console.log(cities);
        }
      }
    }
    else{ //catanStrength >= barbarian.strength;
      /*player with most knight points gets defender of catan - 1 VP
      if TIE: each player gets one progress card of their choice //how
      */
      barbarian.win = false;
      var max = Math.max(...contribute);
      console.log("max is " + max);
      var tie = []; //store the index of tied players.
      var counter = -1;
      for(var i in contribute){
        if(contribute[i] == max){
          counter++;
          tie.push(i);
        }
      }

      //console.log("is tie" + counter);
      //TIE
      if(counter > 0){
        for(var i = 0; i < tie.length; i++){
          //console.log("tie players" + players[tie[i]].name);
          //TODO
          //tie, each player can get a progress card of their choice.
          //players[tie[i]].getProgressCard
        }
      }
      else if (counter == 0){
        players[tie[0]].setDefenderOfCatan(true);
        //console.log("defender of catan "+players[tie[0]].name);
        //defender of catan
      }
      else {
        console.log("Error. ")
        //error
      }
    }
      //deactive all knights
      for(var i in players){
        if(players[i].getKnightsSum() > 0){
          //deactive knights
          console.log("deactive knights");
          for(var knight in players[i].knights){
            players[i].knights[knight].deactivate();
          }
        }
      }
      //done
    return barbarian.win;
  }
  //restart barbarian
  barbarian.restart = function(){
    barbarian.init();
  }

  return barbarian;
}

//tester
var barbarian = new Barbarian.createBarbarian();
var dice = new Dice.createDice();
dice.eventDie = "Ship";
for(var i=0;i<7;i++){
  barbarian.toMove(dice);
  //console.log("barbarian to move: " + barbarian.toMove(dice));
}

/*
cases:
lose: active knights < # of cities
win: active knights >= # of cities
2. win - no active knights on board & no city. each pick one 1 progress card
3. lose - no active knights on board & have cities - all players have one city to be pillaged.
4. win 1 player contributed the most - defender of catan
5. win:tie  2 players contributed the most - tie -each choose a progress card (player's choice)

*/

var map = new Map.createMap();


var player1 = new Player.createPlayer("1");
var player2 = new Player.createPlayer("2");
var player3 = new Player.createPlayer("3");

var addKnights = function(player1){
  var knightlist = [];
  var knight1 = new Knight.createKnight(player1,map);
  var knight2 = new Knight.createKnight(player1,map);
  knight1.activate();
//  knight1.promote();
//  knight2.activate();
  knightlist.push(knight1);
  knightlist.push(knight2);
  player1.knights = knightlist;
  //total strengh should be 3 ;
}
//more knights
var addKnights2 = function(player1){
  var knightlist = [];
  var knight1 = new Knight.createKnight(player1,map);
  var knight2 = new Knight.createKnight(player1,map);
  var knight3 = new Knight.createKnight(player1,map);
  knight1.activate();
  knight1.promote();
  knight2.activate();
  knight2.promote();
  knight3.activate();
  knight3.promote();
  knightlist.push(knight1);
  knightlist.push(knight2);
  knightlist.push(knight3);
  player1.knights = knightlist;
  //total strengh should be 3 ;
}

var addKnights3 = function(player1){
  var knightlist = [];
  var knight1 = new Knight.createKnight(player1,map);
  var knight2 = new Knight.createKnight(player1,map);
  var knight3 = new Knight.createKnight(player1,map);
  knightlist.push(knight1);
  knightlist.push(knight2);
  knightlist.push(knight3);
  player1.knights = knightlist;
  //total strengh should be 3 ;
}

//console.log(player1.getKnightsSum());
addKnights(player1);
addKnights(player2);
addKnights(player3);


var addBuildings = function(player1){
  var buildinglist = {};
  var building1 = new Building.buildSettlement(player1,1,map);
  var building2 = new Building.buildSettlement(player1,2,map);
  var building3 = new Building.buildSettlement(player1,3,map);
  var building4 = new Building.buildSettlement(player1,4,map);

//  building1.upgradeToCity();
  building2.upgradeToCity();
  building4.upgradeToCity();

  buildinglist = {1:building1,2:building2,3:building3,4:building4};
  player1.buildings = buildinglist;
}

addBuildings(player1);
addBuildings(player2);
addBuildings(player3);

//var city = player1.getCities();

//console.log(player1.buildings);

var players = [];
players.push(player1);
players.push(player2);
players.push(player3);


/*
player1.printKnightInfo();
player2.printKnightInfo();
player3.printKnightInfo();
player1.printBuildingInfo();
player2.printBuildingInfo();
player3.printBuildingInfo();
*/

//console.log("current pos: "+ barbarian.getCurrentPosition());
//console.log("barbarian to attack  " + barbarian.toAttack() );

console.log("barbarian result: " + barbarian.getResult(players));
//player1.printKnightInfo();
console.log("current position (after barbarian attack)" + barbarian.getCurrentPosition());


/*
player.getCitySum = function(){
  for(var i in player.buildings){
    if(player.buildings[i].level == 2 && player.buildings.hasOwnProperty(i))
      player.citySum++
  }
  return currentPlayer.citySum;
}

player.getKnightsSum = function(){
  for(var i in player.knights){
    if(player.knights[i].active == true){
      player.knightStrengthSum += player.knights[i].level;
      //strength ??? catan ?
    }
  }
  return player.knightStrengthSum;
}
*/
