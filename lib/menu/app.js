/**
 * @author
 */
var routes = require('./index');
var auth = require('../auth/app');

exports.init = function(app) {
    app.get('/admin/menu', auth.ensureAuthenticated, routes.index);
};