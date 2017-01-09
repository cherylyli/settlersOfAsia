
// convert .wav to .mp3

var mp3 = module.exports = {};


var fs = require('fs');
var lame = require('lame');
var wav = require('wav');
var async = require('async');


// change the extension of a path
function changeExtension(path, extension){
    return (path.substr(0, path.lastIndexOf(".")) + '.' + extension);
}





mp3.convert = function(input_path, callback){

  var output_path = changeExtension(input_path, 'mp3');
  var input = fs.createReadStream(input_path);
  var output = fs.createWriteStream(output_path);

  // start reading the WAV file from the input
  var reader = new wav.Reader();

  // we have to wait for the "format" event before we can start encoding
  reader.on('format', function(format){

    // encoding the wave file into an MP3 is as simple as calling pipe()
    var encoder = new lame.Encoder(format);
    var o = reader.pipe(encoder).pipe(output);

    o.on('err', function(err){
      console.log('mp3 conversion error:', err, input_path, output_path);
      callback(false);
    });
    o.on('finish', function(){
      callback(output_path);

      // remove old file (.wav)
      fs.unlink(input_path, function(err){
        if (err) console.log('delete old wav file error:', err, input_path, output_path);
      });
    });
  });

  // and start transferring the data
  input.pipe(reader);
};






