const returnFormat = require('../controllers/returnFormat')
const jwt = require('jsonwebtoken')

module.exports = authorizeToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]


    if (token == null)
        return returnFormat.unauthorized401(res)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return returnFormat.forbidden403(res)

        req.user = user
        next()
    })
}