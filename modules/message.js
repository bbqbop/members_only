const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moment = require("moment");

const MessageSchema = new Schema({
    title: { type: String },
    message: { type: String },
    date: { type: Date, default: Date.now },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
})

MessageSchema.virtual('time').get(function(){
    return moment(this.date).format('MM/DD/YY, HH:MM') 
})

module.exports = mongoose.model('Message', MessageSchema);