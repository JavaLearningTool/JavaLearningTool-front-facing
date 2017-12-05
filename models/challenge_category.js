var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var challengeCatSchema = new Schema({
  title: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("challenge_category", challengeCatSchema);
