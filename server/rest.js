// dependencies
var _ = require("underscore");
<<<<<<< HEAD
var async = require('async');
var _h = require('./api/helper_functions.js');
var Uuid  = require('uuid');
var User = require('../models/user.js');

=======
>>>>>>> setup the groundwork for the project


// all RESTful requests
module.exports = function(app) {

<<<<<<< HEAD
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
=======
	

>>>>>>> setup the groundwork for the project


};