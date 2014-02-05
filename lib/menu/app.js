/**
 * @author
 */
var routes = require('./index');
var auth = require('../auth/app');
var Menu = require('./menu');

exports.init = function(app) {
    app.get('/menu/admin', auth.ensureAuthenticated, routes.index);
    app.post('/menu/admin', auth.ensureAuthenticated, routes.postItems(app));

    // Set the items for the menu.
    Menu.findAll(function(error, items) {
        app.locals.menuItems = items;
    });
};