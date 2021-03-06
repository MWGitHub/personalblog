/**
 * @author
 */
var Blog = require('./blog').Blog;

exports.admin = function(req, res) {
    Blog.findAll(false, function(error, docs) {
        res.render('blog_admin.jade', {
            articles: docs,
            title: 'Blog Admin'
        });
    });
};

exports.index = function(req, res) {
    Blog.findAll(true, function(error, docs) {
        res.render('blog_index.jade', {
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
    Blog.save({
        slug: req.param('articleSlug'),
        template: req.param('template'),
        title: req.param('title'),
        body: req.param('body'),
        excerpt: req.param('excerpt'),
        isPublished: req.param('published') ? true : false,
        showComments: req.param('showComments') ? true : false,
        allowComments: req.param('allowComments') ? true : false
    }, function(error, docs) {
        res.redirect('/')
    });
};

exports.edit = function(req, res) {
    Blog.findById(req.param('id'), function(error, article) {
        if (error) res.redirect('/');
        else res.render('blog_new.jade', {
            title: 'Edit Post',
            article: article
        });
    });
};

exports.editPost = function(req, res) {
    Blog.save({
        id: req.param('id'),
        slug: req.param('articleSlug'),
        template: req.param('template'),
        title: req.param('title'),
        created: req.param('created'),
        body: req.param('body'),
        excerpt: req.param('excerpt'),
        isPublished: req.param('published') ? true: false,
        allowComments: req.param('allowComments') ? true : false,
        showComments: req.param('showComments') ? true : false
    }, function(error, article) {
        res.redirect('/blog/post/' + req.param('articleSlug'));
    });
};

exports.getBlogPost = function(req, res) {
    Blog.findBySlug(req.params.slug, function(error, article) {
        if (!article) {res.redirect('/'); return;}
        var template = article.template ? article.template : 'blog_show.jade';
        res.render(template, {
            title: article.title,
            article: article,
            isAdmin: req.user ? true : false
        }, function(error, html) {
            if (error) res.redirect('/');
            else res.end(html);
        });
    });
};

exports.newComment = function(req, res) {
    Blog.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
    }, function(error, docs) {
        res.redirect('/blog/post/' + req.param('slug'))
    });
};

exports.deletePost = function(req, res) {
    if (req.param('deleteConfirm') === 'on')
        Blog.delete(req.param('id'), function(error, article) {
            res.redirect('/blog/admin');
        });
    else
        res.redirect('/blog/admin');
};

exports.deleteComment = function(req, res) {
    var slug = req.param('slug');
    if (req.param('confirm') !== 'on') {
        res.redirect('/blog/post/' + slug);
        return;
    }

    var id = req.param('_id');
    var name = req.param('person');
    var time = req.param('created_at');
    if (id && name && time) {
        Blog.deleteCommentFromArticle(id, name, time, function(error, article) {
            res.redirect('/blog/post/' + slug);
        });
    } else
        res.redirect('/blog/post/' + slug);
};

exports.preview = function(req, res) {
    // Allow previewing javascript.
    res.setHeader('X-XSS-Protection', 0)
    var template = req.param('template') ? req.param('template') : 'blog_show.jade';
    res.render(template, {
        title: req.param('title'),
        article: {
            body: req.param('body'),
            created_at: new Date(),
            comments: []
        }
    }, function(error, html) {
        if (error) res.redirect('/');
        else res.end(html);
    });
};