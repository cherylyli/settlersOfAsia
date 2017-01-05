/**
 * Created by emol on 1/4/17.
 */
import {Map} from './Map.js';
import {HexTile} from  './HexTile';
const VP_buildSettlement = 1;
/**
 * settlement: level 1 building
 * city: level 2 building
 */
export class Building{
    constructor(player, vertex, map){
        this.owner = player;
        this.position = vertex;
        this.level = 1; //level 1 for settlement, 2 for city
        this.updateInfo(map);
    }


    /**
     * private method
     * @param map
     */
    updateInfo(map){
        //update hexTile info
        let neighborHexTiles = map.getHexTileByVertex(this.position);
        for (let i = 0; i<neighborHexTiles.length; i++){
            let [hexTileId, positionInHex] = neighborHexTiles[i];
            let hexTile = map.getHexTileById(hexTileId);
            if (hexTile.verticesInfo[positionInHex]) throw "You can only build settlement/city on empty vertex";
            hexTile.verticesInfo[positionInHex] = this;
        }

        //update player info
        this.owner.buildings.push(this);
        this.owner.updateVP(VP_buildSettlement);
    }


    upgradeToCity(){
        if (this.level != 1) throw "You can only upgrade a settlement to city";
        this.level = 2;

        this.cityWall = false;
    }

    buildCityWall(){
        if (this.level != 2) throw  "You can only build city wall on city";
        if (this.cityWall) throw "You may only build one city wall under each city";
        if (this.owner.cityWallNum == 3) throw "You can build at most 3 city walls";
        this.owner.cityWallNum ++;
        this.owner.maxSafeCardNum += 2;
        this.cityWall = true;
    }

    removeCityWall(){
        this.owner.cityWallNum --;
        this.owner.maxSafeCardNum -= 2;
        this.cityWall = false;
    }



}