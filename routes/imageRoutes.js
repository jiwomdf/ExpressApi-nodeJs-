const express = require('express')
const imageController = require('../controllers/imageController')
const authorizeMiddleware = require('./authorizeMiddleware')
const returnFormat = require('../controllers/returnFormat')
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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}.jpg`)
    }
})

const upload = multer({
    //dest: './public/',
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 10000
    }
});

router.post('/', [authorizeMiddleware, upload.single('file')], imageController.image_post);
router.get('/', imageController.image_get)
router.delete('/:id', authorizeMiddleware, imageController.image_delete)

router.use(function (err, req, res, next) {

    if (err.code == "LIMIT_FILE_TYPE") {
        console.log("LIMIT_FILE_TYPE")
        returnFormat.validate422(res, "invalid file type")
        return
    }

    if (err.code == "LIMIT_FILE_SIZE") {
        console.log("LIMIT_FILE_SIZE")
        returnFormat.validate422(res, "file must be less than 10 kb")
        return
    }
})

module.exports = router