
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var db = require('./lib/database');
var config = require('./lib/config');
var blog = require('./lib/blog/app');
var auth = require('./lib/auth/app');
var admin = require('./lib/admin/app');
var index = require('./lib/index');

var app = express();

// Passport setup.
auth.passportSetup(passport);

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser(config.secret));
app.use(express.cookieSession({cookie: {maxAge: 60 * 60 * 1000}}));
app.use(express.methodOverride());
//app.use(express.session({secret: config.session}));
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
db.start(config.dbServer, config.dbPort, config.dbName, function() {
    // Initialize each module.
    blog.init(app);
    auth.init(app, passport);
    admin.init(app);

    // Start the server.
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
});

