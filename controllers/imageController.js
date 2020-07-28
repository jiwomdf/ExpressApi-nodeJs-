const Image = require('../model/image')
const returnFormat = require('./returnFormat')
const fs = require('fs')
const sharp = require('sharp')

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

        console.log(req.body)

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

    let isImgReduce = await reduceImage(req)

    if (!isImgReduce.isSuccess)
        returnFormat.error500(res, isImgReduce.msg)

    console.log(isImgReduce)

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

const reduceImage = async (req) => {
    try {
        await sharp(req.file.path)
            .resize(500)
            .toFile(`./public/${req.file.originalname}`)

        fs.unlink(req.file.path, () => {
            console.log("Original image deleted")
        })

        fs.rename(`./public/${req.file.originalname}`, `./public/${req.file.originalname}.jpg`, function (err) {
            if (err) return { isSuccess: false, msg: err }
        })

        return { isSuccess: true, msg: "" }
    }
    catch (err) {
        return { isSuccess: false, msg: err }
    }
}

module.exports = {
    image_post,
    image_get,
    image_delete
}