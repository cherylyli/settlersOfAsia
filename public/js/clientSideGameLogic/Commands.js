/**
 * Created by emol on 2/24/1
*/
let Commands = {};

let match = null;
Commands.rollDice = function () {
    sock.emit('rollDice');
    sock.on('rollDiceAck', function (msg) {
        update(msg);
        console.log(match.dice);
        alert("Dice rolled");
    });
}


update = function (msg) {
    match = CircularJSON.parse(msg);
}