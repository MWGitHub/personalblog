/**
 * @author MW
 */
var Database = require('../database');

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
            article_collection.find().toArray(function(error, results) {
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

ArticleProvider.save = function(articles, callback) {
    ArticleProvider.getCollection(function(error, article_collection) {
        if (error) callback(error);
        else {
            if (typeof(articles.length) == "undefined")
                articles = [articles];
            for (var i = 0; i < articles.length; i++) {
                var article = articles[i];
                article.created_at = new Date();
                if (article.comments === undefined) article.comments = [];
                for (var j = 0; j < article.comments.length; j++) {
                    article.comments[j].created_at = new Date();
                }
            }

            article_collection.insert(articles, function() {
                callback(null, articles);
            });
        }
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