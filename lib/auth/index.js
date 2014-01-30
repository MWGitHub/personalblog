/**
 * @author
 */
var Auth = require('./auth').Auth;

exports.login = function(req, res) {
    res.render('auth_login.jade', {
        title: 'Login'
    });
};

exports.loginUser = function(req, res) {
    res.redirect('/');
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