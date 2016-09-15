// dependencies
var _ = require("underscore");


// send file from public folder
function sendView(req, res, next) {
    res.sendView = function(file) {
<<<<<<< HEAD
        return res.sendFile(file, { root: __dirname + '/../public' });
=======
        return res.sendFile(file, { root: __dirname + '../../public' });
>>>>>>> setup the groundwork for the project
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
<<<<<<< HEAD
    app.get('/login', sendView, function(req, res){
        res.sendView('login.html');
    });

    app.get('/signup', sendView, function(req, res){
        res.sendView('registration.html');
    });

=======
>>>>>>> setup the groundwork for the project
    app.get('/game', sendView, function(req, res){
        res.sendView('game.html');
    });

<<<<<<< HEAD
    app.get('/room/:id', sendView, function(req, res){
        res.sendView('room.html');
    });

=======
>>>>>>> setup the groundwork for the project


};