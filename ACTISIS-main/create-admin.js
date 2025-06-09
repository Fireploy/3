// Script temporal para crear un usuario administrador
import mongoose from 'mongoose'
import User from './models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const createAdminUser = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Conectado a MongoDB')

    // Usuario administrador
    const adminData = {
      name: 'Administrador ACTISIS',
      email: 'admin@ufps.edu.co',
      password: 'admin123',
      role: 'admin'
    }

    // Verificar si ya existe
    const existingUser = await User.findOne({ email: adminData.email })
    if (!existingUser) {
      const newUser = new User(adminData)
      await newUser.save()
      console.log(`Usuario administrador creado: ${adminData.name}`)
      console.log(`Email: ${adminData.email}`)
      console.log(`Password: ${adminData.password}`)
    } else {
      console.log(`Usuario administrador ya existe: ${adminData.name}`)
    }

    console.log('Proceso completado')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createAdminUser()
