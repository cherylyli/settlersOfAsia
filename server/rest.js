// dependencies
var _ = require("underscore");
var async = require('async');
var _h = require('./api/helper_functions.js');
var Uuid  = require('uuid');
var User = require('../models/user.js');
var notify  = require('./api/notify.js');
var Data  = require('./engine/Data.js');
let CircularJSON = require('circular-json');




function deepClone(o){
    return CircularJSON.parse(CircularJSON.stringify(o));
}


// all RESTful requests
module.exports = function(app) {

    // signup
	app.post('/signup', function(req, res){
        var me = _.pick(req.body, 'profile_pic', 'username', 'password');

        if (!me.username) return res.json({ success: false, error: 'Please enter username' });
        if (!me.password) return res.json({ success: false, error: 'Please enter passowrd' });

        User.signup(me, function(userData){
            // signup success!
            if (userData){
                req.session.user = User.sessionize(userData);
                req.session.save(function(){
                    res.json(_.extend({ success: true, userData: userData }));
                    console.log('User', me.username, 'just signed up!');
                });
            }
            // signup failed!
            else {
                res.json({ success: false, error: "Username already taken." });
            }
        });
    });


    // login
    app.post('/login', function(req, res){
        var { username, password } = req.body;

        if (!username) return res.json({ success: false, error: 'Please enter username' });
        if (!password) return res.json({ success: false, error: 'Please enter passowrd' });

        User.login(username, password, function(userData){
            // login success!
            if (userData){
                req.session.user = User.sessionize(userData);
                req.session.save(function(){
                    res.json(_.extend({ success: true, userData: userData }));
                    console.log('User', username, 'just logged in!');
                });
            }
            // login failed!
            else {
                res.json({ success: false, error: "Wrong username or password." });
            }
        });
    });

    // logout
    app.get('/logout', function(req, res){
        if (!req.session) return res.end();
        req.session.destroy(function(){
            res.redirect('/');
        });
    });

    // fetch my data
    app.get('/mydata', function(req, res){
        if (req.session && req.session.user) {
            User.fetchPrivate(req.session.user._id, function(userData){
                if (userData) res.json(userData);
                else res.end();
            });
        }
        else res.end();
    });

    // fetch all rooms
    app.get('/rooms', function(req, res){
        res.json(CircularJSON.stringify(Data.rooms));
    });

    // fetch all users
    app.get('/users', function(req, res){
        // all online users
        var keys = _.filter(_.keys(io.sockets.adapter.rooms), function(name){
            return name.indexOf('user:') == 0;
        });
        var usernames = _.map(keys, function(key){
            return key.replace('user:', '');
        });
        // map <username> to an object containing his online activity
        User.fetchManyByUsername(usernames, User.minFields, function(users){
            //by default, everyone's status is in lobby
            _.each(users, function(user){
                user.status = 'Just chilling'
            });
            // then for every in-game player, set status as his current match type
             _.each(deepClone(Data.rooms), function(room, id){
                if (!_.isObject(room) || _.size(room.users) == 0) return;
                _.each(_.values(room.users), function(u){
                    var user = deepClone(u.user);
                    user.roomId = id;
                    if (!room.match){
                        user.status = `Waiting for players`;
                    }
                    else {
                        user.status = `Playing ${room.gameScenario}`;
                    }
                    users[user.username] = user;
                });
            });
            // send result
            res.json(users);
        });
    });


};