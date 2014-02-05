/**
 * @author
 */
var Auth = require('./auth').Auth;

exports.login = function(req, res) {
    res.render('auth_login.jade', {
        path: req.query.path,
        title: 'Login'
    });
};

exports.authenticate = function(passport) {
    return function(req, res, next) {
        passport.authenticate('local', function(error, user, info) {
            var path = req.query.path;
            if (error) {next(error); return;}
            if (!user) {
                if (typeof path != 'undefined') res.redirect('/auth/login/?path=' + path);
                else res.redirect('/auth/login');
                return;
            }
            req.logIn(user, function(error) {
                if (error) {next(error); return;}
                if (typeof path != 'undefined') res.redirect(path);
                else res.redirect('/');
            });
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