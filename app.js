
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var db = require('./lib/database');
var config = require('./lib/config');
var blog = require('./lib/blog/app');
var auth = require('./lib/auth/app');
var admin = require('./lib/admin/app');
var menu = require('./lib/menu/app');
var index = require('./lib/index');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

/**
 * Starts the server.
 */
function startServer() {
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
}

// Setup the node application.
var app = express();
app.use(favicon(__dirname + '/public/images/favicon.ico'));
// Passport setup.
auth.passportSetup(passport);
// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(config.secret));
app.use(cookieSession({
    keys: ['PugmainPug'],
    cookie: {maxAge: 60 * 60 * 1000}}
));
app.use(methodOverride());
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(auth.userInfo);
// Set the static directory.
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.enable('trust proxy');

// Initialize the database.
db.start(config.dbServer, config.dbPort, config.dbName, function() {
    // Initialize each module.
    blog.init(app);
    auth.init(app, passport);
    admin.init(app);
    menu.init(app);

    // Check for commands.
    switch (process.argv[2]) {
        case '--createuser':
            var name = process.argv[3];
            var password = process.argv[4];
            if (!name) console.error('Username not provided.');
            if (!password) console.error('Password not provided.');
            if (!name || !password) process.exit(1);
            var Auth = require('./lib/auth/auth').Auth;
            Auth.save({username: name, password: password}, function(error, user) {
                if (error) {
                    console.error('Could not create user.');
                    process.exit(1);
                }
                console.log('User ' + name + ' created.');
                process.exit(0);
            });
            break;
        default:
            startServer();
    }
});

