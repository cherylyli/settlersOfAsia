/**
 * Created by emol on 3/22/17.
 */
let VertexUnit = (function () {
    function getUIType(vertexUnit) {
        if (isKnight(vertexUnit)){
            return "Knight" + vertexUnit.owner.color;
        }
        // return building.level + building.owner.color;
        if (vertexUnit.level == Enum.Building.Settlement || vertexUnit.level == Enum.Building.City) return vertexUnit.level + vertexUnit.owner.color;
        return "Metropolis" + vertexUnit.owner.color;
    }

    /**
     *
     * @param vertexUnit
     * @return {boolean}
     */
    function isKnight(vertexUnit) {
        return vertexUnit.hasOwnProperty('hasMovedThisTurn');
    }

    /**
     * get valid commands at this vertex
     *
     */

        // commands triggered by clicking a vertex
    let VertexCommand = {
            "UnoccupiedVertex": {
                'buildSettlement': 'buildSettlement',
                'hireKnight' : 'hireKnight'
            },

            "Settlement": {
                'upgradeToCity': 'upgradeToCity',

            },

            "City": {
                'buildCityWall': 'buildCityWall',
                // "upgradeToMetropolis": 'upgradeToMetropolis',
                // 'chooseCityToBePillaged': 'chooseCityToBePillaged'
            },

            "Knight": {
                'active': {
                    'chaseAwayThief': 'chaseAwayThief',
                    'promoteKnight': 'promoteKnight',
                    'moveKnight': 'moveKnight'
                },
                'inactive':{
                    'activateKnight': 'activateKnight',
                    'promoteKnight': 'promoteKnight',
                }
            }

        };

    function getCommands(vertexId) {
        let vertexUnit = DATA.getMap().getVertexInfo(vertexId);
        if (!app.ongoingCmd) {
            // if the vertex is unoccupied
            if (!vertexUnit) return VertexCommand.UnoccupiedVertex;
            if (vertexUnit.owner.name != DATA.getMyPlayer().name) return;
            if (isKnight(vertexUnit)) {
                return (vertexUnit.active) ? VertexCommand.Knight.active : VertexCommand.Knight.inactive;
            }

            else {
                // building
                if (vertexUnit.level == Enum.Building.Settlement) return VertexCommand.Settlement;
                else {
                    // city
                    let cmds = {};

                    for (let action of DATA.getMyPlayer().diceConfigResult){
                        console.log(action.cmd);
                        if (action.cmd == "chooseCityToBePillaged"){
                            return {chooseCityToBePillaged: "chooseCityToBePillaged"};
                        }
                    };

                    if (!vertexUnit.cityWall) cmds.buildCityWall = 'buildCityWall';
                    if (Player.ableToUpgradeToMetropolis().length > 0 ) cmds.upgradeToMetropolis = "upgradeToMetropolis";
                    return cmds;
                }
            }
        }

        else {
            // "upgradeToMetropolis": 'upgradeToMetropolis',
            // 'chooseCityToBePillaged': 'chooseCityToBePillaged'
            if (vertexUnit.vertexUnitType == "building" && vertexUnit.level != Enum.Building.Settlement){
                let cmd = {};
                cmd[app.ongoingCmd] = app.ongoingCmd;
                return cmd;
            }
        }
    }



    /**
     *
     * @param knight
     * @return {Array} {String[]}
     */
    function getThiefAround(knight) {
        let map = DATA.getMap();
        let theif = [];
        console.log("knight", knight.position);
        let neighborHexs = map.getHexTileByVertex(knight.position);
        _.forEach(neighborHexs, function ([hexID, positionInHex]) {
            if (map.robber.pos == hexID) theif.push("robber");
            if (map.pirate.pos == hexID) theif.push("pirate");
        });
        return theif;
    }

    return {
        getUIType,
        isKnight,
        getCommands,
        getThiefAround
    }
})();