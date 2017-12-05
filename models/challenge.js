var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var challengeSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true},
    category: [{ type: Schema.Types.ObjectId, ref: 'challenge_category' }],
    difficulty: {type: Number, min: 1, max: 5},
    defaultText: String
});

module.exports = mongoose.model("challenge", challengeSchema);
