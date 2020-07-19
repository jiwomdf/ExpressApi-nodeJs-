const express = require('express')
const blogController = require('../controllers/blogController')
const router = express.Router()

router.get('/', blogController.blog_get)
router.post('/', blogController.blog_post)
router.patch('/create', blogController.blog_patch)
router.get('/:id', blogController.blog_get_byID)
router.delete('/:id', blogController.blog_delete)

router.get('/about', (req, res) => {
    res.render('about', { title: 'About' })
})

module.exports = router