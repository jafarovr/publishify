var http = require('http');
var path = require('path');
var fs   = require('fs');
var mime = require('mime');

function send404() {
  var err = new Error('Not Found');
  err.status = 404;
}

function sendFile(response, filePath, fileContents) {
  var header = {'Content-Type' : mime.lookup(path.basename(filePath))};
  response.writeHead(200, header);
  response.end(fileContents);
}

function serveStatic(response, filePath) {
  fs.exists(filePath, function(exists) {
    if (exists) {
      if (fs.lstatSync(filePath).isDirectory()) {
        listDir(response, filePath);
      }
      else
        fs.readFile(filePath, function(err, data) {
          if(err) {
            send404();
          }
          else {
            sendFile(response, filePath, data);
          }
        })
    }
    else {
      send404();
    }
  })
}

exports.listDir = function(path, callback) {
  var response = new Object();
  fs.readdir(path, function(err, files) {
    if (err) {
      send404();
    }
    else {
      response.path = path;
      response.files = [];
      files.forEach(function(f) {
        file = new Object();
        file.name = f;
        var stats = fs.statSync(path + "/" + f);
        file.size = stats.size;
        var d = new Date(Date.parse(stats.mtime));
        file.last_modified = d.toDateString();
        if(fs.lstatSync(path + "/" + f).isDirectory()) {
          file.type = 'folder';
        }
        else {
          file.type = 'file outline';
        }
        response.files.push(file);
      })
    }
    callback(response);
  });
}

http.createServer(function(req, res) {
  var path = 'files' + req.url;
  serveStatic(res, path);
}).listen(8000);