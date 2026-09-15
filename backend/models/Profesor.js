const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contrasena: { type: String, required: true },      // se guarda cifrada, nunca en texto plano
  area: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profesor', profesorSchema);