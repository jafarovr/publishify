var express = require('express');
var path    = require('path');
var fm      = require('./file-manager');
var fs      = require('fs');
var mime    = require('mime');

var default_path = '/Users/rj/htdocs';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  console.log('DEBUG: req.url: ' + req.url);
  
  var path = new Object();

  if (req.url == '/') path = default_path; 
  else path = default_path + req.url;

  fs.exists(path, function(exists) {
    if (exists) {
      if (fs.lstatSync(path).isDirectory() || fs.lstatSync(path).isSymbolicLink()) {
        fm.listDir(path, function(err, response) {
          console.log('DEBUG: path: ' + path);
          if (err == null) {
            res.render('index', { files: response.files, path: req.url });
          }
          else if(err == 'read err') {
            var message = 'Directory/File read error!';
            var status = 0;
            res.render('error', { message: message, status: status });
          }
        });
      }
      else {
        // console.log('file')
        // res.end('hehe');
        fm.serveStatic(path, function(err, file) {
          if (!err) {
            console.log('DEBUG: showFile: ' + path);
            showFile(res, file);
          }
          else if (err == 'not found') {
            var message = 'Not Found!';
            var status = 404;
            res.render('error', { message: message, status: status });
          }
          else if (err == 'read err') {
            var message = 'Directory/File read error!';
            var status = 0;
            res.render('error', { message: message, status: status });
          }
        })
      }
    }
    else {
      var message = 'Not Found!';
      var status = 404;
      res.render('error', { message: message, status: status });
    }
  });
});

function showFile(response, file) {
  var header = {'Content-Type' : mime.lookup(path.basename(file.path))};
  console.log('DEBUG: showFile header: ' + mime.lookup(path.basename(file.path)));
  response.writeHead(200, header);
  response.end(file.contents);
}

function downloadFile(response, file) {
  var header = {'Content-Type' : mime.lookup(path.basename(file.path)),
                'Content-Disposition' : 'attachment;'};
  console.log('DEBUG: showFile header: ' + mime.lookup(path.basename(file.path)));
  response.writeHead(200, header);
  response.end(file.contents);
}

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('node-file-manager listening on port ' + server.address().port);
});

