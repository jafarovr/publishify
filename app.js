#!/usr/bin/env node

var express = require('express');
var path    = require('path');
var fm      = require('./publishify');
var fs      = require('fs');
var mime    = require('mime');


var app = express();

var args = process.argv.slice(2);

var port = args[0];
var default_path = args[1];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res) {
  // console.log('DEBUG: req.url: ' + req.url);
  
  var path = new Object();

  if (req.url == '/') path = default_path; 
  else path = default_path + req.url;

  fs.exists(path, function(exists) {
    if (exists) {
      if (fs.lstatSync(path).isDirectory() || fs.lstatSync(path).isSymbolicLink()) {
        fm.listDir(path, function(err, response) {
          // console.log('DEBUG: path: ' + path);
          if (!err) res.render('index', { files: response.files, path: req.url });
          else showErrorPage(res, err);
        });
      }
      else {
        fm.serveStatic(path, function(err, file) {
          if (!err) sendFile(res, file);
          else showErrorPage(res, err);
        });
      }
    }
    else {
      showErrorPage(res, 'not found');
    }
  });
});

function sendFile(response, file) {
  response.writeHead(200, { 
    'Content-Type' : mime.lookup(path.basename(file.path))
  });
  response.end(file.contents);
}

function showErrorPage(response, err) {
  if (err == 'not found') {
    var message = 'Not Found!';
    var status = 404;
  }
  else if (err == 'read err') {
    var message = 'Directory/File read error!';
    var status = 500;
  }
  else {
    var message = 'Unknown Error!';
    var status = 500;
  }
  response.render('error', { message: message, status: status });
}


// check port and directory before starting the app! boring if cases :(
if(args.length != 2) {
  console.log('USAGE: publishify PORT directory\nEXAMPLE: publishify 3000 ../test');
  process.exit();
}

if (port % 1 != 0) {
  console.log('Port should be positive integer value.');
  process.exit();
}

if (port > 65535 || port < 1 ) {
  console.log('Only ports between 1 and 65535 are allowed.');
  process.exit();
}

var server = app.listen(port, function() {
  console.log('publishify running on port ' + server.address().port + ' and directory ' + default_path);
})

server.on('error', function(err) {
  if (err.errno == 'EACCES' && err.syscall =='listen')
    console.log('It seems the OS didn\'t like the port you entered. Please choose another.');
  else
    console.log('Unexpected Error! You can report following error code to rj@rjv.me.\n' + JSON.stringify(err));
});

