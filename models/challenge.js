var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var challengeSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    descriptionHtml: { type: String, default: "Error" },
    categories: [{ type: Schema.Types.ObjectId, ref: "challenge_category" }],
    difficulty: { type: Number, min: 1, max: 5 },
    defaultText: { type: String, required: true },
    testFile: { type: String, required: true },
    className: { type: String, default: "Test" }
});

challengeSchema.index({ name: "text" });

module.exports = mongoose.model("challenge", challengeSchema);
