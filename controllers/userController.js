const bcryipt = require('bcrypt')
const User = require('../model/user')
const returnFormat = require('./returnFormat')
const Joi = require('@hapi/joi')

const user_register = async (req, res) => {

    const userRequest = req.body

    let validate = await validateRegister(req.body)

    if (!validate.isValid) return returnFormat.validate422(res, validate.message)

    const user = await User.find({ userName: userRequest.userName })

    if (user.length == 0) {
        try {
            const salt = await bcryipt.genSalt()
            const hashPassword = await bcryipt.hash(userRequest.password, salt)

            const user = {
                userName: userRequest.userName,
                password: hashPassword,
                name: userRequest.name,
                role: userRequest.role,
                email: userRequest.email
            }

            User.insertMany(user)
            console.log("registered", userRequest)

            returnFormat.success200(res, user)
        }
        catch (err) {
            returnFormat.error500(res, err)
        }
    }
    else
        return returnFormat.error400(res, 'user already exist')
}

const validateRegister = async user => {
    const schema = Joi.object({
        userName: Joi.string().alphanum().min(3).max(15).required(),
        password: Joi.string().alphanum().min(8).max(30).required(),
        name: Joi.string().alphanum().min(3).max(15).required(),
        email: Joi.string().email().required(),
        role: Joi.array().items(Joi.string())
    })

    try {
        const result = await schema.validateAsync(user)

        if (result.error == null) return { isValid: true, message: "" }
        else return { isValid: false, message: result.error.toString() }
    }
    catch (err) {
        return { isValid: false, message: err.details[0].message }
    }
}

const user_get = async (req, res) => {

    try {
        const retVal = await User.find().sort({ createdAt: -1 })

        if (retVal)
            returnFormat.success200(res, retVal)
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
            returnFormat.success200(res, retVal)
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
            returnFormat.success200(res, retVal)
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
                (err === null) ? returnFormat.success200(res, retVal) : returnFormat.error400(res)
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
            returnFormat.success200(res, retVal)
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
    user_delete,
    user_register
}