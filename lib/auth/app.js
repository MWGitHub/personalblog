/**
 * @author
 */
var routes = require('./index');
var Auth = require('./auth').Auth;
var LocalStrategy = require('passport-local').Strategy;

// Sets up passport.
exports.passportSetup = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        Auth.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        Auth.findByUsername(username, function(error, user) {
            if (error) {done(error); return;}
            if (!user) {done(null, false, {message: 'Unknown user ' + username}); return;}
            Auth.comparePassword(user, password, function(error, isMatch) {
                if (error) {done(error); return;}
                if (isMatch) {
                    done(null, user);
                } else {
                    done(null, false, {message: 'Invalid password'});
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
    app.post('/auth/login', passport.authenticate('local', {
        failureRedirect: '/auth/login'
    }), routes.loginUser);
    app.get('/auth/register', module.exports.ensureAuthenticated, routes.register);
    app.post('/auth/register', module.exports.ensureAuthenticated, routes.registerUser);
    app.get('/auth/logout', routes.logout);
};