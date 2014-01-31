/**
 * @author
 */
var ArticleProvider = require('./articleprovider').ArticleProvider;

exports.index = function(req, res) {
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
        originalSlug: req.param('articleSlug'),
        slug: req.param('articleSlug'),
        title: req.param('title'),
        body: req.param('body')
    }, function(error, docs) {
        res.redirect('/')
    });
};

exports.edit = function(req, res) {
    ArticleProvider.findBySlug(req.param('slug'), function(error, article) {
        if (error) res.redirect('/');
        else res.render('blog_new.jade', {
            title: 'Edit Post',
            article: article
        });
    });
};

exports.editPost = function(req, res) {
    ArticleProvider.save({
        originalSlug: req.params.slug,
        slug: req.param('articleSlug'),
        title: req.param('title'),
        body: req.param('body')
    }, function(error, article) {
        res.redirect('/');
    });
};

exports.getBlogPost = function(req, res) {
    ArticleProvider.findBySlug(req.params.slug, function(error, article) {
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