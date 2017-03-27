let Barbarian = module.exports = {};
let Dice = require('./Dice.js');
let Player = require('./Player.js');
let Enum = require('./Enum.js');
//barbarian strength = total # of cities.

//Array<Player>
Barbarian.createBarbarian = function(){
  let barbarian = {};

  barbarian.curPos = 0;
  barbarian.playerContribution = {};
  barbarian.win = false;
  barbarian.result = null;

  barbarian.canMove = function(eventDie){
    if(eventDie === "Ship"){
      barbarian.curPos++;
      return true;
    }
    return false;
  }

  barbarian.init = function(){
    barbarian.curPos = 0;
    barbarian.playerContribution = {};
    barbarian.win = false;
    barbarian.result = null;
  }

  barbarian.getCurrentPosition = function(){
    return barbarian.curPos;
  }

  barbarian.toAttack = function(){
    if(barbarian.curPos === 7){
        return true;
    }
    else
      return false;
  }

  barbarian.getStrength = function(players){
    var strength = 0;
    for(var i in players){
      strength += players[i].getCityCnt();
    }
    return strength;
  }

  /**
   *
   * @return {true} if barbarian won, false otherwise.
   */
  barbarian.getAttackResult = function(players){
    var catanStrength = 0;
    var result = [];

    for(var i in players){
      players[i].setDefenderOfCatan(false);
      catanStrength += players[i].getKnightsSum();
      var playerName = players[i].name;
      barbarian.playerContribution[playerName] = players[i].getKnightsSum();
    }
    //return the result
    if(catanStrength < barbarian.getStrength(players)){
      barbarian.win = true;
    }
    //console.log(barbarian.playerContribution);
    return barbarian.win;
  };

  barbarian.getPlayerContribution = function(){
    return barbarian.playerContribution;
  }

  /**
   *
   * @return {result:[Enum.BarbarianResult], toPlayers:Array{playerName}
   */
  //NOTE! player.buildings  player.buildings = {};  //key: position (vertex index / int); value: building object
  barbarian.applyResult = function(players){

    var catanStrength = 0;
    var fewest;
    var most;
    var affectedPlayers = [];
    var state = barbarian.getAttackResult(players);
/*
    if(barbarian.toAttack() == false){
      return -1;
    }
*/
    let contribution = Object.keys(barbarian.playerContribution).map(function(knights){
      return barbarian.playerContribution[knights]
    });

    if(state == true){
      //barbarian stronger
      //console.log(barbarian.playerContribution);

      var min = Math.min(...contribution);
      //console.log("min is " + min);
      for(var i in barbarian.playerContribution ){
      //  console.log("player name " + players[i].name);
      //  console.log("player is " + players[i].getCityCnt());
        if(barbarian.playerContribution[i] == min && players[i].getCityCnt() > 0){
          affectedPlayers.push(i);
          //CLIENTSIDE let player to choose which city he wants to pillage.
          //city reduces to a settlement
          //destroy the city wall if any
          /*
          let cities = players[i].getCities();
          console.log("need to be pillage" + cities[0]);
          cities[0].pillage();
          */
          return {result:[Enum.BarbarianResult.CATAN_LOSE], toPlayers:affectedPlayers};
        }
      }
    }
    else{
      /*player with most knight points gets defender of catan - 1 VP
      if TIE: each player gets one progress card of their choice //how
      */
      //barbarian.win = false;
      var max = Math.max(...contribution);
    //  console.log("max is " + max);

      var tie = []; //store the index of tied players.
      var counter = -1;
      for(var i in barbarian.playerContribution){
        if(barbarian.playerContribution[i] == max){
          affectedPlayers.push(i);
          counter++;
          tie.push(i);
        }
      }
    //  console.log("counter is "+ counter);

      //TIE
      if(counter > 0){
        for(var i = 0; i < tie.length; i++){
          //console.log("tie players" + players[tie[i]].name);
          //tie, each player can get a progress card of their choice.
          //players[tie[i]].getProgressCard
          return {result:[Enum.BarbarianResult.CATAN_WIN_TIE], toPlayers:affectedPlayers};
        }
      }
      else if (counter == 0){
        //players[tie[0]].setDefenderOfCatan(true);
        //console.log("defender of catan "+players[tie[0]].name);
        //defender of catan
          return {result:[Enum.BarbarianResult.CATAN_WIN], toPlayers:affectedPlayers};
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
  }
  //restart barbarian
  barbarian.restart = function(){
    barbarian.init();
  }
  /*
  if barbarian win :
  player with the fewest active knights:
  1. if only 1 settlement -> won't lose anything
  2. if city has a metropolis on top -> can't be pillaged.
   https://boardgamegeek.com/thread/405470/simple-rule-question-about-metropolis
  3. if player has at least one city on the map
    a.player / tie players who barbarian.playerContribution the least value of kinghts
      -> city reduces to a settlement (destroy city wall if has one on it)
    c.extreme case: no player activated a knight - all lose a city
    d.extreme case: no player activated a knight and no cities on the map - do nothing
    city wall of that city being reduced is also gone.
  */

  barbarian.CatanWin = function(players){
    //get player by players.name
    if(players.length == 1){
      player[0].setDefenderOfCatan(true);
      return true;
    }
    return false;
  }

  barbarian.CatanWinDuplicate = function(player, vertex){

  }

  barbarian.CatanLose = function(){

  }

  return barbarian;
}

/*
var barbarian = new Barbarian.createBarbarian();
var dice = new Dice.createDice();
dice.eventDie = "Ship";
for(var i=0;i<7;i++){
  barbarian.toMove(dice);
  //console.log("barbarian to move: " + barbarian.toMove(dice));
}

cases:
lose: active knights < # of cities
win: active knights >= # of cities
2. win - no active knights on board & no city. each pick one 1 progress card
3. lose - no active knights on board & have cities - all players have one city to be pillaged.
4. win 1 player barbarian.playerContributiond the most - defender of catan
5. win:tie  2 players barbarian.playerContributiond the most - tie -each choose a progress card (player's choice)

*/
