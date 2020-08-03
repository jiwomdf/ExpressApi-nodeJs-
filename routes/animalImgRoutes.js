const express = require('express')
const animalImgController = require('../controllers/animalImgController')
const router = express.Router()
const authorizeMiddleware = require('./authorizeMiddleware')

router.get('', animalImgController.animal_get_with_img)
router.post('/withId/:userName', authorizeMiddleware, animalImgController.animal_get_with_img_byUserName)
router.post('/dynamic', animalImgController.animal_get_with_img_dynamicParam)
module.exports = router