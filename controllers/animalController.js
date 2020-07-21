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

module.exports = {
    animal_get,
    animal_get_byID,
    animal_post,
    animal_patch,
    animal_delete
}