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
         player.resourceCardTotalNum = function(){
             let sum = 0;
             for (let card in player.resourcesAndCommodities){
                 sum += player.resourcesAndCommodities[card];
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



        // vertexInfo is an array
        // for each vertex, store buildings/knights of all players
        function storeVertexElements(vertexInfo, vertexData){
            if (!vertexInfo) return;
            var vertexData = vertexData || {};
            for (var i = 0; i<vertexInfo.length; i++){
                if (vertexInfo[i] && vertexInfo[i]['owner']){
                    vertexData[vertexInfo[i].position] = {name: vertexInfo[i].owner.name, type: vertexInfo[i].level};
                }
            }
            return vertexData;
        }

        // from list, break down each element and store according to what vertices they touch
        function storeVerticesToMap(items, mappedData){
            mappedData = mappedData || {};
            var newVertexStuffV1;
            var newVertexStuffV2;
            for (var key in items){
                newVertexStuffV1 = [];
                newVertexStuffV2 = [];

                v1 = items[key][0];
                v2 = items[key][1];
                if (mappedData[v1]){
                    newVertexStuffV1 = mappedData[v1];
                }
                newVertexStuffV1.push(items[key]);
                mappedData[v1] = newVertexStuffV1;

                if (mappedData[v2]){
                    newVertexStuffV2 = mappedData[v2];
                }
                newVertexStuffV2.push(items[key]);
                mappedData[v2] = newVertexStuffV2;

            }
            return mappedData;
        }



        // from list, break down each element and store according to what vertices they touch
        function storeVerticesToMap(items, mappedData){
            mappedData = mappedData || {};
            var newVertexStuffV1;
            var newVertexStuffV2;
            for (var key in items){
                newVertexStuffV1 = [];
                newVertexStuffV2 = [];

                v1 = items[key][0];
                v2 = items[key][1];
                if (mappedData[v1]){
                    newVertexStuffV1 = mappedData[v1];
                }
                newVertexStuffV1.push(items[key]);
                mappedData[v1] = newVertexStuffV1;

                if (mappedData[v2]){
                    newVertexStuffV2 = mappedData[v2];
                }
                newVertexStuffV2.push(items[key]);
                mappedData[v2] = newVertexStuffV2;

            }
            return mappedData;
        }


        /**
         * Return a continous road that contains the input vertex.
         e.g player has a continous road from 1-2-3-4 ->  [1,2],[2,3],[3,4],[4,5] (5 is the end nodes)
         input 3 returns a list of empty unoccupied vertices [1,2,3,4,5]
         * @param vertex {Int}
         * @return Int list - all vertices on that road.
         */
        Player.getEmptyAdjacentVertices = function(player, vertex, match){
            /**
             * Tests:
             * 1. Separate road / ships unless connected with player's city/settlement
             * 2. Knight or building at a vertex removes it from empty vertex list -- checked
             */

            if (!vertex || !match) return [];
            var mappedData = storeVerticesToMap(player.roads, {});
            var mappedData = storeVerticesToMap(player.ships, mappedData);

            var strRoads = JSON.stringify(player.roads);
            var strShips = JSON.stringify(player.ships);

            var vertexData = storeVertexElements(match.map['vertexInfo'], {});

            // if player doesn't own the vertex, return empty list
            if (vertexData && vertexData[vertex] && vertexData[vertex].name != player.name){
                return [];
            }

            // if no road adjacent to vertex, return empty list
            if (!mappedData[vertex]){
                return [];
            }

            // get root where the road begins
            // store empty vertices
            var traversed = [];
            var paths = [];
            var emptyVertices = [];
            var pathsAtVertex = mappedData[vertex];

            // find next vertex, check if it's empty
            for (var i = 0; i< pathsAtVertex.length; i++){
                var path = pathsAtVertex[i];
                var nextV = path[1-path.indexOf(vertex+"")];
                if (!vertexData[nextV]){
                    emptyVertices.push(nextV);
                }
                traversed.push(path);
                paths.push(nextV);
            }


            // traverse the path until no more possible roads
            while (paths.length > 0){


                var lastVertex = parseInt(paths.shift());

                // console.log("paths, traversed, lastVertex");
                // console.log(paths);
                // console.log(traversed);
                // console.log(lastVertex);

                // console.log("emptyvertexList");
                // console.log(emptyVertices);

                // check if there's another road/ship connected there
                var newPossibilites = mappedData[lastVertex];

                // console.log("new possibilities");
                // console.log(newPossibilites);

                if (!newPossibilites){continue;}
                for (var i = 0; i< newPossibilites.length; i++){
                    var p = newPossibilites[i];
                    // if it's been traversed, ignore; else, append to paths
                    if (JSON.stringify(traversed).indexOf(JSON.stringify(p)) == -1){
                        var newLastVertex = p[1-p.indexOf(lastVertex+"")];
                        if (!vertexData[newLastVertex]){
                            emptyVertices.push(newLastVertex);
                        }
                        traversed.push(p);
                        paths.push(newLastVertex);

                        // console.log("new p & new last vertex");
                        // console.log(p);
                        // console.log(newLastVertex);


                    }
                }


            }

            return emptyVertices;
          };

        return player;
    }

    function getCommands(player){
        let cmds = [];
        if (app.ongoingCmd == 'stealCard') return ['stealCard'];
        if (player.hasBoot) cmds.push('giveAwayBoot');

        // TODO: check if steal card is allowed, allow check trade is alloed --> progress card commercail harbor
        cmds.push('stealCard', 'requestTrade');
        return cmds;
    }


    function ableToUpgradeToMetropolis() {
        let cityCategories = [];
        let match = DATA.getMatch();
        let player = DATA.getMyPlayer();
        _.forEach(Enum.cityImprovementCategory, function (type) {

            if ((!match.Metropolis[type] && player.cityImprovement[type] >=4) ||
                (match.Metropolis[type] && match.Metropolis[type].owner.cityImprovement[type] < player.cityImprovement[type])){
                        console.log("132");
                cityCategories.push(type);
            }
        });
        return cityCategories;
    }


    return {
        addHelperFunctions,
        getCommands,
        ableToUpgradeToMetropolis
    }

})();
