const Animal = require('../model/animal')
const returnFormat = require('../controllers/returnFormat')
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

    let isValid = validateAnimalPost(req.body)
    if (!isValid) returnFormat.error400(res, "rijected on validation animal_post")

    const animal = new Animal(req.body)

    // try {
    //     const retVal = await animal.save()

    //     if (retVal)
    //         returnFormat.success200(res, retVal)
    //     else
    //         returnFormat.failed404(res)
    // }
    // catch (err) {
    //     returnFormat.error400(res, err)
    // }
}

const animal_patch = async (req, res) => {

    let isValid = validateAnimalPost(req.body)
    if (!isValid) returnFormat.error400(res, "rijected on validation animal_post")

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
const validateAnimalPost = (animal) => {

    const arrDiet = ["Herbivore", "Carnivore", "Omnivore"]

    if (animal.name == undefined || animal.name == null || animal.name.trim() == "")
        return false
    if (animal.expression == undefined || animal.expression == null || animal.expression.trim() == "")
        return false
    if (animal.diet == undefined || animal.diet == null || animal.diet.trim() == "")
        return false
    if (animal.isBaby == undefined || animal.isBaby == null)
        return false
    if (animal.isOneAnimal == undefined || animal.isOneAnimal == null)
        return false
    if (animal.binaryImage == undefined || animal.binaryImage == null || animal.binaryImage.trim() == "")
        return false
    if (animal.tags == undefined || animal.tags == null)
        return false

    if (!arrDiet.includes(animal.diet))
        return false
}

module.exports = {
    animal_get,
    animal_get_byID,
    animal_post,
    animal_patch,
    animal_delete
}