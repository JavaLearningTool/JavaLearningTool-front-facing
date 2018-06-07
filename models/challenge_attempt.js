const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Need Challenge Schema for finding all non-completed challenges
const Challenge = require("../models/challenge.js");

/**
 * Create Schema for Challenge attempts
 */
const challengeAttemptSchema = new Schema({
    challenge: { type: String, ref: "challenge", required: true },
    user: { type: String, required: true },
    passed: { type: Boolean, required: true },
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
 * Returns a list of challenges completed by a user
 *
 * @param {String} user the user to find all completed challenges of
 * @param {function} cb callback function when results are received
 */
challengeAttemptSchema.statics.completedChallenges = function(user, cb) {
    return this.find({ user: user, passed: true }, cb).distinct("challenge");
};

/**
 * Creates a new Attempt document and adds it to the database
 *
 * @param {String} challenge
 * @param {String} user
 * @param {Boolean} passed
 * @param {function} cb callback function when Category is saved
 */
challengeAttemptSchema.statics.newAttempt = function(challenge, user, passed, cb) {
    let newCat = this({ challenge, user, passed });
    return newCat.save(cb);
};

module.exports = mongoose.model("challenge_attempt", challengeAttemptSchema);
