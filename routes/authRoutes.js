const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

router.post('/login', authController.login)
router.post('/login_mobile', authController.login_mobile)
router.post('/logout', authController.logout)
router.post('/token', authController.token)
router.post('/checkLogin', authController.checkLogin)

module.exports = router