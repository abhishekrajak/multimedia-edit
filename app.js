const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const qs = require('querystring')
const fs = require('fs')
const morgan = require('morgan')
const jimp = require('jimp')
const stream = require('stream')

var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    },
})

var upload = multer({ storage: storage })

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

app.post('/upload', upload.single('myfile'), (req, res) => {
    let filePath = path.join(__dirname, '/uploads', req.file.filename)
    console.log(filePath)
    jimp.read(filePath, (err, file) => {
        if (err) {
            throw err
        }
        console.log(__dirname)
        console.log(file.getHeight(), file.getWidth())
        console.log(req.body)
        console.log(typeof req.body.height)
        file.resize(parseInt(req.body.height), parseInt(req.body.width)).write(
            path.join(__dirname, '/downloads', req.file.filename)
        )
        const r = fs.createReadStream(
            path.join(__dirname, '/downloads', req.file.filename)
        )
        const ps = new stream.PassThrough()
        stream.pipeline(r, ps, (err) => {
            if (err) {
                console.log(err)
                return res.sendStatus(400)
            }
        })
        ps.pipe(res)
    })
})

module.exports = app
