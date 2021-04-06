const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

const signToken = (name) => {
    return jwt.sign({ name: name }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({
        email: email,
    }).select('+password')

    if (user == null || user.name == null || user.password == null) {
        res.render('redirect', {
            redirect_script_src: req.app.locals.redirect_script_src,
            redirect_issue_message: 'invalid credentials',
            redirect_api_src: req.app.locals.redirect_api_src,
            base_url: req.app.locals.base_url,
        })
        return
    }

    const token = await signToken(user.name)

    if (password.localeCompare(user.password) === 0) {
        res.cookie('jwt', token, { secure: true, httpOnly: true })
        res.redirect('/')
    } else {
        res.render('redirect', {
            redirect_script_src: req.app.locals.redirect_script_src,
            redirect_issue_message: 'invalid credentials',
            redirect_api_src: req.app.locals.redirect_api_src,
            base_url: req.app.locals.base_url,
        })
    }
})

exports.logout = catchAsync(async (req, res, next) => {
    res.clearCookie('jwt')
    res.redirect('/')
})

exports.createAccount = catchAsync(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({
        email: email,
    })

    if (user == null) {
        const newUser = new User(req.body)
        const success = await newUser.save()
        res.redirect('/login')
        return
    }
    res.render('redirect', {
        redirect_script_src: req.app.locals.redirect_script_src,
        redirect_issue_message: 'account already exists',
        redirect_api_src: req.app.locals.redirect_api_src,
        base_url: req.app.locals.base_url,
    })
})
