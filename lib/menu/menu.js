/**
 * @author
 */
/**
 * collection: menu
 * {
 *  label: String,
 *  link: String,
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