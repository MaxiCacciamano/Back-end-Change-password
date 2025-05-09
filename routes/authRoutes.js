const express =  require('express');
const router = express.Router();
const {changepassword, login, register, updateDate, users} = require('../Controllers/authControllers');
const auth = require('../Middleware/auth')

router.post('/login', login)
router.post('/register', register)
router.post('/change-password',auth, changepassword)
router.post('/update', updateDate)
router.get('/allusers', users)

module.exports = router;