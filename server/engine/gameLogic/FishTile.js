/**
 * Created by emol on 1/10/17.
 */
/**
 * Created by emol on 1/10/17.
 */
let _ = require('underscore');
let Enum = require('./Enum.js');
let Map = require('./Map.js');
let fishTile = {} = module.exports;

let goldNumForSettlement = 2;
let goldNumForCity = 4;

FishTile.createFishTile = function(id, row, posInRow, HexType = 'FishTile', productionNum = '1', visible = true) {
    let fishTile = {};
    fishTile.id = id;
    fishTile.row = row;
    fishTile.posInRow = posInRow;
    fishTile.type = HexType;
    fishTile.productionNum = productionNum;
    fishTile.visible = visible;
    fishTile.vertices = {'1': undefined, '2': undefined, '3': undefined};
    fishTile.getVertices = function(){
        return fishTile.vertices;
    };




    /**
     * @param map {Map}
     * @param players List<Player>
     * add resources to all players that has a building on its vertices
     */
    fishTile.produceResource = function(map, players) {
        for (let vertex in fishTile.vertices) {
            if (fishTile.vertices.hasOwnProperty(vertex)) {
                //there is a builidng on the vertex
                let building = map.getVertexInfo(fishTile.vertices[vertex]);
                if (building){
                    let player = building.owner;
                    fishTile.produceResourceToSingleUser(map, player, building);

                }
            }
        }
    };

    fishTile.produceResourceToSingleUser = function (map, player, building, players) {
        var boot = 0;
        var token;
        for(var p in players){
          if(players[p].hasBoot == true){
            boot = 1;
          }
        }

        if(boot){ //boot has been distributed previously
          token = player.drawRandomFishNoBoot();
        }
        else{
          token = player.drawRandomFish();
        }
        return token;         
    };

    return fishTile;
};
/**
 * Created by emol on 3/20/17.
 */
