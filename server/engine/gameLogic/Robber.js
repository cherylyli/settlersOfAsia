let Robber = module.exports = {};

let Map = require('./Map.js');
let HexTile = require('./HexTile.js');
let Player = require('./Player.js');
let Die = require('./Dice.js');

Robber.createRobber(){
  let robber = {};
  robber.pos = 0;
  robber.move = false;

  robber.canMove = function(redDie,yellowDie,player){
    if (redDie + yellowDie == 7){
      robber.move = true;
      player.rolledSeven = true;
    }
    return robber.move;
  }

  robber.moveTo = function(player,hextile,victim){
    if(robber.move == false)
      return -1;

    //TODO check if hextile is valid. -> hand hextile
    robber.pos = hextile;
    //change the number of this hextile to be undefined.
    robber.move = false;
    player.rolledSeven = false;
    return robber.pos;
  }

  robber.robPlayers = function(players,pillager,victim,cards){
    // if players has more than 7 cards, discard half (round down)
    for(var player in players){
      players[player].discardProgressCards(cards);
    }

    //TODO check if victim locates on the hex tile the pillager choosed to move robber to
    if(pillager.rolledSeven == true){
      victim.stolenBy(pillager);
    }

    //knight TODO
    pillager.rolledSeven = false;
  }

  rober.moveAway = function(){
    //resume the number of this hextile.
    //start producing resource

  }
  //check distribute resource, get player that is adjacent to vertex ?
  return robber;
}
