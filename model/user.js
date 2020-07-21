const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: [String], required: true },
    createdAt: { type: String, default: Date.now }
})

const User = mongoose.model('user', userSchema)

module.exports = User