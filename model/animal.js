const mongoose = require('mongoose')
const Schema = mongoose.Schema

const animalSchema = new Schema({
    name: { type: String, required: true },
    expression: { type: String, required: true },
    diet: { type: String, required: true },
    isBaby: { type: Boolean, required: true },
    isOneAnimal: { type: Boolean, required: true },
    binaryImage: { type: String, required: true },
    tags: { type: [String] },
    story: { type: String },
    userName: { type: String, required: true },
    createdAt: { type: String, default: Date.now }
})

const Animal = mongoose.model('animal', animalSchema)

module.exports = Animal