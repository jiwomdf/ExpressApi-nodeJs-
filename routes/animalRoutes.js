const express = require('express')
const animalController = require('../controllers/animalController')
const router = express.Router()

router.get('/', animalController.animal_get)
router.post('/', animalController.animal_post)
router.patch('/:id', animalController.animal_patch)
router.delete('/:id', animalController.animal_delete)
router.get('/:id', animalController.animal_get_byID)

module.exports = router