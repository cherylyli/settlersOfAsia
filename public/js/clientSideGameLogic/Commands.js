/**
 * Created by emol on 2/24/1
*/
let Commands = {};
let CommandsData = {};
let CommandName = {'rollDice' : 'rollDice', 'buildEstablishment': 'buildEstablishment', 'endTurn': 'endTurn'};

let match = null;


Commands.exec = function(commandName, data){
    sock.emit(commandName, data);
};



_.each(CommandName, function(cmd){

    sock.on(cmd + 'Ack', function (msg) {
        alert(cmd + 'Ack');
        update(msg);
        console.log(match);
    });

});




/**
 * rollDice does not take any arguments
 * @return {null}
 */
CommandsData.rollDice = function () {
    return null;
}

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
 * @return {null}
 */
CommandsData.endTurn = function () {
    return null;
}

update = function (msg) {
    match = CircularJSON.parse(msg);
}
