const catchAsync = require('../utils/catchAsync')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const cookieUtils = require('../utils/cookieUtils')

exports.imageResize = catchAsync(async (req, res, next) => {
    const uploadPath = path.join(__dirname, '../uploads', req.file.filename)
    const downloadPath = path.join(__dirname, '../downloads', req.file.filename)

    try {
        let decoded = cookieUtils.validateCookie(req, res)
        console.log('decoded', decoded)
    } catch (err) {
        console.log('error caught', err)
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
