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
    function getCommands(vertexId) {
        let vertexUnit = DATA.getMap().getVertexInfo(vertexId);

        // if the vertex is unoccupied
        if (!vertexUnit) return VertexCommand.UnoccupiedVertex;

        if (isKnight(vertexUnit)) return VertexCommand.Knight;

        else {
            // building
            if (vertexUnit.level == Enum.Building.Settlement) return VertexCommand.Settlement;
            return VertexCommand.City;
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
        })
        return theif;
    }

    return {
        getUIType,
        isKnight,
        getCommands,
        getThiefAround
    }
})();