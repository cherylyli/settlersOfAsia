
// expose our model to other modules
var User = module.exports = {};

// load the things we need
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var _h = require('../server/api/helper_functions.js');



// define the schema for our user model
var schemaTable = {

    username    : { type: String, required: true },
    password    : { type: String, required: true },
    profile_pic : { type: String, default: '/img/default_profile_pic.png' }
};


// create the actual schema
var userSchema = mongoose.Schema(schemaTable);

// define the indexes
userSchema.index({ username: 1 }, { unique: true });


// all fields used in schemas
var allFields = _.union(_.keys(schemaTable), ["_id"]);

// fields of a user that are publicly available to everyone
var publicFields = [
    '_id', 'username', 'profile_pic'
];
var publicFieldsStr = publicFields.join(' ');
var publicize = function(obj){ return _.pick(obj, publicFields); };
User.publicFields = publicFields;
User.publicize = publicize;

// fields of a user that are available to himself
var privateFields = _.without(allFields, 'password');
var privateFieldsStr = privateFields.join(' ');
var privatize = function(obj){ return _.pick(obj, privateFields); };
User.privateFields = privateFields;
User.privatize = privatize;

// fields in user's session
var sessionFields = ['_id'];
var sessionFieldsStr = sessionFields.join(' ');
var sessionize = function(obj){ return _.pick(obj, sessionFields); };
User.sessionFields = sessionFields;
User.sessionize = sessionize;

// fields in user's redis cache
var cacheFields = ['_id', 'name', 'profile_pic'];
var cacheFieldsStr = cacheFields.join(' ');
var cachize = function(obj){ return _.pick(obj, cacheFields); };
User.cacheFields = cacheFields;
User.cachize = cachize;

// minimum fields
User.minFields = ['_id', 'name', 'profile_pic'];

// create the model for users
var model = User.model = mongoose.model('user', userSchema);





User.fetchCustom = function(user_id, customFields, callback){
    callback = _.isFunction(callback) ? callback : function(){};
    if (!mongoose.Types.ObjectId.isValid(user_id)){
        console.error('User.fetchCustom invalid user id:', user_id);
        return callback(false);
    }
    if (!_.isArray(customFields)) {
        console.error('User.fetchCustom invalid fields:', user_id, customFields, callback.toString());
        return callback(false);
    }
    model
    .findOne({ _id: user_id })
    .select(customFields.join(' '))
    .lean()
    .exec(function (err, doc) {
        if (err) { console.error('User.fetchCustom err', err); callback(false); }
        // if found user
        else if (doc) {
            // if we want to know user's online stat as well, go to cache
            if (_.contains(customFields, 'online')){
                IsOnline(user_id, function(bool){
                    doc.online = bool;
                    callback(doc);
                });
            }
            else callback(doc);
        }
        // if not found
        else {
            console.error('fetchCustom: User', user_id, 'does not exist', callback.toString());
            callback(null);
        }
    });
};

// fetch user's public fields
User.fetchPublic = function(user_id, callback){
    User.fetchCustom(user_id, publicFields, callback);
};

// fetch user's public fields + whether or not he's online
User.fetchPublic2 = function(user_id, callback){
    User.fetchCustom(user_id, publicFields.concat(['online']), callback);
};

// fetch user's private fields
User.fetchPrivate = function(user_id, callback){
    User.fetchCustom(user_id, privateFields, callback);
};

// fetch many user (by id)'s certain fields, returns a JSON objects
User.fetchCustomMany = function(user_ids, fields, callback){
    callback = _.isFunction(callback) ? callback : function(){};
    var data = {};
    async.each(user_ids, function (user_id, _callback) {
        User.fetchCustom(user_id, fields, function(result){
            if (result) data[user_id] = result;
            _callback();
        });
    }, function(err){
        if (err) callback(false);
        else callback(data);
    });
};



// write user data into each document
//  - userIdField: name of the field containing user id
//  - fieldMaps: object that maps userData's fields to their new rewritten fields in docs
User.populate = function(docs, userIdField, fieldMaps, callback){
    var isSingle = (!_.isArray(docs)) && _.isObject(docs);
    if (isSingle) docs = [docs];
    // uniquefy user ids to reduce unnecessary user query
    var user_ids = _.uniq(_.pluck(docs, userIdField));
    // get all users' data
    User.fetchCustomMany(user_ids, _.keys(fieldMaps), function(users){
        users = users || {};
        // for each doc
        async.filter(docs, function(doc, _cb){
            // write user data into it (if user data is invalid, remove the associated doc)
            var userId = doc[userIdField];
            var userData = users[userId];
            if (!userData) return _cb(null, false);
            _.each(fieldMaps, function(newField, oldField){
                doc[newField] = userData[oldField];
            });
            _cb(null, true);
        }, function(err, results){
            if (isSingle) callback(results[0]);
            else callback(results);
        });

    });
}


User.signup = function(me, callback){
    var user = new model(me);
    user.save(function(err, doc){
        if (err) {
            console.error('signup err:', err, arguments);
            callback(false);
        }
        else if (doc) {
            callback(publicize(doc));
        }
        else {
            callback(false);
        }
    });
};


User.login = function(username, password, callback){
    if (!username || !password) { callback(false); return; }
    model
    .findOne({ username, password })
    .select(publicFieldsStr)
    .lean()
    .exec(function (err, doc){
        if (err) {
            console.error('login err:', err, arguments);
            callback(false);
        }
        // if found user
        else if (doc){
            callback(doc);
        }
        // if not found
        else {
            callback(null);
        }
    });
};

// return true if account can be created, name is not taken
User.canBeCreated = function(username, callback){
    model
    .findOne({ username })
    .lean()
    .select('_id')
    .exec(function (err, doc){
        if (err) {
            console.error('User.canBeCreated err:', err, username);
            callback(false);
        }
        else if (doc) callback(false);
        else callback(true);
    });
};

// check if user exist
User.exist = function(user_id, callback){
    model
    .findOne({ _id: user_id })
    .select('_id')
    .lean()
    .exec(function (err, doc){
        if (err) {
            console.error('User.exist err:', err, user_id);
            callback(false);
        }
        else if (doc) callback(true);
        else callback(false);
    });
};


