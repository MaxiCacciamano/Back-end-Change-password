require('dotenv').config();
const express = require('express');
const session = require('express-session')

const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors')

const app = express()

app.use(express.json());
app.use(cors({
  origin:'http://localhost:3000', //Front
  credentials: true //si se utilizan cookies o auth headers
}))

app.use(session({
  secret:process.env.JWT_SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{secure:false} //secure: true solo con HTTPS
}))


mongoose.connect(process.env.MONGO_URL)
  .then(()=>console.log('MongoDB Atlas conectado'))
  .catch(err=>console.error('❌ Error al conectar MongoDB',err))

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

app.listen(process.env.PORT,'0.0.0.0', ()=>console.log(`🚀Servidor corriendo en el puerto ${PORT}`))