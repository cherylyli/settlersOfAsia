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

  //@return
  robber.hasToDiscardCards = function(players){
    // if players has more than 7 cards, discard half (round down)
    var discardCards = {};
    for(var player in players){
        discardCards[players[player].name] = players[player].discardedCardsCnt();
    }
    return discardCards;
  }

  robber.stealFrom = function(hexTile, map){
    var stealable = hexTile.getPlayersAroundByBuildings(map);
    /*
    var stealable = [];
    //get players who have one or more settlements/cities on the vertice of that hextile.
    for (let vertex in hexTile.vertices) {
        if (hexTile.vertices.hasOwnProperty(vertex)) {
            //there is a builidng on the vertex
            let building = map.getVertexInfo(hexTile.vertices[vertex]);
            if (building){
                let player = building.owner;
                stealable.push(player);
            }
        }
    }
    */
    return stealable;
  }

/*
  robber.stealCard = function(thief,victim){
    victim.stolenBy(thief);
  }
*/
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
