const mongoose = require('mongoose')
const Schema = mongoose.Schema

const animalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isBaby: {
        type: Boolean,
        required: true
    },
    expression: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    diet: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Animal = mongoose.model('Animal', animalSchema)

module.exports = Animal