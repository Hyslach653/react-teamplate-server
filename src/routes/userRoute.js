const { checkAuth } = require('../middlewares/checkAuth.js')
const express = require('express'),
  router = express.Router(),
  controller = require('../controllers/userController.js')

router.post('/signup', controller.signup)

router.post('/login', controller.login)

router.delete('/delete/:email', checkAuth, controller.delete_user)

router.get('/get_user_info', checkAuth, controller.get_user_info)

router.post('/change_pw', checkAuth, controller.change_pw)

router.post('/forgot_pw', controller.forgot_pw)

module.exports = router
