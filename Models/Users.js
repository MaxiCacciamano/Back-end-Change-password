const mongoose = require('mongoose');

const wifiConfigSchema = new mongoose.Schema({
    nombreCuenta:{type:String, required:true},
    ssid:{type:String, required:true},
    password:{type:String,required:true},
    // updateAt:{type:Date, default:Date.now}
},{
    timestamps:true
});

module.exports = mongoose.model('WifiConfig', wifiConfigSchema)