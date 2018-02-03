var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
});

module.exports = mongoose.model("message_schema", messageSchema);
