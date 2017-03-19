let Pirate = module.exports = {};

let Map = require('./Map.js');
let HexTile = require('./HexTile.js');
let Player = require('./Player.js');
let Die = require('./Dice.js');

Pirate.createPirate = function(){
  let pirate = {};
  pirate.pos = 0;
  pirate.move = false;

  pirate.canMove = function(redDie,yellowDie){
    if (redDie + yellowDie == 7){
      pirate.move = true;
    }
    return pirate.move;
  }
  //from, to - 2 water hex tiles
  pirate.moveTo = function(from,to){
    if(pirate.move == false)
      return -1;

    //release hextile_from
    from.blockedByPirate = false;
    to.blockedByPirate = true;
    //must be water hex
    pirate.pos = to;

    pirate.move = false;
    //player.rolledSeven = false;
  //  return pirate.pos;
  }

  pirate.stealFrom = function(hexTile, map){
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
    return stealable;
  }


  //can't build new ships along the pirate hex
  //cannot move a ship along the pirate hex
  pirate.applyAction = function(players){
    for(var player in players){

    }
  }

  pirate.moveAway = function(){
    pirate.pos.blockedByPirate = false;
    pirate.pos = 0;
  }

  return pirate;
}
