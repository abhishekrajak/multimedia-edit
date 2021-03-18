const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const qs = require('querystring')
const fs = require('fs')
const morgan = require('morgan')
const jimp = require('jimp')
const stream = require('stream')

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    },
})

const upload = multer({ storage: storage })

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

app.post('/image/edit', upload.single('myfile'), (req, res) => {
    let filePath = path.join(__dirname, '/uploads', req.file.filename)
    jimp.read(filePath, (err, file) => {
        if (err) {
            throw err
        }
        file.resize(parseInt(req.body.height), parseInt(req.body.width)).write(
            path.join(__dirname, '/downloads', req.file.filename)
        )
        const r = fs.createReadStream(
            filePath = path.join(__dirname, '/downloads', req.file.filename)
        )

        res.writeHead(200,
            {'Content-disposition': `attachment; filename=${req.file.originalname}`});

        r.pipe(res)
    })
})


module.exports = app
