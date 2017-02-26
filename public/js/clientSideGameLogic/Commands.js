/**
 * Created by emol on 2/24/1
*/
let Commands = {};
let CommandsData = {};
let CommandName = {'rollDice' : 'rollDice', 'buildEstablishment': 'buildEstablishment'};

let match = null;
/**
Commands.rollDice = function () {
    sock.emit('rollDice');
    sock.on('rollDiceAck', function (msg) {
        update(msg);
        console.log(match.dice);
        alert("Dice rolled");
    });
};**/

Commands.exec = function(commandName, data){
    sock.emit(commandName, data);
    sock.on(commandName + 'Ack', function (msg) {
        update(msg);
        alert(commandName + 'Ack');
        console.log(match);
    })
};

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
Commands.buildEstablishment = function (data) {
    sock.emit('buildEstablishment', data);
    sock.on('buildEstablishmentAck', function (msg) {
        update(msg);
        console.log(match);
    })
}
**/

update = function (msg) {
    match = CircularJSON.parse(msg);
}