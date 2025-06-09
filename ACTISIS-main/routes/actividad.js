import express from 'express'
import Actividad from '../models/Actividad.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Configuración de multer para guardar en disco
const storageDir = path.join(path.resolve(), 'public', 'uploads', 'evidencias')

// Asegurarse de que el directorio de subida exista
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir) // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    // Generar un nombre de archivo único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const router = express.Router()

// POST /api/actividades - Crear una nueva actividad
router.post('/', upload.single('evidencia'), async (req, res) => {
  console.log('Datos recibidos (después de multer):', req.body);
  console.log('Archivo (después de multer):', req.file); // El archivo estará en req.file

  // Extraer datos del body
  const {
    nombre,
    fechaInicio,
    fechaFin,
    lugar,
    tipo,
    movilidad,
    semestre,
    tematica,
    descripcion,
    responsable
  } = req.body

  // Procesar archivos si existen
  let evidenciaUrl = '';
  
  if (req.file) {
    // req.file.path es la ruta absoluta al archivo guardado por multer
    // Necesitamos la ruta relativa desde la carpeta 'public'
    evidenciaUrl = path.join('uploads', 'evidencias', req.file.filename);
    console.log('Archivo guardado en:', req.file.path);
    console.log('Evidencia URL para DB:', evidenciaUrl);
  } else if (req.body.evidenciaBase64) { // Mantener lógica para base64 si aún es necesaria
    // Si se envió como base64 en el formulario
    evidenciaUrl = 'archivo_base64_' + Date.now() + '.png';
    console.log('Archivo en base64 detectado');
    // Aquí se procesaría la imagen en base64
  }
  
  // Corregido: Acceder correctamente al userId del usuario en sesión
  const creadoPor = req.session.user.userId

  // Validación básica (Mongoose también valida según el schema)
  if (!nombre || !fechaInicio || !fechaFin || !tipo || !semestre || !responsable) {
    return res.status(400).json({ message: 'Faltan campos obligatorios: nombre, fechas, tipo, semestre, responsable' })
  }

  try {
    const nuevaActividad = new Actividad({
      nombre,
      fechaInicio,
      fechaFin,
      lugar: lugar || 'No especificado',
      tipo,
      movilidad: movilidad || 'No aplica',
      semestre,
      tematica: tematica || '',
      descripcion: descripcion || '',
      responsable,
      evidenciaUrl: evidenciaUrl || '',
      creadoPor
    })

    const actividadGuardada = await nuevaActividad.save()

    res.status(201).json(actividadGuardada) // Devuelve la actividad creada
  } catch (error) {
    console.error('Error al crear actividad:', error)
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors })
    }
    res.status(500).json({ message: 'Error interno del servidor al guardar la actividad' })
  }
})

// GET /api/actividades - Obtener todas las actividades
router.get('/', async (req, res) => {
  try {
    const { tipo, semestre, responsable, fechaDesde, fechaHasta } = req.query

    // Construir filtro dinámicamente
    const filtro = {}

    if (tipo) filtro.tipo = tipo
    if (semestre) filtro.semestre = semestre
    if (responsable) filtro.responsable = { $regex: responsable, $options: 'i' }

    // Filtro de fechas
    if (fechaDesde || fechaHasta) {
      filtro.fechaInicio = {}
      if (fechaDesde) filtro.fechaInicio.$gte = new Date(fechaDesde)
      if (fechaHasta) filtro.fechaInicio.$lte = new Date(fechaHasta)
    }

    const actividades = await Actividad.find(filtro).populate('creadoPor', 'name email').sort({ fechaInicio: -1 })

    res.status(200).json(actividades)
  } catch (error) {
    console.error('Error al obtener actividades:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// GET /api/actividades/encurso - Obtener actividades en curso
router.get('/encurso', async (req, res) => {
  try {
    const hoy = new Date()
    // Asegurarse de que la fecha actual se compara correctamente con las fechas en la base de datos
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

// GET /api/actividades/proximas - Obtener actividades próximas
router.get('/proximas', async (req, res) => {
  try {
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

// GET /api/actividades/:id - Obtener una actividad por ID
router.get('/:id', async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id).populate('creadoPor', 'name email')

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' })
    }

    res.status(200).json(actividad)
  } catch (error) {
    console.error('Error al obtener actividad:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// PUT /api/actividades/:id - Actualizar una actividad
router.put('/:id', async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id)

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' })
    }

    // Verificar si el usuario actual es el creador o es admin
    // Esta verificación se puede mejorar con un middleware de autorización

    const actividadActualizada = await Actividad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json(actividadActualizada)
  } catch (error) {
    console.error('Error al actualizar actividad:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors })
    }
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// DELETE /api/actividades/:id - Eliminar una actividad
router.delete('/:id', async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id)

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' })
    }

    // Verificar si el usuario actual es el creador o es admin
    // Esta verificación se puede mejorar con un middleware de autorización

    await Actividad.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Actividad eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar actividad:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

export default router
