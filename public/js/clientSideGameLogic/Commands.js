/**
 * Created by emol on 2/24/1
*/
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
        sock.emit(cmd, CommandsData[cmd](arguments));
    };

    sock.on(cmd + 'Ack', function (msg) {
        alert(cmd + 'Ack');
        update(msg);
        console.log(room.match);
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
    edge(vertex1, vertex2);
};


/**
 *
 * @param vertex1
 * @param vertex2
 */
CommandsData.buildShip = function (vertex1, vertex2) {
    edge(vertex1, vertex2);
};

CommandsData.buildCityWall = function (vertex) {

}


/**
 *
 * @return {null}
 */
CommandsData.endTurn = function () {
    return null;
};


let edge = function (vertex1, vertex2) {
    //TODO: check if vertex 1 and vertex2 is a edge

    //check if vertex is less then vertex 2
    if (vertex1 < vertex2) return [vertex1, vertex2];
    return [vertex2, vertex1];
};

update = function (msg) {
    room = CircularJSON.parse(msg);
};
