const catchAsync = require('../utils/catchAsync')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const app = require('../app')

exports.imageResize = catchAsync(async (req, res, next) => {
    const uploadPath = path.join(__dirname, '../uploads', req.file.filename)
    const downloadPath = path.join(__dirname, '../downloads', req.file.filename)

    try {
        const resultImage = await sharp(uploadPath)
            .resize(parseInt(req.body.width), parseInt(req.body.height), {
                fit: 'fill',
            })
            .withMetadata()
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
