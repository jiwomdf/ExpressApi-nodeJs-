const express = require('express')
const animalController = require('../controllers/animalController')
const router = express.Router()
const authorizeMiddleware = require('./authorizeMiddleware')

router.get('/', animalController.animal_get)
router.post('/', authorizeMiddleware, animalController.animal_post)
router.patch('/:id', authorizeMiddleware, animalController.animal_patch)
router.delete('/:id', authorizeMiddleware, animalController.animal_delete)
router.get('/:id', animalController.animal_get_byID)
router.post('/picture/:userName', authorizeMiddleware, animalController.animal_get_with_img_byUserName)
router.post('/picture', animalController.animal_get_with_img)
module.exports = router