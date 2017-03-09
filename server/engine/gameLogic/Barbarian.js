let Barbarian = module.exports = {};
let Dice = require('./Dice.js');
let Player = require('./Player.js');
let Enum = require('./Enum.js');
//barbarian strength = total # of cities.

//Array<Player>
Barbarian.createBarbarian = function(){
  let barbarian = {};

  barbarian.curPos = 0;
  barbarian.playerContribution = [];
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
    barbarian.playerContribution = [];
    barbarian.win = false;
  }

  barbarian.getCurrentPosition = function(){
    return barbarian.curPos;
  }

  barbarian.toAttack = function(){
    if(barbarian.curPos === 7)
      return true;
    else
      return false;
  }

  barbarian.getStrength = function(players){
    var strength = 0;
    for(var i in players){
      barbarian.strength += players[i].getCityCnt();
    }
    return strength;
  }


  /**
   *
   * @return {true} if barbarian won, false otherwise.
   */
  barbarian.getAttackResult = function(players){
    var catanStrength = 0;
    var result = {};

    for(var i in players){
      catanStrength += players[i].getKnightsSum();
      barbarian.playerContribution.push(players[i].getKnightsSum());
    }
    //return the result
    if(catanStrength < barbarian.getStrength(players)){
      barbarian.win = true;
    }
    return barbarian.win;
  }

  /**
   *
   * @return {result:[Enum.BarbarianResult], toPlayers:Array{players}}
   */
  //NOTE! player.buildings  player.buildings = {};  //key: position (vertex index / int); value: building object
  barbarian.applyResult = function(players){
    var catanStrength = 0;
    var fewest;
    var most;
    var applyOn = [];

    if(barbarian.toAttack() == false){
      return -1;
    }
    /*
    for(var i in players){
      //restart
      if(players[i].getDefenderOfCatan == true){
        players[i].setDefenderOfCatan(false);
      }
      if(players[i].getCityCnt() > 0){
        //push it to hasCity!! TODO
        hasCity.push(players[i]); //for later pillage if catan loses.
      }
    }
    */

    /*
    if barbarian win :
    player with the fewest active knights:
    1. if only 1 settlement -> won't lose anything
    2. metropolis???
     https://boardgamegeek.com/thread/405470/simple-rule-question-about-metropolis
    3. if player has at least one city on the map
      a.player / tie players who barbarian.playerContribution the least value of kinghts
        -> city reduces to a settlement (destroy city wall if has one on it)
      c.extreme case: no player activated a knight - all lose a city
      d.extreme case: no player activated a knight and no cities on the map - do nothing
      city wall of that city being reduced is also gone.
    */

    if(barbarian.win == true){
      //barbarian stronger
      console.log(barbarian.playerContribution);
      var min = Math.min(...barbarian.playerContribution);
      console.log("min is " + min);
      for(var i in barbarian.playerContribution){
        if(barbarian.playerContribution[i] == min && players[i].getCityCnt() > 0){
          applyOn.push(players[i].name);
          //CLIENTSIDE let player to choose which city he wants to pillage.
          //city reduces to a settlement
          //destroy the city wall if any
          let cities = players[i].getCities();
          console.log("need to be pillage" + cities[0]);
          cities[0].pillage();
          //console.log(cities);
          return {result:[Enum.BarbarianResult.LOSE], toPlayers:addOn};
        }
      }
    }
    else{
      /*player with most knight points gets defender of catan - 1 VP
      if TIE: each player gets one progress card of their choice //how
      */
      //barbarian.win = false;
      var max = Math.max(...barbarian.playerContribution);
      console.log("max is " + max);
      var tie = []; //store the index of tied players.
      var counter = -1;
      for(var i in barbarian.playerContribution){
        if(barbarian.playerContribution[i] == max){
          applyOn.push(barbarian.playerContribution[i]);
          counter++;
          tie.push(i);
        }
      }

      //TIE
      if(counter > 0){
        for(var i = 0; i < tie.length; i++){
          //TODO
          //console.log("tie players" + players[tie[i]].name);
          //tie, each player can get a progress card of their choice.
          //players[tie[i]].getProgressCard
          return {result:[Enum.BarbarianResult.WIN_TIE], toPlayers:applyOn};
        }
      }
      else if (counter == 0){
        players[tie[0]].setDefenderOfCatan(true);
        //console.log("defender of catan "+players[tie[0]].name);
        //defender of catan
          return {result:[Enum.BarbarianResult.WIN], toPlayers:applyOn};
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
4. win 1 player barbarian.playerContributiond the most - defender of catan
5. win:tie  2 players barbarian.playerContributiond the most - tie -each choose a progress card (player's choice)

*/
