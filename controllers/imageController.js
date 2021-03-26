const catchAsync = require('../utils/catchAsync')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')

exports.imageResize = catchAsync(async (req, res, next) => {
    const uploadPath = path.join(__dirname, '../uploads', req.file.filename)
    const downloadPath = path.join(__dirname, '../downloads', req.file.filename)

    try {
        let cookies = cookie.parse(req.headers.cookie)
        if (cookies === undefined) {
            throw new Error('cookie not found')
        }
        let decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET_TOKEN)
        console.log('decoded', decoded)
    } catch (err) {
        // console.log('error caught', err)
        res.redirect('http://localhost:3000/redirect.html')
        return
    }
    try {
        console.log('reading file', uploadPath)
        const resultImage = await sharp(uploadPath)
            .resize(parseInt(req.body.width), parseInt(req.body.height), {
                fit: 'fill',
            })
            .toFile(downloadPath)

        console.log('file read successful')
        console.log(resultImage)
        const readStream = fs.createReadStream(downloadPath)
        res.writeHead(200, {
            'Content-disposition': `attachment; filename=${req.file.originalname}`,
        })

        readStream.pipe(res)
    } catch (err) {
        throw err
    }
})
