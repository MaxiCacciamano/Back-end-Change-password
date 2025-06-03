
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Update = require('../Models/Update');
const User = require('../Models/User');
const update = require('../Models/Update');

const generarToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:'1d'})
}

exports.updateDate = async(req,res)=>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    const {nombreCuenta,ssid, password} = req.body;
    if(!passwordRegex.test(password)){
        return res.status(400).send({
            message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.'
        })
    }
    try{
        const config = await Update.create(
            {
                nombreCuenta,
                ssid,
                password,
                updateAt: new Date()
            }
        )
        res.status(200).json({message:'Nuevos datos guardados   '})
    }
    catch(err){
        res.status(500).json({message:'Error al guardar en la base de datos', err:err.message})
    }
}

exports.current = async(req,res)=>{
    try{
        const config = await Update.find();
        if(!config) return res.status(404).json({message:'No hay configuracion guardadas'})
            res.status(200).json(config)
    }catch(err){
        res.status(500).json({message: 'Error al obtener datos', err: err.message})
    }
}

exports.users = async(req,res)=>{
try{
    const users = await Update.find()
    res.status(200).json(users)
}
catch(err){
    res.status(500).json({message:"Error al obtener ususario", err: err.message})
}
}

exports.login = async(req, res) => {
    
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({msg:"Usuario no ecnontrado"})
    
        const isMatch = await user.comparePassword(password)
        if(!isMatch) return res.status(404).json({msg:"Contrasela incorrecta"})
    
        req.session.user = {
            id: user._id,
            username: user.username,
            password: user.password,
            role: user.role
        };
        // console.log(req.session.user)
        res.json({message:"Login exitoso", user:req.session.user});
    }catch(err){
        console.log(err.message, "Error en el login")
    }
}

exports.logout = async(req, res )=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).json({message:"Error al cerrar sesion"})
        res.json({message:"Sesion cerrada correctamente"})
    })
}


exports.changepassword = async(req, res) => {
    const {newPassword, repeatPassword, nombreUsuarioFactura, nombrewIFI} = req.body;

    try{
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({message:'Usuario no encontrado'})

        const isMatch = await bcrypt.compare(nombreUsuarioFactura, user.password)
        if(!isMatch) return res.status(404).json({message:'Contraseña incorrecta'})
        

        if(newPassword != repeatPassword){
            return res.status(400).json({message: "La neuva contraseña no coincide  "})
        }
        
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)

        await user.save()
        res.status(200).json({message:'Contraseña actualizada correctamente'})
    }catch(err){
        res.status(500).json({message:'Error del servidor', error:err.message})
    }
}

exports.register = async(req, res)=>{
    try{
        const{username, password} = req.body

        const hashedPassword = await bcrypt.hash(password, 10)
        const nuevoadmin = new User({username, password:hashedPassword, role:'admin'})
        await nuevoadmin.save();
        res.status(201).json({message:'admin creado'})
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:'Error al registrar usuario',
            error:err.message
        });
    }
};

exports.getUpdateForAdmin = async(req, res)=>{
    try{
        if(req.user.role !== "admin"){
            return res.status(403).json({message:"Acceso denegado"})
        }
        const updates = await Update.find();
        res.status(200).json(updates)
    }
    catch(err){
        res.status(404).json({
            message:"Error al traer datos del update",
            error: err.message
        })
    }
}



