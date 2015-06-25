var http = require('http');
var path = require('path');
var fs   = require('fs');
var mime = require('mime');

function sendFile(response, filePath, fileContents) {
  var header = {'Content-Type' : mime.lookup(path.basename(filePath))};
  response.writeHead(200, header);
  response.end(fileContents);
}

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end('404 Not Found');
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
            send404(response);
          }
          else {
            sendFile(response, filePath, data);
          }
        })
    }
    else {
      send404(response);
    }
  })
}

function listDir(res, path) {
  fs.readdir(path, function(err, files) {
      if (err) {
        res.end('Directory error!');
      }
      else {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write('<h3>Files in ' + path + ' </h3><ol>');
        if (files.length == 0) {
          res.end('No files.');
        }
        files.forEach(function(f) {
          res.write('<li><a href="' + f + '">' + f + '</a></li>');
        })
        res.end('</ol>');
      }
    });
}

http.createServer(function(req, res) {
  var path = 'files' + req.url;
  serveStatic(res, path);
}).listen(8000);