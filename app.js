// environments
// var local_redis = process.platform == 'win32' ? '192.168.6.147' : '127.0.0.1';
// var ENV = {
//     redis : { host: local_redis, port: 6379 }, // 192.168.6.131
//     db    : 'mongodb://settlersOfAsia:comp361@ds033116.mlab.com:33116/settlers' // mlab.com


// dependencies
var port        = Number(process.env.PORT || 3000);
var http        = require('http');
var mongoose    = require('mongoose');
var express     = require('express');
// var Session     = require('express-session');
var bodyParser  = require('body-parser');
var redis       = require('redis');
var app         = express();
var server      = http.createServer(app);
var socketio 	= require('socket.io');
var ios 		= require('socket.io-express-session');



// create a redis client
// global.MyRedis = redis.createClient(ENV.redis.port, ENV.redis.host);
// var bodyParser  = require('body-parser');
// var socketio    = require('socket.io');
// var redis       = require('redis');
// var socketRedis = require('socket.io-redis');
var app         = express();
var server      = http.createServer(app);


// create a redis client
// GLOBAL.MyRedis = redis.createClient(ENV.redis.port, ENV.redis.host);
// global.MyRedis = redis.createClient(ENV.redis.port, ENV.redis.host);
// MyRedis.on("error", function(err) {
//     console.error("REDIS ERROR:", err);
// });


// use redis for session
// var RedisStore = require('connect-redis')(Session);
// var sessionConfig = Session({
//   store: new RedisStore({ client: MyRedis }),
//   key: 'jsessionid',
//   secret: 'secret sauce',
//   saveUninitialized: false, // don't create session until something stored; however, this will create a temporary session that last for the duration of the request
//   resave: false, // don't save session if unmodified
//   cookie: { secure: false, maxAge: 365*24*60*60*1000 }, // session expires in 1 year
//   rolling: true // any subsequential request resets the maxAge
// });
// create socket.io server, and use redis to allow broadcasting of events to multiple separate servers
// global.io = socketio(server);
// io.adapter(socketRedis({ host: ENV.redis.host, port: ENV.redis.port }));


// HTTP middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(sessionConfig);

// database
mongoose.connect(ENV.db);


// socket.io
// var io = socketio(server);
// var socketUser = require('./server/middleware/socketUser.js');
// io.use(ios(sessionConfig));
// io.use(socketUser); // access user object from socket.user
// global.io = io;
app.use(express.static(__dirname + '/public')); 




// database
// mongoose.connect(ENV.db);


// routes
require('./server/routes.js')(app); // file fetching
// require('./server/rest.js')(app); // all ajax request
require('./server/game.js'); // game


// start the server
server.listen(port, function() {
    console.log('SERVER STARTED ON PORT:', port);
    console.log('PROCESS PID:', process.pid);
});