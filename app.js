const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const imageRouter = require('./routes/imageRoutes')
const userRouter = require('./routes/userRoutes')
const catchAsync = require('./utils/catchAsync')
const cookieUtils = require('./utils/cookieUtils')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    app.locals.base_url = 'http://localhost:3000'
} else {
    app.locals.base_url = 'https://multimedia-edit.herokuapp.com'
}

const base_url = app.locals.base_url
app.locals.redirect_script_src = base_url + '/scripts/redirect-script.js'
app.locals.login_api_src = base_url + '/user/login'
app.locals.image_edit_script_src = base_url + '/scripts/image-edit-script.js'
app.locals.image_edit_style_src = base_url + '/stylesheets/style.css'
app.locals.image_edit_api_src = base_url + '/image/edit'
app.locals.create_account_api_src = base_url + '/user/create-account'
app.locals.redirect_api_src = base_url + '/login'
app.locals.logout_api_src = base_url + '/user/logout'
app.locals.create_account_url = base_url + '/create-account'

app.get('/', (req, res) => {
    try {
        const decoded = cookieUtils.validateCookie(req, res)
        res.render('image-edit', {
            image_edit_script_src: req.app.locals.image_edit_scripts_src,
            image_edit_style_src: req.app.locals.image_edit_style_src,
            image_edit_api_src: req.app.locals.image_edit_api_src,
            name: decoded.name,
        })
    } catch (e) {
        res.redirect('/login')
    }
})

app.get('/login', (req, res) => {
    try {
        const decoded = cookieUtils.validateCookie(req, res)
        res.redirect('/')
    } catch (e) {
        res.render('login', {
            login_api_src: req.app.locals.login_api_src,
            create_account_url: req.app.locals.create_account_url,
        })
    }
})

app.get('/create-account', (req, res) => {
    try {
        const decoded = cookieUtils.validateCookie(req, res)
        res.redirect('/')
    } catch (e) {
        res.render('create-account', {
            create_account_api_src: req.app.locals.create_account_api_src,
        })
    }
})

app.use('/image/edit', imageRouter)
app.use('/user', userRouter)

app.use((req, res, next) => {
    const error = new Error('Path not found')
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message || 'Internal Server Error',
        },
    })
})

module.exports = app
