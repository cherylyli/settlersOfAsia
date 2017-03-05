let EdgeUnit = {};

EdgeUnit.addHelperFunctions = function (edgeUnit) {

};

EdgeUnit.road = {

};

EdgeUnit.addHelperFunctionsShip = function (ship) {
    ship.remove = function (map, oldPosition) {
        map.setEdgeInfo(undefined, oldPosition);
    };

    ship.addBack= function (map, oldPosition) {
        map.setEdgeInfo(this, oldPosition);
    };
};