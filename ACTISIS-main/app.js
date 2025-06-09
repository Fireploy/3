import express from 'express'
import authRoutes from './routes/auth.js'
import actividadRoutes from './routes/actividad.js'
import userRoutes from './routes/user.js' // Nueva importación para rutas de usuario
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'

// --- Configuración para obtener __dirname en ES Modules ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// --- Fin Configuración __dirname ---

const app = express()

// --- Configuración ---
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views')) // Asegura que Express encuentre las vistas

// --- Middlewares ---
app.use(express.json()) // Para parsear JSON bodies
app.use(express.urlencoded({ extended: true })) // Para parsear URL-encoded bodies

// Aumentar el límite de tamaño para permitir subidas de archivos más grandes
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser())

// Middleware para servir archivos estáticos (CSS, JS cliente, imágenes)
app.use(express.static(path.join(__dirname, 'public')))

// Middleware para verificar token y cargar datos de usuario en req.session
// NOTA: Este middleware se ejecuta para TODAS las rutas que vienen después.
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null } // Inicializa req.session en cada request

  if (token) {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET)
      // Guarda la información esencial del usuario en la sesión
      req.session.user = { userId: data.userId, email: data.email, role: data.role }
    } catch (err) {
      console.error('Token inválido o expirado:', err.message)
      // Limpia la cookie si el token no es válido para evitar problemas
      res.clearCookie('access_token')
    }
  }
  next() // Continúa al siguiente middleware o ruta
})

// Middleware para proteger rutas que requieren autenticación
function ensureAuthenticated (req, res, next) {
  if (req.session.user) {
    // Si hay un usuario en la sesión (verificado por el middleware anterior), permite el paso
    return next()
  }
  // Si no hay usuario, redirige a la página de login
  res.redirect('/login')
}

// Middleware para proteger rutas que requieren rol de administrador
function ensureAdmin (req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next()
  }
  // Si no es admin, redirige a dashboard o muestra error
  res.status(403).render('error', {
    message: 'Acceso denegado',
    error: { status: 403, stack: 'No tienes permisos para acceder a esta página' },
    user: req.session.user
  })
}

// --- Rutas API ---
// Rutas públicas (o que manejan su propia lógica de auth/registro)
app.use('/api/auth', authRoutes)

// Rutas públicas para actividades en curso y próximas
app.get('/api/actividades/encurso', async (req, res) => {
  try {
    const Actividad = (await import('./models/Actividad.js')).default
    const hoy = new Date()
    const actividadesEnCurso = await Actividad.find({
      fechaInicio: { $lte: hoy },
      fechaFin: { $gte: hoy }
    })
      .populate('creadoPor', 'name email')
      .sort({ fechaInicio: -1 })

    console.log(`Actividades en curso encontradas: ${actividadesEnCurso.length}`)
    res.status(200).json(actividadesEnCurso)
  } catch (error) {
    console.error('Error al obtener actividades en curso:', error)
    res.status(500).json({ message: 'Error interno del servidor', error: error.message })
  }
})

app.get('/api/actividades/proximas', async (req, res) => {
  try {
    const Actividad = (await import('./models/Actividad.js')).default
    const hoy = new Date()
    const enUnMes = new Date()
    enUnMes.setMonth(enUnMes.getMonth() + 1)

    const actividadesProximas = await Actividad.find({
      fechaInicio: { $gt: hoy, $lt: enUnMes }
    })
      .populate('creadoPor', 'name email')
      .sort({ fechaInicio: 1 })
      .limit(10)

    console.log(`Próximas actividades encontradas: ${actividadesProximas.length}`)
    res.status(200).json(actividadesProximas)
  } catch (error) {
    console.error('Error al obtener actividades próximas:', error)
    res.status(500).json({ message: 'Error interno del servidor', error: error.message })
  }
})

