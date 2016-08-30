#!/usr/bin/env node

var express       = require('express');
var path          = require('path');
var publishify    = require('./publishify');
var fs            = require('fs');
var favicon       = require('serve-favicon');
var program       = require('commander');
var ip            = require('ip');
var localtunnel   = require('localtunnel');


var app           = express(); 
var port          = 0;
var default_path  = '.';
var version       = '0.0.5';
var ip_addr       = ip.address();
var should_hide   = true;
var expose        = false;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(function(req, res) {
  // if request is download?
  req.query.download != undefined ? download(res, req) : listFiles(res, req);
});

function download(res, req) {
  var path = default_path + req.query.download;
  fs.exists(path, function(exists) {
    if (exists) {
      res.download(path, function(err) {
        if (err) showErrorPage(res, 'read err');
      });
    }
    else showErrorPage(res, 'not found');
  });
}

function listFiles(res, req) {
  var path = new Object();

  // fix if there's space and other unsupported chars in dir/file
  req.url = decodeURI(req.url);
  path = req.url == '/' ? default_path : default_path.concat(req.url);

  fs.exists(path, function(exists) {
    if (exists) {
      if (fs.lstatSync(path).isDirectory() || fs.lstatSync(path).isSymbolicLink()) {
        // check if the file or folder is hidden?
        if (should_hide && path.indexOf("/.") > -1) {
          showErrorPage(res, 'forbidden err');
        }
        else publishify.listDir(path, should_hide, function(err, response) {
          if (!err) res.render('index', { files: response.files, path: req.url });
          else showErrorPage(res, err);
        });
      }
      else {
        publishify.serveStatic(path, function(err, file) {
          if (!err) publishify.sendFile(res, file);
          else showErrorPage(res, err);
        });
      }
    }
    else showErrorPage(res, 'not found');
  });
}


function showErrorPage(response, err) {
  var message, status;
  switch(err) {
    case 'not found':
      message = 'Not Found';
      status = 404;
      break;
    case 'read err':
      message = 'Directory / File Read Error';
      status = 400;
      break;
    case 'forbidden err':
      message = 'Forbidden';
      status = 403;
      break;
    default: 
      message = 'Something Bad Happened';
      status = 500;
  }
  response.render('error', { message: message, status: status });
}

program
  .version(version)
  .usage('[options] <directory>')
  .description('A simple command-line tool that allows you to publish any directory as as HTTP web index')
  .option('-p, --port [number]', 'port for web server', parseInt)
  .option('-x, --hidden', 'show hidden files. by default, hidden files are not accessible.')
  .option('-e, --expose', 'expose the directory to web. powered by localtunnel.')
  .parse(process.argv);

if (program.expose) expose = true
if (program.port && program.port > 1) port         = program.port;
if (program.args[0] != undefined)     default_path = program.args[0];
if (program.hidden)                   should_hide  = false;

var server = app.listen(port, function() {
  console.log('publishify running on directory ' + default_path);
  console.log('open http://' + ip_addr + ':' + server.address().port + '/ on your browser to view your files.' )
})
if (expose) {
  var tunnel = localtunnel(server.address().port, function(err, tunnel) {
    if (err) console.log("exposing your directory to web is not successful, try again.");
    console.log("your directory is also publicly available on " + tunnel.url);
  });
  tunnel.on('close', function() {
    console.log("localtunnel is closed now, please try again.");
  });
}

server.on('error', function(err) {
  console.log('Error: ' + JSON.stringify(err));
});
