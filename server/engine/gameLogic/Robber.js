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
  robber.moveTo = function(from,to,match){

    if(from)
      from.blockedByRobber = false;
    if(to){
      to.blockedByRobber = true;
      robber.pos = to;
      robber.move = false;
      return {'curPos' : robber.pos, 'discardHalf' : robber.hasToDiscardCards(match.players), 'stealFrom' : robber.stealFrom(to,match.map)};
    }

    robber.pos = to;
    robber.move = false;
    //player.rolledSeven = false;
    return  {'curPos' : robber.pos,'discardHalf': null, 'stealFrom' : null};
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
