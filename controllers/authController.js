const bcryipt = require('bcrypt')
const User = require('../model/user')
const returnFormat = require('./returnFormat')

let refreshTokens = []

const login = async (req, res) => {

    const user = await User.find({ userName: req.body.userName })

    console.log(req.body)
    console.log(user.length)

    if (user.length <= 0)
        return returnFormat.error400(res, 'Cannot find user')

    try {
        const isValid = await bcryipt.compare(req.body.password, user.password)

        if (isValid)
            createJwt(res, user)
        else
            res.send("not allowed")
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