const express = require('express')
const blogController = require('../controllers/blogController')
const router = express.Router()
const authorizeMiddleware = require('./authorizeMiddleware')

router.get('/', authorizeMiddleware, blogController.blog_get)
router.post('/', authorizeMiddleware, blogController.blog_post)
router.patch('/:id', authorizeMiddleware, blogController.blog_patch)
router.get('/:id', blogController.blog_get_byID)
router.delete('/:id', authorizeMiddleware, blogController.blog_delete)

module.exports = router