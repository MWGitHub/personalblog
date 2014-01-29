/**
 * @author
 */
var routes = require('./index.js');

exports.init = function(app) {
    app.get('/', routes.index);
    app.get('/blog/new', routes.new);
    app.post('/blog/new', routes.newPost);
    app.get('/blog/:id', routes.getBlogPost);
    app.post('/blog/addComment', routes.newComment);
};