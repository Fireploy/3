import { Schema, model } from 'mongoose'

const actividadSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la actividad es obligatorio'],
    trim: true
  },
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  fechaFin: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  lugar: {
    type: String,
    trim: true
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de actividad es obligatorio'],
    enum: ['Docencia', 'Investigación', 'Extensión']
  },
  movilidad: {
    type: String,
    enum: ['No aplica', 'Entrante', 'Saliente']
  },
  semestre: {
    type: String,
    required: [true, 'El semestre es obligatorio'],
    enum: ['1', '2']
  },
  tematica: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  responsable: {
    type: String, // Podría ser un ObjectId referenciando al modelo User más adelante
    trim: true,
    required: [true, 'El responsable es obligatorio']
  },
  evidenciaUrl: { // Campo para guardar la URL si subes archivos a almacenamiento externo
    type: String,
    trim: true
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
})

export default model('Actividad', actividadSchema)
