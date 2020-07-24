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
            return returnFormat.error500(res, "encription invalid")
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

function insertAuth(res, user, refreshToken) {
    const auth = { userName: user.userName, refreshToken: refreshToken }
    Auth.insertMany(auth)
    console.log(auth)
}

function generateAccessToken(userName) {
    return jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' })
}



module.exports = {
    login,
    logout,
    token
}