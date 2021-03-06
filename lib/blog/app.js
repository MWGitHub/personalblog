/**
 * @author
 */
var routes = require('./index');
var auth = require('../auth/app');

exports.init = function(app) {
    app.get('/', routes.index);
    app.get('/blog/index', routes.index);
    app.get('/blog/post/:slug', routes.getBlogPost);
    app.get('/blog/admin', auth.ensureAuthenticated, routes.admin);
    app.get('/blog/new', auth.ensureAuthenticated, routes.new);
    app.post('/blog/new', auth.ensureAuthenticated, routes.newPost);
    app.get('/blog/edit/:id', auth.ensureAuthenticated, routes.edit);
    app.post('/blog/edit/:id', auth.ensureAuthenticated, routes.editPost);
    app.post('/blog/delete/:id', auth.ensureAuthenticated, routes.deletePost);
    app.post('/blog/addComment', routes.newComment);
    app.post('/blog/delete-comment', auth.ensureAuthenticated, routes.deleteComment);
    app.post('/blog/preview', auth.ensureAuthenticated, routes.preview);
};