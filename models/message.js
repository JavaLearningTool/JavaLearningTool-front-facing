var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Create schema for Messages
 */
var messageSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    links: [
        {
            href: { type: String, required: true },
            name: { type: String, required: true }
        }
    ],
    visible: { type: Boolean, default: false }
});

// Add static methods to this Schema
/**
 * Finds all documents in this collection
 *
 * @param {function} cb callback function when results are received
 */
messageSchema.statics.findAll = function(cb) {
    return this.find({}, cb);
};

/**
 * Finds one document with the provided id
 *
 * @param {Object} id the id of the searched for Message
 * @param {function} cb callback function when results are received
 */
messageSchema.statics.findWithId = function(id, cb) {
    return this.findOne({ _id: id }, cb);
};

/**
 * Finds all visible Message documents
 *
 * @param {function} cb callback function when results are received
 */
messageSchema.statics.findVisible = function(id, cb) {
    return this.find({ visible: true }, cb);
};

/**
 * Updates the Document with the given id based on updateObj
 *
 * @param {Object} id
 * @param {Object} updateObj Contains the attributes of the Message document to update
 * @param {function} cb callback function when updates are done
 */
messageSchema.statics.updateById = function(id, updateObj, cb) {
    return this.findByIdAndUpdate(id, { $set: updateObj }, cb);
};

/**
 * Removes the Message with the specified id
 * @param {Object} id
 * @param {function} cb callback function when removing is done
 */
messageSchema.statics.removeById = function(id, cb) {
    return this.findByIdAndRemove(id, cb);
};

/**
 * Creates a new Message document and adds it to the database
 *
 * @param {String} title
 * @param {String} body
 * @param {String} links
 * @param {Boolean} visible
 * @param {function} cb callback function when Category is saved
 */
messageSchema.statics.newMessage = function(title, body, links, visible, cb) {
    let newMess = this({
        title,
        body,
        links,
        visible
    });
    newMess.save(cb);
};

module.exports = mongoose.model("message_schema", messageSchema);
