/**
 * Player stores the game info of a user in a game.
 */

let Player = (function () {

    function addHelperFunctions(player) {
        /**
         *
         * @return {Number}
         */
        player.getBuildingCnt = function () {
            return Object.keys(player.buildings).length;
        };

        /**
         *
         * @return {Number}
         */
        player.getCityCnt = function () {
            return player.getCities().length;
        };

        /**
         *
         * @return {Number}
         */
        player.getFishSum = function () {
            return player.fishSum;
        };
        /**
         *
         * @return {number}
         */
        player.getRoadAndShipCnt = function () {
            return Object.keys(this.ships).length + Object.keys(this.roads).length;
        };

        /**
         * count the total number of cards (Resource+Commodity) current player owns
         * @param currentPlayer {Player}
         * @return sum {Integer}
         */
        player.resourceCardTotalNum = function (currentPlayer) {
            let sum = 0;
            for (let card in currentPlayer.resourceAndCommandities) {
                sum += currentPlayer.resourceAndCommandities[card];
            }
            return sum;
        };


        /**
         *
         * @param vertex {int}
         * @return {Building}
         */
        player.getBuilding = function (vertex) {
            return player.buildings[vertex];
        };


        /**
         *
         * @return {Array<Building>}
         */
        player.getCities = function () {
            let cities = [];
            for (let vertex in player.buildings) {
                if (player.buildings.hasOwnProperty(vertex) && player.buildings[vertex].level == 2) {
                    cities.push(player.buildings[vertex]);
                }
            }
            return cities;
        };

        /**
         *
         */
        player.getSettlements = function () {
            let settlements = [];
            for (let vertex in player.buildings) {
                if (player.buildings.hasOwnProperty(vertex) && player.buildings[vertex].level == 1) {
                    settlements.push(player.buildings[vertex]);
                }
            }
            return settlements;
        };


        /**
         * cards is a list of string
         * player.progressCard is a list a String
         *
         */
        player.progCardSum = function () {
            player.progressCardsCnt = player.progressCards.length;
            return player.progressCardsCnt;
        };

        return player;
    }

    return {
        addHelperFunctions
    }

})();
