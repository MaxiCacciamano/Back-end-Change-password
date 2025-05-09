const mongoose = require('mongoose');

const wifiConfigSchema = new mongoose.Schema({
    ssid:{type:String, required:true},
    nombreCuenta:{type:String, require:true},
    password:{type:String,required:true},
    updateAt:{type:Date, default:Date.now}
})

module.exports = mongoose.model('WifiConfig', wifiConfigSchema)