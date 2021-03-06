const express = require('express')
const imageController = require('../controllers/imageController')
const multer = require('multer')
const path = require('path')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() +
                '_' +
                path.parse(file.originalname).name +
                path.extname(file.originalname)
        )
    },
})

const upload = multer({ storage: storage })

router.route('/').post(upload.single('myfile'), imageController.imageResize)

module.exports = router
