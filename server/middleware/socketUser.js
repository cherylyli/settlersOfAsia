// get user object from session

var _ = require('underscore');
var _h = require('../api/helper_functions.js');



module.exports = function(socket, next){
    var session = socket.handshake.session;
    if (session) socket.user = session.user;
    next();
};
