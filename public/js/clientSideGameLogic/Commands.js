
let Commands = {};
let CommandsData = {};
let CommandName = {'rollDice' : 'rollDice', 'buildEstablishment': 'buildEstablishment', 'buildRoad': 'buildRoad', 'buildShip': 'buildShip', 'endTurn': 'endTurn'};

let room = {users: {}};

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

/**
 *
 * @param vertex {int}   vertex id
 * @param establishmentLV {int} level 1 : settlement, level 2: city, level 3: metropolitan
 */
CommandsData.buildEstablishment = function(vertex, establishmentLV){
    return {'position': vertex, 'establishmentLV': establishmentLV };
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
 * @param vertex1
 * @param vertex2
 */
CommandsData.buildShip = function (vertex1, vertex2) {
    return Map.edge(vertex1, vertex2);
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
 * @param cityImprovementCategory  {String}
 */
CommandsData.buyCityImprovement = function (cityImprovementCategory) {
    return {'cityImprovementCategory': cityImprovementCategory};
};

/**
 *
 * @param oldVertex1 {int}  vertex 1 < vertex 2
 * @param oldVertex2 {int}
 * @param newVertex1 {int}
 * @param newVertex2 {int}
 */
CommandsData.moveShip = function (oldVertex1, oldVertex2, newVertex1, newVertex2) {
    let oldPosition = edge(oldVertex1, oldVertex2);
    let newPosition = edge(newVertex1, newVertex2);
    return {'oldPosition': oldPosition, 'newPosition': newPosition};
};


CommandsData.tradeWithBank = function () {

};


//Commands.discardResourceCards



/**
 *
 * @return {null}
 */
CommandsData.endTurn = function () {
    return null;
};



/**
let edge = function (vertex1, vertex2) {
    //TODO: check if vertex 1 and vertex2 is a edge

    //check if vertex is less then vertex 2
    if (vertex1 < vertex2) return [vertex1, vertex2];
    return [vertex2, vertex1];
};
 **/




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
