const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()
const authorizeMiddleware = require('./authorizeMiddleware')

router.get('/', authorizeMiddleware, userController.user_get)
router.post('/', authorizeMiddleware, userController.user_post)
router.patch('/:id', authorizeMiddleware, userController.user_patch)
router.get('/:id', authorizeMiddleware, userController.user_get_byID)
router.delete('/:id', authorizeMiddleware, userController.user_delete)
router.post('/register', userController.user_register)

module.exports = router