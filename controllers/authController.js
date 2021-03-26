const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const path = require('path')

const signToken = (id) => {
    return jwt.sign({ id: 'Abhishek' }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({
        email: email,
    }).select('+password')

    const token = await signToken(user._id)

    if (password.localeCompare(user.password) === 0) {
        res.cookie('jwt', token, { secure: true, httpOnly: true })
        res.status(200).sendFile('image-edit.html', {
            root: path.join(__dirname, '../public'),
        })
    } else {
        next(new Error('password does not match'))
    }
})
