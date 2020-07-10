const express = require('express')
const animalController = require('../controllers/animalController')
const router = express.Router()

router.get('/', animalController.animal_index)
router.post('/', animalController.animal_create_post)
router.get('/create', animalController.animal_create_get)
router.get('/:id', animalController.animal_details)
router.delete('/:id', animalController.animal_delete)


module.exports = router