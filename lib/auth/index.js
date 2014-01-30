/**
 * @author
 */
var Auth = require('./auth').Auth;

exports.login = function(req, res) {
    res.render('auth_login.jade', {
        title: 'Login'
    });
};

exports.loginUserAuth = function(req, res) {
    res.redirect('/');
};

exports.loginUser = function(passport) {
    return function(req, res, next) {
        passport.authenticate('local', function(error, user, info) {
            if (error) {next(error); return;}
            if (!user) {
                req.session.messages = [info.message];
                res.redirect('/auth/login');
            } else {
                req.logIn(user, function(error) {
                    if (error) next(error);
                    else res.redirect('/');
                });
            }
        })(req, res, next);
    };
};

exports.register = function(req, res) {
    res.render('auth_register.jade', {
        title: 'Register User'
    });
};

exports.registerUser = function(req, res) {
    Auth.save({
        username: req.param('username'),
        password: req.param('password')
    }, function(err, user) {
        res.redirect('/');
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};