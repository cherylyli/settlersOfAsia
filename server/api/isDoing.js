// display what the user is doing
// everytime user goes to a page, it updates his 'isDoing' field in global variable


// dependencies
var User = require('../../models/user.js');
var _ = require("underscore");
var _s = require('underscore.string');




// ----------------- helper functions ----------------- //

// capitalize first letter
function cap(word){
    return word.charAt(0).toUpperCase() + word.substring(1);
}


var is = {};

// Each user has { isDoing: { action: ____, link: ____ } }

// setter (modifying in GLOBAL this user's "isDoing" field)
function set(username, action, link){
    if (!link) link = '';
    User.isDoing(username, action, link);
}


// in random page
is.chilling = function(username){
    set(username, "is just chilling");
};

is.viewing_question = function(username, question_id, content){
    set(username, "is viewing " + content, "/question/" + question_id);
};

is.replying_question = function(username, question_id, content){
    set(username, "is replying " + content, "/question/" + question_id);
};

// in room, waiting for players to join (see routes.js)
is.waiting = function(username, game, link){
    set(username, "is waiting to play " + cap(game), link);
};

// during gameplay (see drawctionary/main.js)
is.playing = function(username, game, link){
    set(username, "is playing " + cap(game), link);
};

// in social circle
is.social = function(username){
    set(username, "is looking at Social Circle", '/social');
};

// in room
is.room = function(username){
    set(username, "is in a video call");
};

// in movie
is.movie = function(username){
    set(username, "is watching movies", '/movie');
};

// offline (see routes.js)
is.off = function(username){
    // when user goes offline, set him to offline in database
    set(username, "is offline");
};


module.exports = is;

