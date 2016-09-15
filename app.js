// environments
var ENV = {
    redis : { host: '192.168.6.131', port: 6379 }, // 192.168.6.131
    db    : 'mongodb://settlersOfAsia:comp361@ds033116.mlab.com:33116/settlers'
};


// dependencies
var port        = Number(process.env.PORT || 3000);
var http        = require('http');
var mongoose    = require('mongoose');
var express     = require('express');
var bodyParser  = require('body-parser');
var socketio    = require('socket.io');
var redis       = require('redis');
var socketRedis = require('socket.io-redis');
var app         = express();
var server      = http.createServer(app);


// create a redis client
global.MyRedis = redis.createClient(ENV.redis.port, ENV.redis.host);
MyRedis.on("error", function(err) {
    console.error("REDIS ERROR:", err);
});


// create socket.io server, and use redis to allow broadcasting of events to multiple separate servers
global.io = socketio(server);
io.adapter(socketRedis({ host: ENV.redis.host, port: ENV.redis.port }));


// HTTP middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); 




// database
// mongoose.connect(ENV.db);


// routes
require('./server/routes.js')(app); // file fetching
require('./server/rest.js')(app); // all ajax request
require('./server/game.js'); // game



// start the server
server.listen(port, function() {
    console.log('SERVER STARTED ON PORT:', port);
    console.log('PROCESS PID:', process.pid);
});