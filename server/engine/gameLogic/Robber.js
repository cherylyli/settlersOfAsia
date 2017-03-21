let Robber = module.exports = {};

let Map = require('./Map.js');
let HexTile = require('./HexTile.js');
let Player = require('./Player.js');
let Die = require('./Dice.js');

Robber.createRobber = function(){
  let robber = {};
  robber.pos = 0;
  robber.move = false;

  robber.canMove = function(productionNum){
    if (productionNum == 7){
      robber.move = true;
      //player.rolledSeven = true;
    }
    return robber.move;
  }

  //from, to - 2 land hextiles
  robber.moveTo = function(from,to){
    /*
    if(robber.move == false)
      return -1;
      */
    //release hextile_from to robber free
    from.blockedByRobber = false;
    to.blockedByRobber = true;
    robber.move = false;

    robber.pos = to;
    //player.rolledSeven = false;
//    return robber.pos;
  }

  //@return {playerName {String} : number of cards that need to be discarded: {Int}}
  robber.hasToDiscardCards = function(players){
    // if players has more than 7 cards, discard half (round down)
    var discardCards = {};
    for(var player in players){
      //console.log("name" + players[player].name );
      //console.log("discard cards num " + players[player].discardedCardsCnt());
      discardCards[players[player].name] = players[player].discardedCardsCnt();
    }
    //console.log(discardCards);
    return discardCards;
  }

  robber.stealFrom = function(hexTile, map){
    var stealable = hexTile.getPlayersAroundByBuildings(map);
    return stealable;
  }

  robber.stealCard = function(thief,victim){
    victim.stolenBy(thief);
  }

  //TODO knight&robber

  robber.moveAway = function(){
    //off the board
    //hexTile.blockedByRobber
    robber.pos.blockedByRobber = false;
    robber.pos = 0;
  }
  //check distribute resource, get player that is adjacent to vertex ?
  return robber;
}
