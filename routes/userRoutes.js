const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.get('/', userController.user_get)
router.post('/', userController.user_post)
router.patch('/:id', userController.user_patch)
router.get('/:id', userController.user_get_byID)
router.delete('/:id', userController.user_delete)

module.exports = router