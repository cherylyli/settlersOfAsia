// dependencies
var _ = require("underscore");


// send file from public folder
function sendView(req, res, next) {
    res.sendView = function(file) {
        return res.sendFile(file, { root: __dirname + '/../public' });
    }
    next();
}



// define routes
module.exports = function(app) {

	// home page
    app.get('/', sendView, function(req, res){
        res.sendView('lobby.html');
    });

    // game page
    app.get('/login', sendView, function(req, res){
        res.sendView('login.html');
    });

    app.get('/signup', sendView, function(req, res){
        res.sendView('registration.html');
    });

    app.get('/game', sendView, function(req, res){
        res.sendView('game.html');
    });



};