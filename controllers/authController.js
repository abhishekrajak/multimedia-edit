const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

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
        res.render('image-edit', {
            image_edit_script_src: req.app.locals.image_edit_scripts_src,
            image_edit_style_src: req.app.locals.image_edit_style_src,
            image_edit_api_src: req.app.locals.image_edit_api_src,
        })
    } else {
        res.render('redirect', {
            redirect_script_src: req.app.locals.redirect_script_src,
            redirect_issue_message: 'invalid credentials',
            redirect_api_src: req.app.locals.redirect_api_src,
        })
    }
})

exports.createAccount = catchAsync(async (req, res, next) => {})
