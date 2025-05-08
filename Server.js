require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express()
app.use(express.json());


mongoose.connect(process.env.MONGO_URL)
  .then(()=>console.log('MongoDB Atlas conectado'))
  .catch(err=>console.error('❌ Error al conectar MongoDB',err))

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 500

app.listen(process.env.PORT, ()=>console.log(`Servidor corriendo en el puerto ${PORT}`))