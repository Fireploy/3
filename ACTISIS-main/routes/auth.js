import express from 'express'
import User from '../models/User.js'
import { compare } from 'bcryptjs'
import pkg from 'jsonwebtoken'
const { sign } = pkg

const router = express.Router()

// Registro de usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  try {
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    if (name.length < 3) {
      return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ message: 'Por favor, introduce un email válido' })
    }

    try {
      user = new User({ name, email, password })
      await user.save()
    } catch (err) {
      return res.status(500).json({ message: 'Error en el servidor' })
    }

    res.status(201).json({ message: 'Usuario registrado exitosamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' })
  }
})

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body // Extraer email y password del cuerpo de la solicitud

    // Verificar si el usuario existe
    const user = await User.findOne({ email }).select('-__v')
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Verificar la contraseña
    const isMatch = await compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Generar un token JWT
    const token = sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role // Incluir el rol del usuario en el token
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    )
    user.token = token
    await user.save()

    const { password: _, ...userData } = user._doc

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      .json({ user: userData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error en el servidor' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('access_token')
  req.session.user = null
  res.redirect('/')
})

export default router
