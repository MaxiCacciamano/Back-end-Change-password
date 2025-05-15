const User = require('../Models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const WifiConfig = require('../Models/Users')

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
        const config = await WifiConfig.create(
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
        const config = await WifiConfig.findOne();
        if(!config) return res.status(404).json({message:'No hay configuracion guardada'})
            res.status(200).json(config)
    }catch(err){
        res.status(500).json({message: 'Error al obtener datos', err: err.message})
    }
}

exports.users = async(req,res)=>{
try{
    const users = await User.find()
    res.status(200).json(users)
}
catch(err){
    res.status(500).json({message:"Error al obtener ususario", err: err.message})
}
}

exports.login = async(req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: 'Usuario no encontrado'})

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(404).json({message: 'Contraseña incorrecta'})
        
        const token = jwt.sign(
            {id:user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )
        res.status(200).json({message: 'Aca esta tu token', token})
    }catch(err){
        res.status(500).json({message:'Error en el servidor', error: err.message})
    }
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
        const{email, password} = req.body

        const usuarioExistente = await User.findOne({email});
        if(usuarioExistente){
            return res.status(400).json({message:'El usuario ya existe'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new User({email, password: hashedPassword});
        await nuevoUsuario.save();

        const token = generarToken(nuevoUsuario._id);
        res.status(201).json({token});
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Error al registrar usuario'});
    }
};



