const express = require('express')
const uploadController = require('../controllers/uploadController')
const router = express.Router()
const multer = require('multer')

const upload = multer({ dest: './uploads/' });

router.post('/', upload.single('file'), uploadController.upload_post);

module.exports = router