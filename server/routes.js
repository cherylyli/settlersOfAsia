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

    app.put('/addRoom', function(req, res){

        db.ref('rooms').push().set({
            roomName: req.body.roomname,
            players: [req.body.userid],
            owner: req.body.userid
        });
        res.status(200).end("ok");
    });

    // put userid in the list of people already in the room, redirect to a the game room
    app.put('/enterRoom', function(req, res){
        console.log(req.body);

        db.ref('rooms/' + req.body.roomid).once("value", function(snapshot){
            if (!snapshot.val()) return;
            var players = snapshot.val().players;
            if (players.indexOf(req.body.userid) == -1 && players.length < 4){
                players.push(req.body.userid);
            } else if (players.indexOf(req.body.userid) > 0) {
                console.log(48);
                return res.send("ok");
            }
            console.log(players);
            db.ref('rooms/' + req.body.roomid + '/').update({players: players});
            return res.send("ok");

        });
    });


};