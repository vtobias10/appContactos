const mongoose = require('mongoose');

// Definición del esquema de Contacto
const contactSchema = new mongoose.Schema({
  apellido: { type: String, required: true }, // Campo obligatorio de tipo String
  nombre: { type: String, required: true },   // Campo obligatorio de tipo String
  empresa: String,                            // Campo opcional de tipo String
  domicilio: String,                          // Campo opcional de tipo String
  telefonos: String,                          // Campo opcional de tipo String
  email: { type: String, required: true },    // Campo obligatorio de tipo String
  propietario: { type: String, required: true }, // Campo obligatorio de tipo String
  esPublico: { type: Boolean, default: false },  // Campo de tipo Boolean con valor por defecto false
  esVisible: { type: Boolean, default: true },   // Campo de tipo Boolean con valor por defecto true
  contrasenia: String,                        // Campo opcional de tipo String
});

// Definición del esquema de Usuario
const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true }, // Campo obligatorio, único, de tipo String
  correo: { type: String, required: true, unique: true },  // Campo obligatorio, único, de tipo String
  contrasenia: { type: String, required: true },           // Campo obligatorio de tipo String
  contactos: [contactSchema],                              // Campo de tipo Array que contiene esquemas de Contacto
});

// Creación del modelo de Usuario basado en el esquema userSchema
const User = mongoose.model('User', userSchema);

module.exports = User; // Exportación del modelo para usarlo en otras partes del proyecto
