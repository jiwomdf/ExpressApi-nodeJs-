const express = require('express')
const uploadController = require('../controllers/uploadController')
const authorizeMiddleware = require('./authorizeMiddleware')
const router = express.Router()
const multer = require('multer')

const fileFilter = function (req, file, cb) {

    const allowedType = ['image/jpeg', 'image/png']

    if (!allowedType.includes(file.mimetype)) {
        const error = new Error("Wrong Type of Image")
        error.code = "LIMIT_FILE_TYPE"
        return cb(error, true)
    }

    cb(null, true)
}

const upload = multer({
    dest: './uploads/',
    fileFilter,
    limits: {
        fileSize: 6000
    }
});

router.post('/', [authorizeMiddleware, upload.single('file')], uploadController.upload_post);

router.use(function (err, req, res, next) {
    if (err.code == "LIMIT_FILE_TYPE") {
        console.log("LIMIT_FILE_TYPE")
        res.status(422).json({ error: "Only image are allowed" })
        return
    }

    if (err.code == "LIMIT_FILE_SIZE") {
        console.log("LIMIT_FILE_SIZE")
        res.status(422).json({ error: "Image to large" })
        return
    }
})

module.exports = router