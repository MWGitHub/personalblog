/**
 * @author @MW
 */
var bcrypt = require('bcrypt');
var Database = require('../database');
var SALT_WORK_FACTOR = 12;

Auth = {};

Auth.getCollection = function(callback) {
    var db = Database.db();
    db.collection('users', function(error, user_collection) {
        if (error) callback(error);
        else callback(null, user_collection);
    });
};

Auth.findByUsername = function(name, callback) {
    Auth.getCollection(function(error, user_collection) {
        if (error) {callback(error); return;}
        user_collection.findOne({username: name}, function(error, result) {
            if (error) callback(error)
            else callback(null, result);
        });
    });
};

Auth.findById = function(id, callback) {
    Auth.getCollection(function(error, user_collection) {
        if (error) {callback(error); return;}
        user_collection.findOne({_id: id}, function(error, result) {
            if (error) callback(error);
            else callback(null, result);
        });
    });
};

Auth.comparePassword = function(user, password, callback) {
    bcrypt.compare(password, user.password, function(error, isMatch) {
        if (error) {callback(error); return;}
        callback(null, isMatch);
    });
};

Auth.save = function(user, callback) {
    Auth.getCollection(function(error, user_collection) {
        if (error) {callback(error); return;}
        Auth.findByUsername(user.username, function(error, result) {
            if (error) {callback(error); return;}
            // User already exists.
            if (result) {callback(error, null); return;}

            var savedUser = {username: user.username};
            savedUser.created_at = new Date();
            bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
                if (error) {callback(error); return;}
                bcrypt.hash(user.password, salt, function(error, hash) {
                    if (error) {callback(error); return;}
                    savedUser.password = hash;
                    user_collection.insert(savedUser, function() {
                        callback(null, user);
                    });
                });
            });
        });
    });
};

exports.Auth = Auth;