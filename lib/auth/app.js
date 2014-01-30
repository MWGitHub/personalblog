/**
 * @author
 */
var routes = require('./index');
var Auth = require('./auth').Auth;
var LocalStrategy = require('passport-local').Strategy;

// Sets up passport.
exports.passportSetup = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log(user._id);
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        console.log(id);
        Auth.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        Auth.findByUsername(username, function(error, user) {
            if (error) return done(error);
            if (!user) return done(null, false, {message: 'Unknown user ' + username});
            Auth.comparePassword(user, password, function(error, isMatch) {
                if (error) return done(error);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));
};

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) next();
    else res.redirect('/auth/login');
}

exports.init = function(app, passport) {
    app.get('/auth/login', routes.login);
    //app.post('/auth/login', routes.loginUser(passport));
    app.post('/auth/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    }), routes.loginUser(passport));
    app.get('/auth/register', routes.register);
    app.post('/auth/register', routes.registerUser);
    app.get('/auth/logout', routes.logout);
};