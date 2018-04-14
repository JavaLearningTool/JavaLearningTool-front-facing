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

module.exports = mongoose.model("message_schema", messageSchema);
