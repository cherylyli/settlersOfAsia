// this file handles the routing for photo upload on user's profile > photo page

// Export our API
var Upload = module.exports = {};

// load up dependencies
var fs = require("fs");
var util = require('util');
var _ = require("underscore");
var async = require("async");
var multer  = require('multer');
var Photo = require('../../models/photo.js');
var Feed = require('../../models/feed.js');
var Exp = require('../../models/exp.js');
var Question = require('../../models/question.js');
var validateMember = require('../middleware/isMember.js');
var lwip = require('lwip');
var imager = require('../api/imager.js');
var notify = require('../api/notify.js');
var _h = require('../api/helper_functions.js');
var mp3 = require('../api/mp3.js');
var crypto = require('crypto');


// --------------> helper functions <-------------- //
var maxPhotoSize = 1000000 * 10; // 10 MB max file size (photo)
var maxAudioSize = 1000000 * 20; // 20 MB max file size (audio)
var maxAnySize = 1000000 * 30; // 30 MB max file size (anything)
var isPhotoValid = function(extension){
    if (!extension) return;
    return _.contains(['png', 'jpg', 'jpeg'], extension.toLowerCase());
};
var isAudioValid = function(extension){
    if (!extension) return;
    return _.contains(['mp3'], extension.toLowerCase());
};


// append a string to a filename, return the new filename
function appendToFilename(filename, string){
    var dotIndex = filename.lastIndexOf(".");
    if (dotIndex == -1) return filename + string;
    else return filename.substring(0, dotIndex) + string + filename.substring(dotIndex);
}

// get extension of a path
function getExtension(path){
    if (path.indexOf('.') >= 0) return path.split('.').pop();
    else return '';
}

// change the extension of a path
function changeExtension(path, extension){
    return (path.substr(0, path.lastIndexOf(".")) + '.' + extension);
}

// get file name
function getFilename(s){
    return s.substring(0, s.lastIndexOf('.'));
}



// upload anything
Upload.any = multer({
    storage :  multer.diskStorage({
        destination : function (req, file, cb) {
            cb(null, 'public/uploads')
        },
        filename    : function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                cb(null, raw.toString('hex') + Date.now() + '.' + getExtension(file.originalname));
            });
        }
    }),
    limits: {
        fileSize: maxAnySize
    }
}).single('file');



// upload profile pic
var uploadProfilePic = multer({
    storage :  multer.diskStorage({
        destination : function (req, file, cb) {
            cb(null, 'public/photo')
        },
        filename    : function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                cb(null, raw.toString('hex') + Date.now() + '.' + getExtension(file.originalname));
            });
        }
    }),
    // file size limit
    limits: {
        fileSize: maxPhotoSize
    },
    // abord upload if file is not image
    fileFilter: function (req, file, cb) {
        var extension = getExtension(file.originalname);
        if (!isPhotoValid(extension)) {
            return cb(new Error('Not a valid image.'))
        }
        cb(null, true)
    }
}).single('file');




// upload profile picture, and resize it
Upload.profilePic = function(req, res, next){
    // 1. upload it
    uploadProfilePic(req, res, function(err){
        // 2. handle error, put it in 2nd parameter of callback if any, and halt execution
        if (err) {
            var error;
            if (err.code == 'LIMIT_FILE_SIZE') error = 'Image size too big';
            else error = 'Not a valid image';
            return next(null, error);
        }
        // make sure file is defined
        var file = req.file;
        if (!file || !file.path) return next(null, 'Image error');
        // 3. convert img to .jpg, and resize it to smaller
        var oldFilePath = file.path; // save old file path
        var extension = 'jpg'; // change format, this must be the same extension as the one in imager.process() function
        var filename = appendToFilename(changeExtension(file.filename, extension), _.random(0, 9)); // new file name
        var filepath = file.destination + '/' + filename; // new file path
        var url = filepath.replace('public', ''); // save file url to be written later in database
        var maxSize = 500; // maximum picture width
        imager.process(oldFilePath, filepath, maxSize, function(success){
            if (success) return next(url);
            else return next(null, 'Process image failed.');
        });
    });
};




// upload audio
Upload.audio = multer({
    storage :  multer.diskStorage({
        destination : function (req, file, cb) {
            cb(null, 'public/audio')
        },
        filename    : function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                cb(null, raw.toString('hex') + Date.now() + '.' + getExtension(file.originalname));
            });
        }
    }),
    limits: {
        fileSize: maxAudioSize
    },
    // ensure is audio
    fileFilter: function (req, file, cb) {
        if (!isAudioValid(getExtension(file.originalname))) {
            return cb(new Error('Not a valid audio.'))
        }
        cb(null, true);
    }
}).single('file');