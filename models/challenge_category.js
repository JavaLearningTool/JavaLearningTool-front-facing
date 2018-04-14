var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Need Challenge Schema for cascading deletes
const Challenge = require("../models/challenge.js");

/**
 * Create Schema for Categories
 */
var challengeCatSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    featured: { type: Boolean, default: false }
});

// Add static methods to this Schema

/**
 * Finds all documents in this collection
 *
 * @param {function} cb callback function when results are received
 */
challengeCatSchema.statics.findAll = function(cb) {
    return this.find({}, cb);
};

/**
 * Finds one document with the provided id
 *
 * @param {Object} id the id of the searched for Challenge
 * @param {function} cb callback function when results are received
 */
challengeCatSchema.statics.findWithId = function(id, cb) {
    return this.findOne({ _id: id }, cb);
};

/**
 * Finds the documents with the ids passed in
 *
 * @param {Object[]} ids the ids of the searched for Challenges
 * @param {function} cb callback function when results are received
 */
challengeCatSchema.statics.findWithIds = function(ids, cb) {
    return this.find({ _id: ids }, cb);
};

/**
 * Finds all featured Categories
 *
 * @param {function} cb callback function when results are received
 */
challengeCatSchema.statics.findFeatured = function(cb) {
    return this.find({ featured: true }, cb);
};

/**
 * Updates the Document with the given id based on updateObj
 *
 * @param {Object} id
 * @param {Object} updateObj Contains the attributes of the Category document to update
 * @param {function} cb callback function when updates are done
 */
challengeCatSchema.statics.updateById = function(id, updateObj, cb) {
    return this.findByIdAndUpdate(id, { $set: updateObj }, cb);
};

/**
 * Removes the Category with the specified id. Updates all Challenges to reflect this change
 * @param {Object} id
 * @param {function} cb callback function when removing is done
 */
challengeCatSchema.statics.removeById = function(id, cb) {
    return this.findByIdAndRemove(id, function(err) {
        if (err) {
            cb(err);
        } else {
            // remove category from all challenges
            Challenge.update({}, { $pull: { categories: id } }, { multi: true }, cb);
        }
    });
};

/**
 * Creates a new Category document and adds it to the database
 *
 * @param {String} title
 * @param {String} description
 * @param {Boolean} featured
 * @param {function} cb callback function when Category is saved
 */
challengeCatSchema.statics.newCategory = function(title, description, featured, cb) {
    let newCat = this({
        title,
        description,
        featured
    });
    newCat.save(cb);
};

module.exports = mongoose.model("challenge_category", challengeCatSchema);
