//(function(){
    let Commands = {};
    let CommandsData = {};
    let CommandName = {'rollDice' : 'rollDice', 'buildSettlement': 'buildSettlement', 'upgradeToCity': 'upgradeToCity', 'buildEstablishment': 'buildEstablishment', 'buildRoad': 'buildRoad', 'buildShip': 'buildShip', 'endTurn': 'endTurn', 'buildCityWall': 'buildCityWall', 'buyCityImprovement': 'buyCityImprovement', 'moveShip': 'moveShip', 'tradeWithBank': 'tradeWithBank'};

    //TODO: include check input & make the object not global
    let CommandCheck = {};

    let room = {users: {}};
    let getMatch = function () {
        return  window.app.room.match;
    };

    let getMyPlayerObj = function () {
        return getMatch().players[myObj.username];
    };
/**
Commands.exec = function(commandName, data){
    sock.emit(commandName, data);
};
**/


    _.each(CommandName, function(cmd){

        Commands[cmd] = function(){
            sock.emit(cmd, CommandsData[cmd].apply(this, arguments));
        };

        sock.on(cmd + 'Ack', function (msg) {
            //alert(cmd + 'Ack');
            console.log(msg);
        });

    });




/**
 * rollDice does not take any arguments
 * @return {null}
 */
    CommandsData.rollDice = function () {
        return null;
    };

    //assume now we are the current player (we only allow user to click button until he receives TAKE_TURN and hasn't clicked end turn
    CommandCheck.rollDice = function () {
        if (getMatch().diceRolled){
            alert("Dice already rolled!");
            return false;
        } 
        return true;
    };

/**
 *
 * @param vertex {int}   vertex id
 * @param establishmentLV {int} level 1 : settlement, level 2: city, level 3: metropolitan
 */
//TODO: delete this function later
    CommandsData.buildEstablishment = function(vertex, establishmentLV){
       return {'position': vertex, 'establishmentLV': establishmentLV};
    };


    CommandsData.buildSettlement = function (vertex) {
        return {'position': vertex};
    };



/**
 * TODO: test
 * @param cmdData    {CommandsData.buildSettlement}
 * @return {boolean}
 */
    CommandCheck.buildSettlement = function (cmdData) {
        let vertex = cmdData.position;

        //set up phrase you can build one settlement for free
        if((getMatch().phase == Enum.MatchPhase.SetupRoundOne) && getMyPlayerObj().settlementCnt >= 1){
            alert("You can only build one settlement in set up round one!");
            return false;
        }


        if ((!getMatch().phase == Enum.MatchPhase.SetupRoundOne) && !checkEnoughResource(Cost.buildSettlement)){
            return false;
        }

        //check if the vertex is not empty
        if (getMatch().map.getVertexInfo(vertex)){
            alert("Invalid position!");
            return false;
        }

        /**
         *
         * @type {Array.<edge>}
         */
        let connectedEdges = getMatch().map.getEdgeByVertex(vertex);
        //flags
        let connectedToOneRoad = false;
        let distanceRuleSatisfied = true;

        for (let e of connectedEdges){
            //check if connected to one road
            let road = getMatch().map.getEdgeInfo(e);
            if (road && road.owner.name == myObj.username){
                //we have a road connected with the settlement
                connectedToOneRoad = true;
            }

            //distance rule - you may only build a settlement at an intersection if all 3 of the adjacent intersections are vacant (i.e., none are occupied by any settlements or cities—even yours
            let otherEndOfEdge = Map.getOtherEndOfEdge(e, vertex);
            let vertexUnit = getMatch().map.getVertexInfo(otherEndOfEdge);
            if (vertexUnit && !isKnight(vertexUnit)){
                //if the vertexUnit is not knight, then it's settlement / city
                //-> there is a settlement / city at a adjacent intersections
                distanceRuleSatisfied = false;
            }
        }


        if (!connectedToOneRoad && (!getMatch().phase == Enum.MatchPhase.SetupRoundOne)){
            alert("Settlement should be connected with at least one road.");
            return false;
        }

        if (!distanceRuleSatisfied){
            alert("Distance rule violated! All 3 of the adjacent intersections must be vacant to build a settlement!");
            return false;
        }

        //if you have more than 5 settlements, you have to upgrade one to a city before you build another one
        if (getMyPlayerObj().settlementCnt == 5){
            alert("You already have 5 settlements! Upgrade one to city before you build another one!");
            return false;
        }

        return true;
    };






    CommandsData.upgradeToCity = function (vertex) {
        return {'position': vertex};
    };


    /**
    *
    * @param data {CommandsData.upgradeToCity}
    * @return {boolean}
    */
    CommandCheck.upgradeToCity = function (data) {
        let vertex = data.position;
        if (!checkEnoughResource(Cost.upgradeToCity)){
            return false;
        }

        //check if there is a settlement in the vertex
        if (isSettlement(vertex)){
            return true;
        }

        alert("Invalid operation!");
        return false;
    };


