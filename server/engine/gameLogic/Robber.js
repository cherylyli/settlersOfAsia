let Robber = module.exports = {};

let Map = require('./Map.js');
let HexTile = require('./HexTile.js');
let Player = require('./Player.js');
let Die = require('./Dice.js');

Robber.createRobber = function(){
  let robber = {};
  robber.pos = 0;
  robber.move = false;

  robber.canMove = function(redDie,yellowDie){
    if (redDie + yellowDie == 7){
      robber.move = true;
      //player.rolledSeven = true;
    }
    return robber.move;
  }

  //from, to - 2 land hextiles
  robber.moveTo = function(from,to){
    robber.pos = to;
    //release hextile_from
    /*
    if(robber.move == false)
      return -1;
    */
    robber.move = false;
    //player.rolledSeven = false;
    return robber.pos;
  }

  robber.hasToDiscardCards = function(players){
    // if players has more than 7 cards, discard half (round down)
    var discardCards = {};
    for(var player in players){
        discardCards[players[player].name] = players[player].discardedCardsCnt();
    }
    return discardCards;
  }

  //TODO
  robber.stealFrom = function(hextile){
    var stealable = [];
    //get players who have one or more settlements/cities on the vertice of that hextile.

    return stealable;
  }

  robber.stealCard = function(thief,victim){
    if(thief.rolledSeven == true){
      victim.stolenBy(thief);
    }
    thief.rolledSeven = false;
  }

  //TODO knight&robber

  robber.moveAway = function(){
    //resume the number of this hextile.
    //start producing resource
  }
  //check distribute resource, get player that is adjacent to vertex ?
  return robber;
}
