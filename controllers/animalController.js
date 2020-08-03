const Animal = require('../model/animal')
const returnFormat = require('../controllers/returnFormat')
const Joi = require('@hapi/joi')
const { ObjectId } = require('mongodb')

const animal_get = async (req, res) => {

    try {
        const retVal = await Animal.find().sort({ createdAt: -1 })

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_get_byID = async (req, res) => {
    const id = req.params.id

    try {
        const retVal = await Animal.findById(id)

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_post = async (req, res) => {

    let validate = await validateAnimalPost(req.body)
    if (!validate.isValid) returnFormat.validate422(res, validate.message)

    const animal = new Animal(req.body)

    try {
        const retVal = await animal.save()

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_patch = async (req, res) => {

    let validate = await validateAnimalPost(req.body)
    if (!validate.isValid) return returnFormat.validate422(res, validate.message)

    const id = req.params.id

    try {
        await Animal.updateOne({ _id: ObjectId(id) }, req.body, (err, retVal) => {
            res.send(
                (err === null) ? returnFormat.success200(res, retVal) : returnFormat.error400(res)
            )
        })
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_delete = async (req, res) => {
    const id = req.params.id

    try {
        const retVal = await Animal.findByIdAndDelete(id)

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

/* Supporting functon */
const validateAnimalPost = async (animal) => {

    const schema = Joi.object({
        name: Joi.string().min(1).max(30).required(),

        expression: Joi.string()
            .valid("Happy", "Sad", "Inocent", "Cry")
            .required(),

        diet: Joi.string()
            .valid("Herbivore", "Carnivore", "Omnivore")
            .required(),

        isBaby: Joi.boolean().required(),
        isOneAnimal: Joi.boolean().required(),
        binaryImage: Joi.string().min(10).max(100).required(),
        tags: Joi.array().items(Joi.string()),
        story: Joi.string().min(0).max(200).allow(''),
        userName: Joi.string().required()
    })

    try {
        const result = await schema.validate(animal)

        if (result.error == null) return { isValid: true, message: "" }
        else return { isValid: false, message: result.error.toString() }
    }
    catch (err) {
        return { isValid: false, message: err.details[0].message }
    }

}

module.exports = {
    animal_get,
    animal_get_byID,
    animal_post,
    animal_patch,
    animal_delete,
}