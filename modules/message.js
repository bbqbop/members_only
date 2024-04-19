const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String },
    message: { type: String },
    date: { type: Date, default: Date.now },
    author: { type: mongoose.Types.ObjectId },
})

module.exports = mongoose.model('message', MessageSchema);