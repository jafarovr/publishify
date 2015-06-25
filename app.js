var express = require('express');
var path    = require('path');
var fm      = require('./file-manager');

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
    var files = [
      { name: "node module", size: "105MB", last_modified: "2015-05-17 00:17", type: "file outline"},
      { name: "node module", size: "105MB", last_modified: "2015-05-17 00:17", type: "file outline"},
      { name: "node module", size: "105MB", last_modified: "2015-05-17 00:17", type: "folder"},
      { name: "node module", size: "105MB", last_modified: "2015-05-17 00:17", type: "folder"},
      { name: "node module", size: "105MB", last_modified: "2015-05-17 00:17", type: "file outline"}
    ];
    res.render('index', {files: files});
  });

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});