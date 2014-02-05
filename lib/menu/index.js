/**
 * @author
 */

exports.index = function(req, res) {
    res.render('admin_index.jade', {
        title: 'Admin Menu'
    });
};
