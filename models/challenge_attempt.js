var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Create Schema for Challenge attempts
 */
var challengeAttemptSchema = new Schema({
    challenge: { type: String, ref: "challenge", required: true },
    user: { type: String, required: true },
    passed: { type: Boolean, required: true },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now }
});

// Add static methods to this Schema

/**
 * Finds all documents in this collection
 *
 * @param {function} cb callback function when results are received
 */
challengeAttemptSchema.statics.findAll = function(cb) {
    return this.find({}, cb);
};

/**
 * Finds one document with the provided id
 *
 * @param {Object} id the id of the searched for Challenge
 * @param {function} cb callback function when results are received
 */
challengeAttemptSchema.statics.findWithId = function(id, cb) {
    return this.findOne({ _id: id }, cb);
};

/**
 * Finds the documents with the ids passed in
 *
 * @param {Object[]} ids the ids of the searched for Challenges
 * @param {function} cb callback function when results are received
 */
challengeAttemptSchema.statics.findWithIds = function(ids, cb) {
    return this.find({ _id: ids }, cb);
};

/**
 * Creates a new Attempt document and adds it to the database
 *
 * @param {String} challenge
 * @param {String} user
 * @param {Boolean} passed
 * @param {String} reason
 * @param {function} cb callback function when Category is saved
 */
challengeAttemptSchema.statics.newAttempt = function(challenge, user, passed, reason, cb) {
    let newCat = this({ challenge, user, passed, reason });
    return newCat.save(cb);
};

module.exports = mongoose.model("challenge_attempt", challengeAttemptSchema);
