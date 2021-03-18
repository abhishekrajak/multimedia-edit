const catchAsync = require('../utils/catchAsync');
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')

exports.imageResize = catchAsync(async (req, res) => {
    const uploadPath = path.join(__dirname, '../upload', req.file.filename)
    const downloadPath = path.join(__dirname, '../downloads', req.file.filename);

    try{
        console.log('reading file', uploadPath)
        const resultImage = await sharp(uploadPath).
        resize(parseInt(req.body.width), parseInt(req.body.height), {
            fit: 'fill'
        }).toFile(downloadPath)

        console.log('file read successful')
        console.log(resultImage);
        const readStream = fs.createReadStream(
            downloadPath
        )
        res.writeHead(200,
            {'Content-disposition': `attachment; filename=${req.file.originalname}`});

        readStream.pipe(res)
    }catch (err){
        throw err
    }
})