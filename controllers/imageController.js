const catchAsync = require('../utils/catchAsync')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const cookieUtils = require('../utils/cookieUtils')

exports.imageResize = catchAsync(async (req, res, next) => {
    const uploadPath = path.join(__dirname, '../uploads', req.file.filename)
    const downloadPath = path.join(__dirname, '../downloads', req.file.filename)

    try {
        let decoded = cookieUtils.validateCookie(req, res)
    } catch (err) {
        res.redirect('http://localhost:3000/redirect.html')
        return
    }
    try {
        const resultImage = await sharp(uploadPath)
            .resize(parseInt(req.body.width), parseInt(req.body.height), {
                fit: 'fill',
            })
            .toFile(downloadPath)

        const readStream = fs.createReadStream(downloadPath)
        res.writeHead(200, {
            'Content-disposition': `attachment; filename=${req.file.originalname}`,
        })

        readStream.pipe(res)
    } catch (err) {
        throw err
    }
})
