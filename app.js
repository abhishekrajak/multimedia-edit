const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const imageRouter = require('./routes/imageRoutes')
const userRouter = require('./routes/userRoutes')
const catchAsync = require('./utils/catchAsync')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.get('/', (req, res) => {
    res.status(200).sendFile(`./public/image-edit.html`, {
        root: __dirname,
    })
})

app.get('/login', (req, res) => {
    res.status(200).sendFile('./public/login.html', {
        root: __dirname,
    })
})

app.get('/create-account', (req, res) => {
    res.status(200).sendFile('./public/create-account.html', {
        root: __dirname,
    })
})

app.get('/test', (req, res) => {
    const x = res.render('image-edit', {
        script_src: 'http://localhost:3000/image-edit-script.js',
        style_src: 'http://localhost:3000/style.css',
        api_src: 'http://localhost:3000/api/image/edit',
    })
})

app.use('/api/image/edit', imageRouter)
app.use('/api/user', userRouter)

app.use((req, res, next) => {
    const error = new Error('Path not found')
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    })
})

module.exports = app
