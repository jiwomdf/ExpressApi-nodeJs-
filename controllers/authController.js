const bcryipt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const returnFormat = require('./returnFormat')

let refreshTokens = []

const login = async (req, res) => {

    console.log(req.body)
    const user = await User.findOne({ userName: req.body.userName })

    console.log(user)

    if (user.length <= 0)
        return returnFormat.error400(res, 'Cannot find user')

    try {
        const isValid = await bcryipt.compare(req.body.password, user.password)
        if (isValid)
            createJwt(res, user)
        else
            return returnFormat.error500(res, err)
    }
    catch (err) {
        return returnFormat.error500(res, err)
    }
}

function createJwt(res, user) {

    const userName = { name: user.userName }

    const accessToken = generateAccessToken(userName)
    const refreshToken = jwt.sign(userName, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
}

function generateAccessToken(userName) {
    return jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}


module.exports = {
    login
}