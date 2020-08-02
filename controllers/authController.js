// const bcryipt = require('bcrypt-nodejs')
const bcryipt = require('bcryptjs')

const jwt = require('jsonwebtoken')
const User = require('../model/user')
const Auth = require('../model/auth')
const returnFormat = require('./returnFormat')
const Joi = require('@hapi/joi')
const fetch = require('node-fetch');

const login = async (req, res) => {

    let validateCap = await validateCaptcha(req)
    if (!validateCap.isValid)
        return returnFormat.error400(res, validateCap.message)

    let validate = await validateLogin(req.body)
    if (!validate.isValid)
        return returnFormat.validate422(res, validate.message)

    /* check if user is exists in users collections */
    const user = await User.findOne({ userName: req.body.userName })

    if (user == null || user == undefined)
        return returnFormat.validate422(res, 'Cannot find user')

    try {
        const isValid = await bcryipt.compare(req.body.password, user.password)
        if (isValid) {
            let refreshToken = createJwt(res, user)

            /* check user login in auths collections */
            await lookupAuth(req, user, refreshToken)
        }
        else
            return returnFormat.validate422(res, "password incorrect")
    }
    catch (err) {
        return returnFormat.error500(res, err)
    }
}

const validateCaptcha = async req => {

    if (!req.body.captcha)
        return { isValid: false, message: 'Please select captcha' }

    /* secret key */
    const captchaSecretKey = process.env.CAPTCHA_SECRET_KEY

    const verifyURL = "https://www.google.com/recaptcha/api/siteverify";

    // Make a request to verifyURL
    const body = await fetch(verifyURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${captchaSecretKey}&response=${req.body.captcha}`,
    }).then(res => res.json());

    // If not successful
    if (body.success == undefined || body.success == null || !body.success)
        return { isValid: false, message: 'Failed captcha verification' }

    // If successful
    return { isValid: true, message: 'Captcha passed' }
}

const validateLogin = async user => {
    const schema = Joi.object({
        userName: Joi.string().alphanum().min(3).max(15).required(),
        password: Joi.string().alphanum().required(),
        captcha: Joi.allow()
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

const logout = async (req, res) => {

    try {
        if (req.body.userName != null && req.body.userName != undefined && req.body.userName != "" && typeof req.body.userName == "string") {
            await Auth.deleteMany({
                userName: {
                    $regex: req.body.userName
                }
            })
            return returnFormat.noContent204(res, req.body.userName + " logout")
        }
        else
            return returnFormat.error400(res, "empty userName")
    }
    catch (err) {
        return returnFormat.error400(res, err)
    }
}

const token = ('/token', async (req, res) => {

    const refreshToken = req.body.refreshToken
    const accessToken = req.body.accessToken

    if (accessToken == null)
        return res.sendStatus(401)

    if (refreshToken == null)
        return res.sendStatus(401)

    const auths = await Auth.find({ refreshToken: refreshToken })
    console.log(auths)

    let isExist = checkAuthsExist(auths, refreshToken)

    if (!isExist)
        return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return status.sendStatus(403)

        const userId = { name: user.name }

        const accessToken = generateAccessToken(userId)

        const retVal = { userName: req.body.userName, accessToken: accessToken }
        res.json(retVal)
    })
})

const checkLogin = ('/checkLogin', async (req, res) => {

    const refreshToken = req.body.refreshToken
    const accessToken = req.body.accessToken

    if (accessToken == null)
        return res.sendStatus(401)

    if (refreshToken == null)
        return res.sendStatus(401)

    const auths = await Auth.find({ refreshToken: refreshToken })
    console.log("auths")

    let isExist = checkAuthsExist(auths, refreshToken)

    const retVal = { userName: req.body.userName, refreshToken: refreshToken }

    if (!isExist)
        return res.sendStatus(403)
    else
        return returnFormat.success200(res, retVal)
})


function checkAuthsExist(auths, refreshToken) {
    for (let i = 0; i < auths.length; i++) {
        if (auths[i].refreshToken == refreshToken)
            return true
    }

    return false
}

function createJwt(res, user) {

    const userName = { name: user.userName }
    const accessToken = generateAccessToken(userName)
    const refreshToken = jwt.sign(userName, process.env.REFRESH_TOKEN_SECRET)

    res.json({ accessToken: accessToken, refreshToken: refreshToken })

    return refreshToken
}

async function lookupAuth(req, user, refreshToken) {
    const auth = await Auth.findOne({ userName: req.body.userName })

    if (auth != null && auth != undefined) {
        await Auth.findOneAndUpdate({ userName: req.body.userName }, {
            $set: {
                "refreshToken": refreshToken,
                "loginAt": Date.now()
            }
        })
        console.log(auth.userName, "updated in auth")
    }
    else {
        const auth = { userName: user.userName, refreshToken: refreshToken }
        await Auth.insertMany(auth)
        console.log(auth.userName, "inserted to auth")
    }
}

function generateAccessToken(userName) {
    return jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' })
}



module.exports = {
    login,
    logout,
    token,
    checkLogin
}