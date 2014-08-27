/**
 * @author
 */
var Menu = require('./menu');

exports.index = function(req, res) {
    Menu.findAll(function(error, results) {
        res.render('menu_admin.jade', {
            title: 'Menu Admin',
            items: results
        });
    });
};

exports.postItems = function(app) {
    return function(req, res) {
        // Delete an item.
        if (req.param('delete') && req.param('id')) {
            Menu.delete(req.param('id'), function(error, item) {
                res.redirect('/menu/admin');
            });
            return;
        }
        // Only allow valid saves.
        if (!req.param('label') || !req.param('order')) {
            res.redirect('/menu/admin');
            return;
        }
        Menu.save({
            id: req.param('id'),
            label: req.param('label'),
            link: req.param('link'),
            description: req.param('description'),
            order: req.param('order'),
            isAdmin: req.param('isAdmin')
        }, function(error, item) {
            if (error) {res.redirect('/menu/admin'); return;}
            Menu.findAll(function(error, items) {
                app.locals.menuItems = items;
                res.redirect('/menu/admin');
            });
        });
    };
};