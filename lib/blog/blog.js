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
 *      comment: String,
 *      created_at: ISODate
 *  }>,
 *  created_at: ISODate,
 *  slug: String,
 *  isPublished: Boolean,
 *  allowComments: Boolean,
 *  showComments: Boolean
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
    if (!id) {callback(null, null); return;}
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

        Blog.findById(article.id, function(error, foundArticle) {
            if (error) {callback(error); return;}
            var comments;
            if (!foundArticle)
                comments = [];
            else
                comments = foundArticle.comments;
            article_collection.update(
                {_id: article.id ? article_collection.db.bson_serializer.ObjectID.createFromHexString(article.id) : Database.createObjectId()},
                {
                    $set: {
                        slug: article.slug,
                        title: article.title,
                        body: article.body,
                        created_at: article.created ? new Date(article.created) : new Date(),
                        excerpt: article.excerpt,
                        isPublished: article.isPublished,
                        allowComments: article.allowComments,
                        showComments: article.showComments,
                        comments: comments
                    }
                },
                {upsert: true},
                function(error, article) {
                    if (error) callback(error);
                    else callback(null, article);
                }
            )
        });
    });
};

Blog.delete = function(articleId, callback) {
    Blog.getCollection(function(error, article_collection) {
        if (error) callback(error)
        else {
            article_collection.remove(
                {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
                true,
                function(error, article) {
                    if (error) callback(error);
                    else callback(null, article);
            });
        }
    });
};

Blog.addCommentToArticle = function(articleId, comment, callback) {
    Blog.findById(articleId, function(error, article) {
        if (article.allowComments) {
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
        }
    });
};

Blog.deleteCommentFromArticle = function(articleId, person, time, callback) {
    Blog.getCollection(function(error, article_collection) {
        if (error) callback(error);
        else {
            article_collection.update(
                {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
                {"$pull": {
                    comments : {
                        person: person,
                        created_at: new Date(time)
                    }
                }},
            function(error, article) {
                if (error) callback(error);
                else callback(null, article);
            });
        }
    });
};

exports.Blog = Blog;