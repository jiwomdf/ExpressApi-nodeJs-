const bcryipt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const Auth = require('../model/auth')
const returnFormat = require('./returnFormat')

const login = async (req, res) => {

    console.log("Login in ", req.body)
    const user = await User.findOne({ userName: req.body.userName })

    if (user.length <= 0)
        return returnFormat.error400(res, 'Cannot find user')

    try {
        const isValid = await bcryipt.compare(req.body.password, user.password)
        if (isValid) {
            let refreshToken = createJwt(res, user)
            insertAuth(res, user, refreshToken)
        }
        else
            return returnFormat.error500(res, err)
    }
    catch (err) {
        return returnFormat.error500(res, err)
    }
}

const logout = async (req, res) => {

    try {
        console.log(req.body.userName)
        await Auth.deleteMany({
            userName: {
                $regex: req.body.userName
            }
        })
        return returnFormat.noContent204(res, "logout")
    }
    catch (err) {
        return returnFormat.error400(res, err)
    }
}

function createJwt(res, user) {

    const userName = { name: user.userName }
    const accessToken = generateAccessToken(userName)
    const refreshToken = jwt.sign(userName, process.env.REFRESH_TOKEN_SECRET)

    res.json({ accessToken: accessToken, refreshToken: refreshToken })

    return refreshToken
}

function insertAuth(res, user, refreshToken) {
    const auth = { userName: user.userName, refreshToken: refreshToken }
    Auth.insertMany(auth)
    console.log(auth)
}

function generateAccessToken(userName) {
    return jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}


module.exports = {
    login,
    logout
}