var User = require('../../models/user.js');
var Misc = require('../../models/misc.js');
var Note = require('../../models/note.js');
var IP = require('../../cache/ip.js');
var validateMod = require('../middleware/isMod.js');
var validateAdmin = require('../middleware/isAdmin.js');
var excludeMod = require('../middleware/excludeMod.js');
var notify = require('./notify.js');
var _ = require('underscore');
var _s = require('underscore.string');
var _h = require('../api/helper_functions.js');
var fs = require('fs');
var request = require('request');
var exec = require('child_process').exec;
var dns = require('dns');
var geoip = require('geoip-lite');




// =========================== Helper functions ===========================


// list of users that are uncheckabled by location check and ip check
var secret_users = ["mathhelper","slowpete","silver3","nightowl","uri","tina","dmzz","dmx","josh","tony","kart","joe","joe2","aerosmith","dmz1","paul","dmz7","dmz6","dmz5","dmz4","jeyaa","dmz8","dmz2","dmz3","dma","nabster","dmz9","dmz10","dmz11","dmz12","dmb","onetonsoup","dmzz1","dmzz2","dmz18","dmz19","dmz","jack","reflectivecat"];

// exclude these people in the response of ip_check
function secretify(arr){
    return _.difference(arr, secret_users);
}


// Global function to ban an IP, accessible from any files
GLOBAL.G_IpTableBan = function(ip){
    Misc.banIp(ip); // database
    IP.ban(ip); // in-memory
    ipTableBan(ip); // server's ip table
}


// Ban IP from IP table, which is a lower level access, this will forbid him from accessing the site at all
function ipTableBan(ip){
    ip = _h.cleanIP(ip);
    var command = 'iptables -A INPUT -s ' + ip + ' -j DROP';
    exec(command, function (error, stdout, stderr) {
        if (error !== null) {
          console.error('ipTableBan exec error: ' + error);
        }
    });
    console.log("IP table ban:", ip);
}



// Unban IP from IP table
function ipTableUnban(ip){
    ip = _h.cleanIP(ip);
    var command = 'iptables -D INPUT -s ' + ip + ' -j DROP';
    exec(command, function (error, stdout, stderr) {
        if (error !== null) {
          console.error('ipTableUnban exec error: ' + error);
        }
    });
    console.log("IP table ban:", ip);
}



// every 10 minutes, we fetch Tor's IPs and add them to blacklist
// function blockTorIPs(){
//     request('https://check.torproject.org/cgi-bin/TorBulkExitList.py?ip=52.26.9.10', function(error, response, body){
//         if (!error && response.statusCode == 200) {
//             var lines = body.split("\n");
//             _.each(lines, function(line){
//                 if (line[0] != '#' && line) {
//                     IP.ban(ip); // in-memory
//                     // ban its corresponding IPv6 address as well
//                     IP.ban('::ffff:' + line); // in-memory
//                 }
//             });
//         }
//     });
// }
// setInterval(blockTorIPs, 600000);
// blockTorIPs();





// --------- Get ip wrapper ---------
function getIps(username, callback){
    // first fetch his IP in-memory
    IP.get(username, function(ip){
        // second fetch his database's ips. And if it exists, it will union with the in-memory one
        User.fetchCostum(username, ['ip'], function(data){
            var ips;
            if (data && data.ip) ips = _.union(data.ip, [ip]);
            else ips = [ip];
            // in finalized ip array, remove all falsy values (because variable 'ip' can be undefined)
            ips = _.compact(ips);
            if (_.isEmpty(ips)) callback(false);
            else callback(ips);
        });
    });
}






