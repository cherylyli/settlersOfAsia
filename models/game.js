
// expose our model to other modules
var Game = module.exports = {};

// load the things we need
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var _h = require('../server/api/helper_functions.js');
var CircularJSON = require('circular-json');



// define the schema 
var schemaTable = {
    room_id : { type: String, required: true },
    data    : { type: String, required: true },
};


// create the actual schema
var schema = mongoose.Schema(schemaTable);

// define the indexes
schema.index({ room_id: 1 }, { unique: true });


// all fields used in schemas
var allFields = _.union(_.keys(schemaTable), ["_id"]);

// create the model
var model = Game.model = mongoose.model('Game', schema);



// fetch a single game, return room object
Game.fetchOne = function(room_id, callback){
    callback = _.isFunction(callback) ? callback : function(){};
    model.findOne({ room_id: room_id }).lean().exec(function (err, doc) {
        if (err) { console.error('Game.fetchOne err', err); callback(false); }
        else if (doc) {
            callback(CircularJSON.parse(doc.data));
        }
        else {
            console.error('Game.fetchOne failed');
            callback(null);
        }
    });
};


// fetch all games, return a list of room objects
Game.fetchAll = function(callback){
    callback = _.isFunction(callback) ? callback : function(){};
    model.find({}).lean().exec(function (err, docs) {
        if (err) { console.error('Game.fetchOne err', err); callback(false); }
        else {
            var docs = docs || [];
            var rooms = docs.map(function(doc){
                return CircularJSON.parse(doc.data);
            })
            callback(rooms);
        }
    });
};


// save or update game, return true if success
Game.save = function(room_id, room_data, callback){
    callback = _.isFunction(callback) ? callback : function(){};
    model.findOneAndUpdate({ room_id: room_id }, { data: CircularJSON.stringify(room_data) }, { upsert: true, new: true }, function(err, doc){
        if (err) {
            console.error('Game.save err:', err);
            callback(false);
        }
        else if (doc) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
};

