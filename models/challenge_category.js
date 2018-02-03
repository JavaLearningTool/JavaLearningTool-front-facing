var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var challengeCatSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: {type: String, required: true},
    featured: {type: Boolean, default: false}
});

module.exports = mongoose.model("challenge_category", challengeCatSchema);
