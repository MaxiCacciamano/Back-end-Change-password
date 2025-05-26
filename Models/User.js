const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username:{type: String, require: true, unique: true},
    password:{type:String, require: true},
    role:{type:String, enum: ['admin', 'user'], default: 'user'}
},{timestamps:true});

//Metodo para encryptar contraseña
userSchema.pre('save', async function (next){
    if(this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


//Metodo para comparar contraseña
userSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
}


module.exports = mongoose.model('User', userSchema)


