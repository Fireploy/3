import express from 'express'
import User from '../models/User.js'
import { genSalt, hashSync } from 'bcryptjs'

const router = express.Router()

// Middleware para verificar si es admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' })
}

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    // Excluir la contraseña de los resultados
    const usuarios = await User.find().select('-password')
    res.status(200).json(usuarios)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// POST /api/users - Crear un nuevo usuario (solo admin)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { email, password, name, role } = req.body

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' })
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' })
    }

    // Validar rol
    if (role && !['user', 'admin', 'docente'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' })
    }

    // Crear hash de la contraseña
    const salt = await genSalt(10)
    const hashedPassword = hashSync(password, salt)

    // Crear nuevo usuario
    const newUser = new User({
      email,
      password: hashedPassword,
      name: name || '',
      role: role || 'user'
    })

    await newUser.save()

    // Devolver usuario sin contraseña
    const userResponse = { ...newUser._doc }
    delete userResponse.password

    res.status(201).json(userResponse)
  } catch (error) {
    console.error('Error al crear usuario:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors })
    }
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// GET /api/users/:id - Obtener un usuario por ID (solo admin o el propio usuario)
router.get('/:id', async (req, res) => {
  try {
    // Verificar si es admin o el propio usuario
    if (req.session.user.role !== 'admin' && req.session.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Acceso denegado' })
    }

    const usuario = await User.findById(req.params.id).select('-password')

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json(usuario)
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// PUT /api/users/:id - Actualizar un usuario (solo admin o el propio usuario)
router.put('/:id', async (req, res) => {
  try {
    // Verificar si es admin o el propio usuario
    if (req.session.user.role !== 'admin' && req.session.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Acceso denegado' })
    }

    const usuario = await User.findById(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Si no es admin, no permitir cambiar el rol
    if (req.session.user.role !== 'admin' && req.body.role) {
      delete req.body.role
    }

    // Si se está actualizando la contraseña, hashearla
    if (req.body.password) {
      const salt = await genSalt(10)
      req.body.password = hashSync(req.body.password, salt)
    }

    const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password')

    res.status(200).json(usuarioActualizado)
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors })
    }
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// DELETE /api/users/:id - Eliminar un usuario (solo admin)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// POST /api/users/change-role/:id - Cambiar rol de usuario (solo admin)
router.post('/change-role/:id', isAdmin, async (req, res) => {
  try {
    const { role } = req.body

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' })
    }

    const usuario = await User.findById(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    usuario.role = role
    await usuario.save()

    res.status(200).json({ message: 'Rol actualizado correctamente', user: { ...usuario._doc, password: undefined } })
  } catch (error) {
    console.error('Error al cambiar rol:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

export default router
