
let Building = (function () {

    function addHelperFunctions(building) {

        /**
         *
         * @return {String}
         */
        building.getUIType = function () {
            // return building.level + building.owner.color;
            if (building.level == Enum.Building.Settlement || building.level == Enum.Building.City) return building.level + building.owner.color;
            return "Metropolis" + building.owner.color;
        };

        building.upgradeToCityCheck = function () {

        };

        building.buildCityWallCheck = function () {
            if (building.level == Enum.Building.Settlement) throw  "You can only build city wall on city";
            if (building.cityWall) throw "You may only build one city wall under each city";
            if (building.owner.cityWallNum == 3) throw "You can build at most 3 city walls";
        };


        return building;

    }

    function buildSettlementCheck(vertex) {
        /**
         function phaseCheck() {
        if((getMatch().phase == Enum.MatchPhase.SetupRoundOne) && DATA.getMyPlayer().settlementCnt >= 1){
            swalError2("You can only build one settlement in set up round one!");
            return false;
        }
    }  **/
    }

    return {
        addHelperFunctions,
        buildSettlementCheck
    }
})();



