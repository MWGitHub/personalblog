/**
 * Single database used across the application.
 * @author MW
 */
var MongoDb = require('mongodb');
var Connection = MongoDb.Collection;
var BSON = MongoDb.BSON;
var ObjectID = MongoDb.ObjectID;

var db = null;

/**
 * Starts the database.
 * @param {String} server the database server.
 * @param {Number} port the port for the database.
 * @param {String} database the database name.
 * @param {function} next the callback function to run when started.
 */
exports.start = function(server, port, database, next) {
    // Start the database.
    var Db = MongoDb.Db;
    var Server = MongoDb.Server;

    db = new Db(database, new Server(server, port, {auto_reconnect: true}, {}));
    db.open(function() {
        console.log('Database opened on ' + server + ':' + port + '.');
        next();
    });
};

exports.db = function() {
    return db;
};