/**
 * Created by emol on 3/5/17.
 */



/**
 * Building class is responsible for vertex unit: settlement, city;
 * settlement: level 1 building
 * city: level 2 building
 */

let Building = {};

Building.addHelperFunctions = function (building) {

    building.upgradeToCityCheck = function () {

    };

    building.buildCityWallCheck = function () {
        if (building.level != 2) throw  "You can only build city wall on city";
        if (building.cityWall) throw "You may only build one city wall under each city";
        if (building.owner.cityWallNum == 3) throw "You can build at most 3 city walls";
    };



    return building;

};

Building.buildSettlementCheck = function (vertex) {
    /**
    function phaseCheck() {
        if((getMatch().phase == Enum.MatchPhase.SetupRoundOne) && getMyPlayerObj().settlementCnt >= 1){
            swalError2("You can only build one settlement in set up round one!");
            return false;
        }
    }  **/
};



