const Image = require('../model/image')
const returnFormat = require('./returnFormat')
const fs = require('fs')

const image_get = async (req, res) => {

    try {
        const retVal = await Image.find().sort({ createdAt: -1 })

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const image_delete = async (req, res) => {

    const id = req.params.id

    try {
        const retVal = await Image.findByIdAndDelete(id)

        const path = req.body.destination + req.body.binaryImage + ".jpg"

        if (retVal) {
            fs.unlink(path, function () {
                returnFormat.success200(res, retVal)
            })

            console.log(path, "Deleted")
        }
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const image_post = async (req, res) => {

    const image = new Image(req.file)
    try {
        const retVal = await image.save()

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }

    console.log(req.file)
}

module.exports = {
    image_post,
    image_get,
    image_delete
}