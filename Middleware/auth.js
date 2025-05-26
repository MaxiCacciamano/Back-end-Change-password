const jwt = require('jsonwebtoken');
const User = require('../Models/User');

exports.auth = async (req, res, next)=>{
    if(!req.session.user){
        return res.status(404).json({message:'Acceso no autorizado'})
    }
    req.user = req.session.user;
    // console.log('Session auth', req.user)
    next();
}

exports.adminOnly = (req, res, next) =>{
    // console.log("Usuario atuenticado", req.user)
    if(req.session.user?.role !== "admin"){
        return res.status(404).json({msg:"Seccion solo para administradores"})
    }
    next();
}

