const express = require('express')
const animalController = require('../controllers/animalController')
const router = express.Router()

router.get('/', animalController.animal_get)
router.post('/', animalController.animal_create_post)
router.patch('/:id', animalController.animal_update_post)
router.delete('/:id', animalController.animal_delete)
router.get('/:id', animalController.animal_get_byID)


module.exports = router