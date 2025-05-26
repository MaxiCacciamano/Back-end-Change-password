const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    nombreCuenta:{type:String, required:true},
    ssid:{type:String, required:true},
    password:{type:String,required:true},
    updateAt:{type:Date, default:Date.now}
});

module.exports = mongoose.model('Update', updateSchema)