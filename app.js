
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var db = require('./lib/database');
var blog = require('./lib/blog/app');
var secrets = require('./lib/secrets');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser(secrets.secrets.cookieParser));
app.use(express.session({secret: secrets.secrets.session}));
app.use(express.methodOverride());
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.enable('trust proxy');

// Initialize the database.
db.start('localhost', 27017, 'exploring-lines-blog', function() {
    // Initialize each module.
    blog.init(app);

    // Start the server.
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
});

