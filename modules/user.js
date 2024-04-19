const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isMember: { type: Boolean },
    isAdmin: { type: Boolean }
})

module.exports = mongoose.model('user', UserSchema);