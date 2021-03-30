const catchAsync = require('../utils/catchAsync')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const cookieUtils = require('../utils/cookieUtils')
const app = require('../app')

exports.imageResize = catchAsync(async (req, res, next) => {
    const uploadPath = path.join(__dirname, '../uploads', req.file.filename)
    const downloadPath = path.join(__dirname, '../downloads', req.file.filename)

    try {
        let decoded = cookieUtils.validateCookie(req, res)
    } catch (err) {
        res.render('redirect', {
            redirect_script_src: req.app.locals.redirect_script_src,
            redirect_issue_message: 'please login to use app',
            redirect_api_src: req.app.locals.redirect_api_src,
        })
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
