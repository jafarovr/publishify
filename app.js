var express = require('express');
var path    = require('path');
var fm      = require('./file-manager');

var default_path = 'public';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.url);
  // var err = new Error('Not Found');
  // err.status = 404;
  // next(err);
  var path = new Object();
  if (req.url == '/') {
    path = default_path;
  }
  else {
    path = default_path + req.url;
  }

  fm.listDir(path, function(response) {
    console.log(path);
    res.render('index', { files: response.files, path: req.url });
  });
  
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

