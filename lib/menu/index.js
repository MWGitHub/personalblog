/**
 * @author
 */

exports.index = function(req, res) {
    res.render('menu_admin.jade', {
        title: 'Menu Admin'
    });
};
