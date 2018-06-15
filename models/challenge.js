var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Markdown renderer that turns markdown into html
const md = require("markdown-it")({
    linkify: true,
    typographer: true
});

/**
 * Create schema for Challenges
 */
var challengeSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    descriptionHtml: { type: String, default: "Error" },
    categories: [{ type: Schema.Types.ObjectId, ref: "challenge_category" }],
    difficulty: { type: Number, min: 1, max: 5 },
    testFile: { type: String, required: true },
    classes: [
        { name: { type: String, required: true }, defaultText: { type: String, required: true } }
    ]
});

// Index the name so it can be searched for
challengeSchema.index({ name: "text" });

// Add static methods to this Schema
/**
 * Finds all documents in this collection
 *
 * @param {function} cb callback function when results are received
 */
challengeSchema.statics.findAll = function(cb) {
    return this.find({}, cb);
};

/**
 * Finds one document with the provided id
 *
 * @param {Object} id the id of the searched for Challenge
 * @param {function} cb callback function when results are received
 */
challengeSchema.statics.findWithId = function(id, cb) {
    return this.findOne({ _id: id }, cb);
};

/**
 * Queries the Challenge collection for challenges that match the criteria
 *
 * @param {Object} criteria the criteria to search by. This should contain an object with
 *                 attributes of the Challenges as keys and values to search for as values
 * @param {Number} limit The maximum number of Challenge documents to return. (default 20)
 */
challengeSchema.statics.findWithCriteria = function(criteria, limit = 20) {
    return this.find(criteria, { score: { $meta: "textScore" } })
        .limit(10)
        .sort({ score: { $meta: "textScore" } });
};

/**
 * Updates the Document with the given id based on updateObj
 *
 * @param {Object} id
 * @param {Object} updateObj Contains the attributes of the Challenge document to update
 * @param {function} cb callback function when updates are done
 */
challengeSchema.statics.updateById = function(id, updateObj, cb) {
    if (updateObj.description !== undefined) {
        updateObj.descriptionHtml = md.render(updateObj.description);
    }
    return this.findByIdAndUpdate(id, { $set: updateObj }, cb);
};

/**
 * Removes the Challenge with the specified id
 * @param {Object} id
 * @param {function} cb callback function when removing is done
 */
challengeSchema.statics.removeById = function(id, cb) {
    return this.findByIdAndRemove(id, cb);
};

/**
 * Finds one document with the provided test file. Populates the categories
 * field with the category documents instead of their ids.
 *
 * @param {Object} testFile the testFile of the searched for Challenge
 * @param {function} cb callback function when results are received
 */
challengeSchema.statics.findWithTestFile = function(testFile, cb) {
    return this.findOne({ testFile }, cb).populate("categories");
};
/**
 * Creates a new Challenge document and adds it to the database
 *
 * @param {String} name
 * @param {String} description
 * @param {Object[]} categories
 * @param {Number} difficulty
 * @param {String} defaultText
 * @param {String} testFile
 * @param {String} className
 * @param {function} cb callback function when Category is saved
 */
challengeSchema.statics.newChallenge = function(
    name,
    description,
    categories,
    difficulty,
    defaultText,
    testFile,
    className,
    cb
) {
    let newChall = this({
        name,
        description,
        descriptionHtml: md.render(description),
        categories,
        difficulty,
        testFile,
        classes: [
            {
                name: className,
                defaultText
            }
        ]
    });

    newChall.save(cb);
};

module.exports = mongoose.model("challenge", challengeSchema);
