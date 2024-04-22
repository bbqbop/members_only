const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isMember: { type: Boolean },
    isAdmin: { type: Boolean }
})

module.exports = mongoose.model('User', UserSchema);