/**
 * @author
 */
var Database = require('../database');

/**
 * collection: menu
 * {
 *  label: String,
 *  link: String,
 *  description: String,
 *  order: Number,
 *  isAdmin: Boolean
 * }
 */

exports.getCollection = function(callback) {
    var db = Database.db();
    db.collection('menu', function(error, menu_collection) {
        if (error) callback(error);
        else callback(null, menu_collection);
    });
};

exports.findAll = function(callback) {
    module.exports.getCollection(function(error, menu_collection) {
        if (error) callback(error);
        else menu_collection.find().sort({order: -1}).toArray(function(error, results) {
            if (error) callback(error);
            else callback(null, results);
        })
    });
}

exports.findById = function(id, callback) {
    module.exports.getCollection(function(error, menu_collection) {
        if (error) callback(error)
        else {
            menu_collection.findOne({
                _id: menu_collection.db.bson_serializer.ObjectID.createFromHexString(id)
            }, function(error, result) {
                if (error) callback(error);
                else callback(null, result);
            });
        }
    });
};

exports.save = function(item, callback) {
    module.exports.getCollection(function(error, menu_collection) {
        if (error) {callback(error); return;}

        var id = item.id;
        var label = item.label;
        var link = item.link ? item.link : null;
        var description = item.description ? item.description : null;
        var order = parseInt(item.order);
        var isAdmin = item.isAdmin ? true : false;
        console.log(item);

        menu_collection.update(
            {_id: id ? menu_collection.db.bson_serializer.ObjectID.createFromHexString(id) : null},
            {
                label: label,
                link: link,
                description: description,
                order: order,
                isAdmin: isAdmin
            },
            {upsert: true},
        function(error, item) {
            if (error) callback(error);
            else callback(null, item);
        });
    });
};

exports.delete = function(id, callback) {
    module.exports.getCollection(function(error, menu_collection) {
        if (error) callback(error)
        else {
            menu_collection.remove(
                {_id: menu_collection.db.bson_serializer.ObjectID.createFromHexString(id)},
                true,
            function(error, item) {
                if (error) callback(error);
                else callback(null, item);
            });
        }
    });
};