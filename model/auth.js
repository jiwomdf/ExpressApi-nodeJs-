const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authSchema = new Schema({
    userName: { type: String, required: true },
    refreshToken: { type: String, required: true },
    loginAt: { type: String, default: Date.now }
})

const Auth = mongoose.model('auth', authSchema)

module.exports = Auth