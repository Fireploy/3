// Script temporal para crear usuarios docentes de prueba
import mongoose from 'mongoose'
import User from './models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const createTestUsers = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Conectado a MongoDB')

    // Usuarios docentes de prueba
    const docentes = [
      {
        name: 'Dr. Carlos Rodríguez',
        email: 'carlos.rodriguez@ufps.edu.co',
        password: 'password123',
        role: 'docente'
      },
      {
        name: 'Dra. María García',
        email: 'maria.garcia@ufps.edu.co',
        password: 'password123',
        role: 'docente'
      },
      {
        name: 'Dr. Juan Pérez',
        email: 'juan.perez@ufps.edu.co',
        password: 'password123',
        role: 'docente'
      },
      {
        name: 'Dra. Ana López',
        email: 'ana.lopez@ufps.edu.co',
        password: 'password123',
        role: 'docente'
      }
    ]

    // Verificar si ya existen y crear solo los que no existan
    for (const docenteData of docentes) {
      const existingUser = await User.findOne({ email: docenteData.email })
      if (!existingUser) {
        const newUser = new User(docenteData)
        await newUser.save()
        console.log(`Usuario creado: ${docenteData.name}`)
      } else {
        console.log(`Usuario ya existe: ${docenteData.name}`)
      }
    }

    console.log('Proceso completado')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createTestUsers()
