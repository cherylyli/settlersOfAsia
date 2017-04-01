let EdgeUnit = (function () {

    /**
     * get valid commands at edge
     * @param edge {edge}
     * @return {object} null if no commands available
     */
    function getCommands(edge) {
        let edgeUnit = DATA.getMap().getEdgeInfo(edge);
        if (!edgeUnit) return EdgeCommand.UnoccupiedEdge;
        if (edgeUnit.type == "ship") return EdgeCommand.Ship;
        return null;
    }

    return {
        getCommands
    }
})();




/**
EdgeUnit.addHelperFunctionsShip = function (ship) {
    ship.remove = function (map, oldPosition) {
        map.setEdgeInfo(undefined, oldPosition);
    };

    ship.addBack= function (map, oldPosition) {
        map.setEdgeInfo(this, oldPosition);
    };
};**/