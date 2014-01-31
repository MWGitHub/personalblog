/**
 * @author MW
 */
var Database = require('../database');

/**
 * collection: articles
 * {
 *  body: String,
 *  comments: Array.<{
 *      person: String,
 *      comment: String
 *  }>,
 *  created_at: ISODate,
 *  slug: String
 * }
 */

ArticleProvider = {};

ArticleProvider.getCollection = function(callback) {
    var db = Database.db();
    db.collection('articles', function(error, article_collection) {
        if (error) callback(error);
        else callback(null, article_collection);
    });
};

ArticleProvider.findAll = function(callback) {
    ArticleProvider.getCollection(function(error, article_collection) {
        if (error) callback(error)
        else {
            article_collection.find().sort({created_at: -1}).toArray(function(error, results) {
                if (error) callback(error);
                else callback(null, results);
            });
        }
    });
};

ArticleProvider.findById = function(id, callback) {
    ArticleProvider.getCollection(function(error, article_collection) {
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

ArticleProvider.findBySlug = function(slug, callback) {
    ArticleProvider.getCollection(function(error, article_collection) {
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

ArticleProvider.save = function(article, callback) {
    ArticleProvider.getCollection(function(error, article_collection) {
        if (error) {callback(error); return;}

        ArticleProvider.findBySlug(article.originalSlug, function(error, foundArticle) {
            if (error) {callback(error); return;}
            var savedArticle = {};
            savedArticle.slug = article.slug;
            savedArticle.title = article.title;
            savedArticle.body = article.body;
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
                            body: savedArticle.body
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

ArticleProvider.addCommentToArticle = function(articleId, comment, callback) {
    ArticleProvider.getCollection(function(error, article_collection) {
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

exports.ArticleProvider = ArticleProvider;