/**
 *
 * @param vertex1 {int} vertex 1 is smaller than vertex2
 * @param vertex2
 */
    CommandsData.buildRoad = function (vertex1, vertex2) {
        return Map.edge(vertex1, vertex2);
    };



/**
 *
 * @param data {CommandsData.buildRoad}
 * @return {boolean}
 */
    CommandCheck.buildRoad = function (data) {
        let edge = data;

        if (!checkEnoughResource(Cost.buildRoad)){
            return false;
        }


        //Only 1 road can be built on any given path
        if (getMatch().map.getEdgeInfo(edge)){
            alert("Only 1 road can be built on any given path!");
            return false;
        }


        //valid position check -- you cannot build road in sea -> one adjacent hexTile should be land
        let adjacentToLandHex = false;  //flag
        for (let [hexID, edgePosition] of getMatch().map.getHexTileByEdge(edge)){
            if (getMatch().map.getHexTileById(hexID).type != Enum.HexType.Sea) adjacentToLandHex = true;
        }
        if (!adjacentToLandHex){
            alert("You cannot build road in sea!");
        }


        //A new road must always connect to 1 of your existing roads, settlements, or cities.
        let connected = false;

        for (let vertex of edge){

            //if the new road is connected with roads on this vertex
            for (let e of getMatch().map.getEdgeByVertex(vertex)){
                let edgeUnit = getMatch().map.getEdgeInfo(e);
                if (edgeUnit && edgeUnit.type == 'road' && edgeUnit.owner.name == myObj.username){
                    connected = true;
                    break;
                }
            }

            //... connected with settlements, or cities.
            let vertexUnit = getMatch().map.getVertexInfo(vertex);
            if (vertexUnit && !isKnight(vertexUnit)){
                connected = true;
                break;
            }
        }

        if (!connected) {
            alert("A new road must always connect to 1 of your existing roads, settlements, or cities.");
            return false;
        }

        return true;
    };


/**
 * @param vertex1
 * @param vertex2
 */
    CommandsData.buildShip = function (vertex1, vertex2) {
        return Map.edge(vertex1, vertex2);

    };


/**
 * TODO: modularize. reduce duplication
 * @param data {CommandsData.buildShip}
 * @return {boolean}
 */
    CommandCheck.buildShip = function (data) {
        let edge = data;

        if (!checkEnoughResource(Cost.buildShip)){
            return false;
        }

        //Only 1 ship can be built on any given path
        if (getMatch().map.getEdgeInfo()){
            alert("Only 1 ship can be built on any given path!");
            return false;
        }

        //valid position check -- you cannot build road in inland area -> one adjacent hexTile should be sea
        let adjacentToSeaHex = false;  //flag
        for (let [hexID, edgePosition] of getMatch().map.getHexTileByEdge(edge)){
            if (getMatch().map.getHexTileById(hexID).type == Enum.HexType.Sea) adjacentToSeaHex = true;
        }
        if (!adjacentToSeaHex){
            alert("You cannot build road in inland area!");
        }


        //A new ship must always connect to 1 of your existing ships, settlements, or cities.
        let connected = false;

        for (let vertex of edge){

            //if the new ship is connected with roads on this vertex
            for (let e of getMatch().map.getEdgeByVertex(vertex)){
                let edgeUnit = getMatch().map.getEdgeInfo(e);
                if (edgeUnit && edgeUnit.type == 'ship' && edgeUnit.owner.name == myObj.username){
                    connected = true;
                    break;
                }
            }

            //... connected with settlements, or cities.
            let vertexUnit = getMatch().map.getVertexInfo(vertex);
            if (vertexUnit && !isKnight(vertexUnit)){
                connected = true;
                break;
            }
        }

        if (!connected) {
            alert("A new ship must always connect to 1 of your existing ships, settlements, or cities.");
            return false;
        }

        return true;
    };

/**
 *
 * @param vertex {int}
 * @return {{position: int}}
 */
    CommandsData.buildCityWall = function (vertex) {
        return {'position': vertex};
    };

/**
 *
 * @param data
 */
    CommandCheck.buildCityWall = function (data) {
        let vertex = data.position;

        if (!checkEnoughResource(Cost.buildCityWall)){
            return false;
        }

        let vertexUnit = getMatch().map.getVertexInfo(vertex);
        if (!vertexUnit || isKnight(vertexUnit) || isSettlement(vertex)){
            alert("There is no city at this position!");
            return false;
        }

        if (vertexUnit.cityWall){
            alert("This city already has city wall!");
            return false
        }

        return true;
    };

