var http      = require('http');
var path      = require('path');
var fs        = require('fs');
var filesize  = require('filesize');
var moment    = require('moment');
var mime      = require('mime');

exports.serveStatic = function (filePath, callback) {
  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(err, data) {
        if(err) {
          callback('read err', null)
        }
        else {
          var file = new Object();
          file.path = filePath;
          file.contents = data;
          callback(null, file);
        }
      })
    }
    else {
      callback('not found', null)
    }
  })
}

exports.listDir = function(path, callback) {
  var response = new Object();
  fs.readdir(path, function(err, files) {
    if (err) {
      callback('read err', null);
    }
    else {
      response.path = path;
      response.files = [];
      files.forEach(function(f) {
        var file = new Object();
        file.name = f;
        var stats = fs.statSync(path + '/' + f);
        file.size = filesize(stats.size);
        file.last_modified = moment(stats.mtime).format('lll');
        if(fs.lstatSync(path + '/' + f).isDirectory() || fs.lstatSync(path + '/' + f).isSymbolicLink()) {
          file.type = 'folder';
        }
        else {
          file.type = 'file outline';
        }
        response.files.push(file);
      })
      callback(null, response);
    }
  });
}

exports.sendFile = function(response, file) {
  response.writeHead(200, {
    'Content-Type' : mime.lookup(path.basename(file.path))
  });
  response.end(file.contents);
}