const express =  require('express');
const router = express.Router();
const {changepassword, login, register} = require('../Controllers/authControllers');
const auth = require('../Middleware/auth')

router.post('/login', login)
router.post('/register', register)
router.post('/change-password',auth, changepassword)

module.exports = router;