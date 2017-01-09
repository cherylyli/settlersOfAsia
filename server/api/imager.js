// provides function to
// 1. download image
// 2. compress and resize image

var fs = require("fs");
var util = require('util');
var _ = require("underscore");
var lwip = require('lwip');
var request = require('request');
var crypto = require('crypto');


// contains functions we want to export
var imager = module.exports = {};


// helper functions
function isAcceptableFormat(format){
    if (!format) return false;
    return _.contains(['png', 'jpg', 'jpeg', 'gif'], format.toLowerCase());
}





// ==================================== API ====================================

// format an image to JPG, and resize it
imager.process = function(oldFilePath, newFilePath, maxSize, callback){

    lwip.open(oldFilePath, function(err, image){
        if (err) { console.error('lwip.open err', err, oldFilePath); callback(false); return; }
        // resize image if width is larger than maxSize (defaults to 1000px)
        maxSize = maxSize || 1000; 
        var width = image.width();
        var height = image.height();
        var ratio = width / height;
        if (width > maxSize) {
            width = maxSize;
            height = parseInt(width / ratio);
        }
        image.resize(width, height, function(err, image){
            if (err) { console.error('image.resize err', err); callback(false); return; }
            lwip.create(image.width(), image.height(), 'white', function(err, canvas){
                if (err) { console.error('lwip.create err', err); callback(false); return; }
                canvas.paste(0, 0, image, function(err, image){
                    if (err) { console.error('canvas.paste err', err); callback(false); return; }
                    image.batch()
                    .writeFile(newFilePath, 'jpg', { quality : 80 }, function(err){
                        fs.unlink(oldFilePath, function(err){ // delete old file
                            if (err) { console.error('delete old file err', err); callback(false); return; }
                            else callback(true);
                        });
                    });
                });
            });
        });
    });
};


// generate a random filename
imager.randomFilename = function(){
    var random_string = (Date.now() + Math.random()).toString();
    return crypto.createHash('md5').update(random_string).digest('hex');
}

// return the extension of a path, also removing any query strings
imager.getExtension = function(path){
    if (path && path.indexOf('.') >= 0) {
        return path.split('.').pop().split(/[?#]/)[0];
    }
    else return '';
};



// download an image from internet given its URL
imager.download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        var download = request(uri).pipe(fs.createWriteStream(filename));
        download.on('err', function(err){
            console.log('imager.download err', err)
            callback(false);
        });
        download.on('close', function(){
            callback(true);
        });
    });
};


// download an image given URL, process it, and save it to public/photos folder
// returns the saved file path
imager.downloadAndSave = function(uri, callback){
    var originalExtension = imager.getExtension(uri);
    if (!isAcceptableFormat(originalExtension)){
        callback(false); return;
    }
    var filename = imager.randomFilename();
    var pathPrefix = 'public/photos/' + filename;
    var oldFilePath = pathPrefix + '.' + originalExtension;
    var newFilePath = pathPrefix + _.random(0, 9) + '.jpg';

    imager.download(uri, oldFilePath, function(success){
        if (success) {
            imager.process(oldFilePath, newFilePath, function(success){
                if (success) {
                    callback(newFilePath);
                }
                else callback(false);
            });
        }
        else {
            callback(false);
        }
    });
}


// given the user ID of someone's facebook, download his profile picture to public/photos
// 1) the url from graph API will return a JSON that contains the real url of the picture
// 2) we convert that json string to real json, we use try catch to ensure no crash
// 3) download the image from the real url
// 4) return the file path
imager.downloadFacebookProfilePic = function(userId, callback){
    var tmpUrl = 'https://graph.facebook.com/' + userId + '/picture?height=1000&redirect=false';
    request(tmpUrl, function(err, res, body){
        var json;
        if (!body){
            callback(false); return;
        }
        // make sure the json string is well formatted
        try { json = JSON.parse(body); }
        catch(err) { console.log('facebook response json conversion err', err); return; }
        var realUrl = json.data.url;
        // download from real URL
        imager.downloadAndSave(realUrl, function(filePath){
            callback(filePath);
        });
    });
};





