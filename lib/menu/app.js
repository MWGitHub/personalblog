/**
 * @author
 */
var routes = require('./index');
var auth = require('../auth/app');

exports.init = function(app) {
    app.get('/menu/admin', auth.ensureAuthenticated, routes.index);
};