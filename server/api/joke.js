// plenty of jokes, heh

var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'joke.txt');


// array of jokes
var array = fs.readFileSync(filePath).toString().split("\n");
module.exports = function(){
    return _.sample(array);
}