/**
 *
 * @param cityImprovementCategory  {String}
 */
    CommandsData.buyCityImprovement = function (cityImprovementCategory) {
        return {'cityImprovementCategory': cityImprovementCategory};
    };


    CommandCheck.buyCityImprovement = function (data) {
        let cityImprovementCategory = data.cityImprovementCategory;
        let level = getMyPlayerObj().cityImprovement[cityImprovementCategory] + 1;

        // 6 = 5 + 1
        if (level >= 6){
            alert("Maximum level of city improvement in this category is already achieved!");
            return false;
        }

        return (checkEnoughResource(Cost['cityImprove_' + cityImprovementCategory + '_' + level]));

    }

/**
 *
 * @param oldVertex1 {int}  vertex 1 < vertex 2
 * @param oldVertex2 {int}
 * @param newVertex1 {int}
 * @param newVertex2 {int}
 */
    CommandsData.moveShip = function (oldVertex1, oldVertex2, newVertex1, newVertex2) {
        let oldPosition = Map.edge(oldVertex1, oldVertex2);
        let newPosition = Map.edge(newVertex1, newVertex2);
        return {'oldPosition': oldPosition, 'newPosition': newPosition};
    };


    CommandCheck.moveShip = function (data) {
        let oldPosition = data.oldPosition;
        let newPosition = data.newPosition;

        //You may only move 1 ship per turn, and only during your building phase.
        //TODO: check building phase
        if (getMatch().shipMoved){
            alert("You can only move 1 ship per turn!");
            return false;
        }

        let ship = getMatch().map.getEdgeInfo(oldPosition);

        if (!ship || ship.type == 'ship'){
            alert("No ship found!");
        }
        //You may not move a ship on the same turn you originally built it
        if (ship.builtTurnNum == getMatch().turnNum){
            alert("You cannot move a ship on the same turn you originally built it!");
            return false;
        }

        if (! _.contains(getAvailbleEdgesToMoveTo(), newPosition)){
            alert("You cannot move ship here!");
            return false;
        }

        return true;
    }
    //TODO:
getAvailbleEdgesToMoveTo =function () {

}
/**
 *
 * @param src   {String} the name of the card
 * @param tradeFor  {String} the name of the card
 */
    CommandsData.tradeWithBank = function (src, tradeFor) {
        return {'src': src, 'tradeFor': tradeFor};
    };


    CommandCheck.tradeWithBank = function (data) {
        let src = data.src;
        let tradeFor = data.tradeFor;
        let tradeRatio = getMyPlayerObj().tradeRatio[tradeFor];
        let cost = {[src]: tradeRatio};

        return (checkEnoughResource(cost));
    };


//Commands.discardResourceCards



/**
 *
 * @return {null}
 */
    CommandsData.endTurn = function () {
        app.isMyTurn = false;
        return null;
    };

    CommandCheck.endTurn = function () {
        //TODO: do I must roll dice?
        return true;
    }



/**
let edge = function (vertex1, vertex2) {
    //TODO: check if vertex 1 and vertex2 is a edge

    //check if vertex is less then vertex 2
    if (vertex1 < vertex2) return [vertex1, vertex2];
    return [vertex2, vertex1];
};
 **/

/**
 *
 * @param cost {object} key: commodity/resource name, value: int -> # of that resource/commodity required
 */
    let checkEnoughResource = function (cost) {
        let resources = getMyPlayerObj().resourcesAndCommodities;
        for (let cardName in cost){
            if (cost[cardName] > resources[cardName]){
                alert("Not enough "+ cardName + "!");
                return false
            }
        }
        return true;
    };

    let checkInput = function (input) {
        _.each(input, function (param) {
            if (typeof myVar == 'undefined') {
                alert("Invalid input");
                return false;
            }
        })
    };


    let update = function (room) {
        if (room.match) {
            Map.addHelperFunctions(room.match.map);
        }

    // modify room here
    // ...
    // ...
        window.app.room = room; // update room in view
        return room;
    };


//TODO: may move the duck-typing check to another file.
// duck-typing check if object is knight
// vertexUnit may be knight/ settlement/ city
/**
 * TODO: refactor later. the name isBuilding may be inappropriate. As edgeUnit road and ship belongs to Building. Maybe this is a bad design. Change the name or Building class.
 * @param vertexUnit {vertexUnit}
 * @return {boolean}
 */
function isKnight(vertexUnit){
    if (!_.isObject(vertexUnit)) return false;
    let fields = ['active', 'id', 'hasMovedThisTurn', 'hasBeenPromotedThisTurn'];
    for (let i=0; i<fields.length; i++){
        if (_.isUndefined(vertexUnit[fields[i]])) return false;
    }
    return true;
}

/**
 * if the vertexUnit at this vertex is a settlement
 * @param vertex
 */
function isSettlement(vertex) {
    let vertexUnit = getMatch().map.getVertexInfo(vertex);
    if (!_.isObject(vertexUnit) || isKnight(vertexUnit)) return false;
    return (vertexUnit.level == 1);
}

//})();

