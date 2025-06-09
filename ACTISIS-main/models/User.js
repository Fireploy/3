import { Schema, model } from 'mongoose'
import { genSalt, compare, hashSync } from 'bcryptjs'

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'docente'],
    default: 'user'
  }
})

// Encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await genSalt(10)
  this.password = await hashSync(this.password, salt)
})

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password)
}

export default model('User', userSchema)