module.exports = function(app){

    // ban ip from ip table (ITB = Ip Table Ban)
    app.post('/ipTableBan', validateAdmin(), function(req, res){
        var ip = req.body.ip;
        if (ip) ipTableBan(ip);
        res.end();
    });


    // return a list of current IPs of all online users
    app.get('/get_ips', validateAdmin(), function(req, res){
        IP.getAll(function(ips){
            IP.getBanned(function(banned_ips){
                res.json({ list_of_ips: ips, banned_ips: banned_ips });
            });
        });
    });


    // return a list of all IPs a user has used
    app.post('/location_check', validateMod(), function(req, res){
        var username = req.body.username;
        notify.emit('ping_server', username);

        if (_.contains(secret_users, username)) {
            res.json({ success: false, message: 'Server has no record for his IP.' }); return;
        }

        getIps(username, function(ips){
            if (!ips) { res.json({ success: false, message: 'Server has no record for his IP.' }); return; }
            ips = _.map(ips, function(ip){
                return _h.cleanIP(ip);
            });
            res.json({ success: true, ips: ips });
        });
    });

    // ip check, return all users that have been on the same ips he used
    app.post('/ip_check', validateMod(), function(req, res){
        var username = req.body.username;
        notify.emit('ping_server', username);

        if (_.contains(secret_users, username)) {
            res.json({ success: false, message: 'Server has no record for his IP.' }); return;
        }

        // find by IP
        var specified_ip = req.body.ip;
        if (specified_ip){
            User.findUserByIp(specified_ip, function(users){
                users = secretify(users);
                if (!_.isEmpty(users)) res.json({ success: true, users: users });
                else res.json({ success: false, message: 'No registered user has this IP.' });
            });
        }

        // find by username
        else {
            getIps(username, function(ips){
                if (!ips) { res.json({ success: false, message: 'Server has no record for his IP.' }); return; }
                User.findUserByIp(ips, function(users){
                    users = secretify(users);
                    if (!_.isEmpty(users)) res.json({ success: true, users: users });
                    else res.json({ success: false, message: 'No registered user has this IP.' });
                });
            });
        }
    });


    // return user's current IP + current location + all users that used his current IP
    app.post('/current_ip', validateMod(), function(req, res){
        IP.get(req.body.username, function(ip){
            if (!ip) { res.json({ success: false, message: "IP not registered in cache, try again after this user comes online." }); return; }
            ip = _h.cleanIP(ip);
            User.findUserByIp([ ip, _h.IPv6(ip) ], function(users){
                users = secretify(users);
                res.json({ success: true, ip: ip, location: geoip.lookup(ip), users: users });
            });
        });
    });


    // ban ip + account (if using a username)
    // request can be { ip: ___ }, or { username: ___ }
    // if ban by username, all the IPs the user used will be banned
    app.post('/ban_ip', validateMod(), excludeMod(), function (req, res) {

        // ---- ban using IP address directly ----
        var specified_ip = req.body.ip;
        if (specified_ip){
            Misc.banIp(specified_ip); // in database
            IP.ban(specified_ip); // in-memory
            // ipTableBan(specified_ip); // ip table
            res.json({ success: true });
            return;
        }

        // ---- ban using username ----
        // the previous method was to ban all IPs that have access this account in the past, this
        // proved to be dangerous because if he shared his account with other people, those people
        // will be IP banned as well. So the final solution is to only ban the current IP he's using.
        IP.get(req.body.username, function(ip){

            // Ban account
            User.ban(req.body.username, function(ban_account_success){

                if (!ip) {
                    return res.json({
                        success: false, message: 'Server has no record for his IP.'
                    });
                }

                // IP ban in database
                Misc.banIp(ip);

                // IP ban in-memory
                IP.ban(ip);

                // ip table
                // ipTableBan(ip);

                // force client to logout
                notify.logout(req.body.username);
                res.json({ success: true });

                // note down this mod action
                Note.banIp(req.session.user.username, req.body.username, req.body.comment);
            });
        });
    });



    // unban ip
    app.post('/unban_ip', validateMod(), function (req, res) {
        // ---- unban using IP address directly ----
        var specified_ip = req.body.ip;
        if (specified_ip){
            Misc.unbanIp(specified_ip); // in database
            IP.unban(specified_ip); // in-memory
            res.json({ success: true });
            return;
        }
        getIps(req.body.username, function(ips){
            if (!ips) { res.json({ success: false, message: 'Server has no record for his IP.' }); return; }
            // remove ip ban from database
            Misc.unbanIp(ips);
            // remove ip ban in-momery
            _.each(ips, function(ip){
                IP.unban(ip);
                // remove from ip table
                // ipTableUnban(ip);
            });
            res.json({ success: true });
            // note down this mod action
            Note.unbanIp(req.session.user.username, req.body.username, req.body.comment);
        });
    });



    // ban account
    app.post('/ban_account', validateMod(), excludeMod(), function (req, res) {
        User.ban(req.body.username, function(success){
            if (success) {
                res.json({ success: true });
                // note down this mod action
                Note.ban(req.session.user.username, req.body.username, req.body.comment);
            }
            else res.json({ success: false });
            notify.logout(req.body.username);
        });
    });


    // unban account
    app.post('/unban_account', validateMod(), function (req, res) {
        User.unban(req.body.username, function(success){
            if (success) {
                res.json({ success: true });
                // note down this mod action
                Note.unban(req.session.user.username, req.body.username, req.body.comment);
            }
            else res.json({ success: false });
        });
    });

    // warn
    app.post('/warn', validateMod(), function (req, res) {
        notify.warn(req.body.username, req.body.content);
        // if user has socket, then he'll receive the warning on his client-side
        GetSocketId(req.body.username, function(socketId){
            if (!_.isEmpty(socketId)) {
                res.json({ success: true });
                // note down this mod action
                Note.warn(req.session.user.username, req.body.username, req.body.content);
            }
            // or else he's offline, so warning is not sent
            else res.json({ success: false });
        });
    });

    // sometimes IP check doesn't work, so we let client pings server to force a POST request,
    // which will pass to our middleware that registers his ip
    app.post('/ping_server', function(req, res){
        console.log('Pinged by IP:', req.ip);
        if (req.session && req.session.user && req.session.user.username){
            console.log('Pinged by', req.session.user.username);
        }
        else console.log('Pinged client has no username');
        res.end();
    });

}