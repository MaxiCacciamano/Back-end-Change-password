require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors')

const app = express()

app.use(cors({
  origin:'*', //Front
  credentials: true //si se utilizan cookies o auth headers
}))

app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(()=>console.log('MongoDB Atlas conectado'))
  .catch(err=>console.error('❌ Error al conectar MongoDB',err))

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

app.listen(process.env.PORT,'0.0.0.0', ()=>console.log(`🚀Servidor corriendo en el puerto ${PORT}`))