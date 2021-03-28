const jwt = require('jsonwebtoken')
const cookie = require('cookie')

exports.validateCookie = (req, res) => {
    let cookies = cookie.parse(req.headers.cookie)
    if (cookies === undefined) {
        throw new Error('cookie not found')
    }
    let decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET_TOKEN)
    return decoded
}
