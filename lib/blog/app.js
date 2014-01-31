/**
 * @author
 */
var routes = require('./index');
var auth = require('../auth/app');

exports.init = function(app) {
    app.get('/blog', routes.index);
    app.get('/blog/new', auth.ensureAuthenticated, routes.new);
    app.post('/blog/new', auth.ensureAuthenticated, routes.newPost);
    app.get('/blog/edit/:slug', auth.ensureAuthenticated, routes.edit);
    app.post('/blog/edit/:slug', auth.ensureAuthenticated, routes.editPost);
    app.get('/blog/:slug', routes.getBlogPost);
    app.post('/blog/addComment', routes.newComment);
};