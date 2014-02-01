/**
 * @author MW
 */
var Database = require('../database');

/**
 * collection: articles
 * {
 *  body: String,
 *  excerpt: String,
 *  comments: Array.<{
 *      person: String,
 *      comment: String
 *  }>,
 *  created_at: ISODate,
 *  slug: String,
 *  isPublished: Boolean
 * }
 */

Blog = {};

Blog.getCollection = function(callback) {
    var db = Database.db();
    db.collection('articles', function(error, article_collection) {
        if (error) callback(error);
        else callback(null, article_collection);
    });
};

Blog.findAll = function(onlyPublished, callback) {
    Blog.getCollection(function(error, article_collection) {
        if (error) callback(error)
        else {
            var criteria = {};
            if (onlyPublished) criteria.isPublished = true;
            article_collection.find(criteria).sort({created_at: -1}).toArray(function(error, results) {
                if (error) callback(error);
                else callback(null, results);
            });
        }
    });
};

Blog.findById = function(id, callback) {
    Blog.getCollection(function(error, article_collection) {
        if (error) callback(error)
        else {
            article_collection.findOne({
                _id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)
            }, function(error, result) {
                if (error) callback(error);
                else callback(null, result);
            });
        }
    });
};

Blog.findBySlug = function(slug, callback) {
    Blog.getCollection(function(error, article_collection) {
        if (error) callback(error)
        else {
            article_collection.findOne({
                slug: slug
            }, function(error, result) {
                if (error) callback(error);
                else callback(null, result);
            });
        }
    });
};

Blog.save = function(article, callback) {
    Blog.getCollection(function(error, article_collection) {
        if (error) {callback(error); return;}

        Blog.findBySlug(article.originalSlug, function(error, foundArticle) {
            if (error) {callback(error); return;}
            var savedArticle = {};
            savedArticle.slug = article.slug;
            savedArticle.title = article.title;
            savedArticle.body = article.body;
            savedArticle.excerpt = article.excerpt;
            savedArticle.isPublished = article.published === 'on';
            if (!article.created_at) savedArticle.created_at = new Date();
            if (!article.comments) savedArticle.comments = [];
            if (foundArticle) {
                // Update article.
                article_collection.update(
                    {_id: foundArticle._id},
                    {
                        $set: {
                            slug: savedArticle.slug,
                            title: savedArticle.title,
                            body: savedArticle.body,
                            excerpt: savedArticle.excerpt,
                            isPublished: savedArticle.isPublished
                        }
                    },
                function(error, result) {
                    if (error) callback(error);
                    else callback(null, result);
                });
            } else {
                // Create a new article.
                article_collection.insert(savedArticle, function(error, result) {
                    if (error) callback(error);
                    else callback(null, result);
                });
            }
        });
    });
};

Blog.addCommentToArticle = function(articleId, comment, callback) {
    Blog.getCollection(function(error, article_collection) {
        if (error) callback(error);
        else {
            article_collection.update(
                {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
                {"$push": {comments: comment}},
            function(error, article) {
                if (error) callback(error);
                else callback(null, article);
            });
        }
    });
};

exports.Blog = Blog;