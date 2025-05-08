const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
    const token = req.header('Authorization')?.split(' ')[1]
    if(!token) return res.status(401).json({message: 'Acceso denegado. Token no proporionado'})

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded  //id:..., email:....
            next()
        }catch(err){
            res.status(400).json({message:'Token invalido'})
        }
}

module.exports = authMiddleware