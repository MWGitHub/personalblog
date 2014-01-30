/**
 * @author
 */
var ArticleProvider = require('./articleprovider').ArticleProvider;

exports.index = function(req, res) {
    console.log(req);
    ArticleProvider.findAll(function(error, docs) {
        res.render('blog_index.jade', {
            title: 'Blog',
            articles: docs
        });
    });
};

exports.new = function(req, res) {
    res.render('blog_new.jade', {
        title: 'New Post'
    });
};

exports.newPost = function(req, res) {
    ArticleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function(error, docs) {
        res.redirect('/')
    });
};

exports.getBlogPost = function(req, res) {
    ArticleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade', {
            title: article.title,
            article: article
        });
    });
};

exports.newComment = function(req, res) {
    ArticleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
    }, function(error, docs) {
        res.redirect('/blog/' + req.param('_id'))
    });
};