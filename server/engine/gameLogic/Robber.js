let Robber = module.exports = {};

let Map = require('./Map.js');
let HexTile = require('./HexTile.js');
let Player = require('./Player.js');
let Die = require('./Dice.js');

Robber.createRobber = function(){
  let robber = {};
  robber.pos = 0;
  robber.move = false;

  //check distribute resource, get player that is adjacent to vertex ?
  return robber;
}




Robber.canMove = function(robber, productionNum){
    if (productionNum == 7){
        robber.move = true;
        //player.rolledSeven = true;
    }
    return robber.move;
};

//from, to - 2 land hextiles
Robber.moveTo = function(robber,from,to,match){
    if(match.fish == "MOVE_ROBBER"){
      robber.pos = 0;
      robber.move = false;
    }
    if(from)
        from.blockedByRobber = false;
    if(to){
        to.blockedByRobber = true;
        robber.pos = to.id;  // pos: {int}
        robber.move = false;
      //  return {'curPos' : robber.pos, 'discardHalf' : Robber.hasToDiscardCards(robber, match.players), 'stealFrom' : Robber.stealFrom(robber, to,match.map)};
    }
    else{
      robber.pos = to; //to = 0;
      robber.move = false;
    }
};

//@return {playerName {String} : number of cards that need to be discarded: {Int}}
Robber.hasToDiscardCards = function(robber, players){
    // if players has more than 7 cards, discard half (round down)
    var discardCards = {};
    for(var player in players){
        //console.log("name" + players[player].name );
        //console.log("discard cards num " + players[player].discardedCardsCnt());
        discardCards[players[player].name] = Player.discardedCardsCnt(players[player]);
    }
    //console.log(discardCards);
    return discardCards;
};

Robber.stealFrom = function(robber, hexTile, map){
    var stealable = HexTile.getPlayersAroundByBuildings(hexTile, map);
    return stealable;
};

Robber.stealCard = function(robber, thief,victim){
    Player.stolenBy(victim, thief);
};

//TODO knight&robber

Robber.moveAway = function(robber){
    //off the board
    //hexTile.blockedByRobber
    robber.pos.blockedByRobber = false;
    robber.pos = 0;
};
