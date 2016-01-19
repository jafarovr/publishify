#!/usr/bin/env node

var express = require('express');
var path    = require('path');
var fm      = require('./publishify');
var fs      = require('fs');
var mime    = require('mime');
var favicon = require('serve-favicon');
var program = require('commander');

var app     = express(); 
var port    = 0;
var default_path = '.';
var version = '0.0.3';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(function(req, res) {
  // console.log('DEBUG: req.url: ' + req.url);
  if(req.query.download != undefined) {
    var path = default_path + req.query.download;
    fs.exists(path, function(exists) {
        if (exists) {
          res.download(path, function(err) {
            if (err) {
              showErrorPage(res, 'read err');
            }
          });
        }
        else {
          showErrorPage(res, 'not found');
        }
    });
  }
  else {
    var path = new Object();

    // fix if there's space and other unsupported chars in dir/file
    req.url = decodeURI(req.url);

    if (req.url == '/') path = default_path;
    else path = default_path + '' + req.url;

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
  }
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

program
  .version(version)
  .usage('[options] <directory>')
  .description('A simple command-line tool that allows you to publish any directory as as HTTP web index')
  .option('-p, --port [number]', 'port for web server', parseInt)
  .parse(process.argv);

if (program.port && program.port > 1) port         = program.port;
if (program.args[0] != undefined)     default_path = program.args[0];

var server = app.listen(port, function() {
  console.log('publishify running on port ' + server.address().port + ' and directory ' + default_path);
})

server.on('error', function(err) {
  console.log('Unexpected Error!\n' + JSON.stringify(err));
});
