const express =  require('express');
const router = express.Router();
const {changepassword, login, register, updateDate, users, getUpdateForAdmin} = require('../Controllers/authControllers');
const {auth, adminOnly} = require('../Middleware/auth')

router.post('/login', login)
router.post('/createadmin', register)
router.post('/change-password',auth, changepassword)
router.post('/update',updateDate)
router.get('/allusers',auth,adminOnly,users)
router.get('/admin/panel', auth, adminOnly, getUpdateForAdmin)
router.get('/test', auth, (req, res)=>{
    // console.log('User en ruta:', req.user)
    res.json({user:req.user}),
    {withCredentials: 'include'}

})

module.exports = router;