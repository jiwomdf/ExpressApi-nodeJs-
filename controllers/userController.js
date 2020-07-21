const User = require('../model/user')
const returnFormat = require('./returnFormat')

const user_get = async (req, res) => {

    try {
        const retVal = await User.find().sort({ createdAt: -1 })

        if (retVal)
            returnFormat.success(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const user_get_byID = async (req, res) => {
    const id = req.params.id

    try {
        const retVal = await User.findById(id)

        if (retVal)
            returnFormat.success(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const user_post = async (req, res) => {

    const user = new User(req.body)

    try {
        const retVal = await user.save()

        if (retVal)
            returnFormat.success(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const user_patch = async (req, res) => {

    const id = req.params.id

    try {
        await User.updateOne({ _id: ObjectId(id) }, req.body, (err, retVal) => {
            res.send(
                (err === null) ? returnFormat.success(res, retVal) : returnFormat.error400(res)
            )
        })
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const user_delete = async (req, res) => {
    const id = req.params.id

    try {
        const retVal = await User.findByIdAndDelete(id)

        if (retVal)
            returnFormat.success(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

module.exports = {
    user_get,
    user_get_byID,
    user_post,
    user_patch,
    user_delete
}