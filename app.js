const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const qs = require('querystring')
const fs = require('fs')
const morgan = require('morgan')
const jimp = require('jimp')
const stream = require('stream')
const sharp = require('sharp');

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

app.post('/image/edit', upload.single('myfile'), async (req, res) => {
    const filePath = path.join(__dirname, '/uploads', req.file.filename)
    const downloadPath = path.join(__dirname, 'downloads', req.file.filename);

    try{
        const r = await sharp(filePath).
        resize(parseInt(req.body.width), parseInt(req.body.height), {
            fit: 'fill'
        }).toFile(downloadPath)
        console.log(r);
        const readStream = fs.createReadStream(
            downloadPath
        )
        res.writeHead(200,
            {'Content-disposition': `attachment; filename=${req.file.originalname}`});

        readStream.pipe(res)
    }catch (err){
        console.log(err);
        res.status(404).json({
            result: 'error',
            message : err
        })
    }


});

module.exports = app