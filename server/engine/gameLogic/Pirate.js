 let Pirate = module.exports = {};

let Map = require('./Map.js');
let HexTile = require('./HexTile.js');
let Player = require('./Player.js');
let Die = require('./Dice.js');

Pirate.createPirate = function(){
  let pirate = {};
  pirate.pos = 0;
  pirate.move = false;

  pirate.canMove = function(productionNum){
    if (productionNum == 7){
      pirate.move = true;
    }
    return pirate.move;
  }
  //from, to - 2 water hex tiles
  pirate.moveTo = function(from,to,match){
    if(from)
      from.blockedByPirate = false;
    if(to){
        to.blockedByPirate = true;
        pirate.pos = to.id;
        pirate.move = false;
        return {'curPos' : pirate.pos, 'discardHalf': null, 'stealFrom' : pirate.stealFrom(to, match.map)};
      }

      pirate.pos = to.id;
      pirate.move = false;
      //player.rolledSeven = false;
      return {'curPos' : pirate.pos,  'discardHalf': null, 'stealFrom' : null };
  }

  pirate.stealFrom = function(hexTile, map){
    var stealable = hexTile.getPlayersAroundByShips(map);
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


  //can't build new ships along the pirate hex
  //cannot move a ship along the pirate hex
  /*pirate.applyAction = function(players){
    for(var player in players){


    }
  }
  */

  pirate.moveAway = function(){
    pirate.pos.blockedByPirate = false;
    pirate.pos = 0;
  }

  return pirate;
}