// Ruta pública para obtener usuarios disponibles como responsables (admins y docentes)
app.get('/api/users/available', async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default
    // Buscar usuarios con rol admin o docente
    const usuarios = await User.find({ role: { $in: ['admin', 'docente'] } }).select('name email role')
    res.status(200).json(usuarios)
  } catch (error) {
    console.error('Error al obtener usuarios disponibles:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Resto de rutas de actividades protegidas
app.use('/api/actividades', ensureAuthenticated, actividadRoutes)

// Rutas de administración de usuarios (solo admin)
app.use('/api/users', ensureAuthenticated, userRoutes)

// --- Rutas de Vistas (Frontend) ---
// Página de inicio pública
app.get('/', (req, res) => {
  res.render('landing', { user: req.session.user, title: 'ACTISIS - Inicio' })
})

// Rutas públicas
app.get('/login', (req, res) => {
  // Si ya está logueado, no debería ver el login, redirigir a dashboard
  if (req.session.user) return res.redirect('/dashboard')
  res.render('login', { message: null })
})

app.get('/register', (req, res) => {
  // Si ya está logueado, no debería ver el register
  if (req.session.user) return res.redirect('/dashboard')
  res.render('register', { message: null })
})

// Ruta de Logout
app.get('/logout', (req, res) => {
  res.clearCookie('access_token')
  req.session.user = null // Destruye la sesión del lado del servidor también
  res.redirect('/') // Redirigir a la landing page en lugar de login
})

// --- Rutas de Vistas Protegidas ---
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { data: req.session.user, title: 'Dashboard - ACTISIS' })
})

app.get('/registro_actividad', ensureAuthenticated, (req, res) => {
  res.render('registro_actividad', { data: req.session.user, title: 'Registro Actividad - ACTISIS' })
})

// Nueva ruta para consultar actividades
app.get('/consultar_actividades', ensureAuthenticated, (req, res) => {
  res.render('consultar_actividades', { data: req.session.user, title: 'Consultar Actividades - ACTISIS' })
})

// Nueva ruta para ver detalles de una actividad
app.get('/actividad/:id', ensureAuthenticated, (req, res) => {
  res.render('detalle_actividad', {
    data: req.session.user,
    id: req.params.id,
    title: 'Detalle de Actividad - ACTISIS'
  })
})

// Nueva ruta para gestionar usuarios (solo admin)
app.get('/gestionar_usuarios', ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render('gestionar_usuarios', { data: req.session.user, title: 'Gestionar Usuarios - ACTISIS' })
})

// Nueva ruta para generar reportes
app.get('/generar_reporte', ensureAuthenticated, (req, res) => {
  res.render('generar_reporte', { data: req.session.user, title: 'Generar Reporte - ACTISIS' })
})

// Ruta para ver y editar perfil de usuario
app.get('/mi_perfil', ensureAuthenticated, async (req, res) => {
  try {
    // Importar modelo de User dinámicamente
    const User = (await import('./models/User.js')).default
    // Obtener datos completos del usuario desde la base de datos
    const usuario = await User.findById(req.session.user.userId).select('-password')
    if (!usuario) {
      return res.status(404).render('error', {
        message: 'Usuario no encontrado',
        error: { status: 404, stack: 'No se encontró el usuario en la base de datos' },
        user: req.session.user
      })
    }
    // Combinar datos de la sesión con los datos completos del usuario
    const userData = {
      userId: req.session.user.userId,
      email: usuario.email,
      role: usuario.role,
      name: usuario.name
    }
    res.render('mi_perfil', { data: userData, title: 'Mi Perfil - ACTISIS' })
  } catch (error) {
    console.error('Error al obtener datos del perfil:', error)
    res.status(500).render('error', {
      message: 'Error al cargar el perfil',
      error: { status: 500, stack: process.env.NODE_ENV === 'development' ? error.stack : '' },
      user: req.session.user
    })
  }
})

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).render('error', {
    message: 'Página no encontrada',
    error: { status: 404, stack: 'La página que buscas no existe' },
    user: req.session.user
  })
})

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render('error', {
    message: 'Error interno del servidor',
    error: { status: 500, stack: process.env.NODE_ENV === 'development' ? err.stack : '' },
    user: req.session.user
  })
})

export default app
