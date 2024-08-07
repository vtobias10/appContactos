const express = require('express'); // Importa el módulo express para crear la aplicación del servidor.
const cors = require('cors'); // Importa el módulo cors para habilitar solicitudes de origen cruzado.
const mongoose = require('mongoose'); // Importa el módulo mongoose para interactuar con MongoDB.
const bodyParser = require('body-parser'); // Importa el módulo body-parser para analizar el cuerpo de las solicitudes.
const User = require('./models/User'); // Importa el modelo User para manejar los datos de los usuarios en la base de datos.

const app = express(); // Crea una instancia de la aplicación express.
const port = 3000; // Define el puerto en el que la aplicación escuchará las solicitudes.

app.use(cors()); // Habilita CORS para permitir solicitudes de otros dominios.
app.use(bodyParser.json()); // Configura body-parser para que analice el cuerpo de las solicitudes en formato JSON.

mongoose.connect('mongodb://localhost:27017/finalLab', { // Conecta a la base de datos MongoDB.
  useNewUrlParser: true, // Usa el nuevo analizador de URL de MongoDB.
  useUnifiedTopology: true, // Usa la nueva topología unificada de MongoDB.
})
.then(() => { // Si la conexión se establece correctamente:
  console.log('Connected to MongoDB'); // Imprime en la consola que la conexión a MongoDB fue exitosa.
})
.catch((error) => { // Si ocurre un error al conectar:
  console.error('Error connecting to MongoDB', error); // Imprime en la consola el error.
  process.exit(1); // Sale del proceso con un código de error.
});

app.post('/register', async (req, res) => { // Ruta para registrar un nuevo usuario.
  const { usuario, correo, contrasenia } = req.body; // Extrae el nombre de usuario, correo y contraseña del cuerpo de la solicitud.
  
  try {
    const existingUser = await User.findOne({ $or: [{ usuario }, { correo }] }); // Busca si ya existe un usuario con el mismo nombre o correo.
    if (existingUser) {
      return res.status(409).json({ message: 'Usuario y/o correo ya registrado' }); // Devuelve un error si el usuario o correo ya están registrados.
    }

    const newUser = new User({ usuario, correo, contrasenia }); // Crea un nuevo objeto User con los datos proporcionados.
    await newUser.save(); // Guarda el nuevo usuario en la base de datos.
    res.status(201).send('Usuario registrado con éxito'); // Devuelve una respuesta de éxito al cliente.
  } catch (error) {
    console.error('Error al registrar el usuario', error); // Imprime el error en la consola si ocurre.
    res.status(500).send('Error al registrar el usuario'); // Devuelve un error interno del servidor.
  }
});

app.post('/login', async (req, res) => { // Ruta para autenticar un usuario.
  const { usuarioCorreo, contrasenia } = req.body; // Extrae el nombre de usuario o correo y la contraseña del cuerpo de la solicitud.

  try {
    const user = await User.findOne({
      $or: [{ usuario: usuarioCorreo }, { correo: usuarioCorreo }], // Busca un usuario por nombre o correo.
      contrasenia: contrasenia, // Coincide con la contraseña.
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' }); // Devuelve un error si el usuario o contraseña son incorrectos.
    }

    res.status(200).json({
      usuario: user.usuario, // Devuelve el nombre de usuario.
      correo: user.correo, // Devuelve el correo electrónico.
      _id: user._id, // Devuelve el ID del usuario.
    });
  } catch (error) {
    console.error('Error al autenticar usuario', error); // Imprime el error en la consola si ocurre.
    res.status(500).send('Error al autenticar usuario'); // Devuelve un error interno del servidor.
  }
});

app.put('/user/:id', async (req, res) => { // Ruta para actualizar los datos de un usuario.
  const { id } = req.params; // Extrae el ID del usuario de los parámetros de la ruta.
  const { usuario, correo } = req.body; // Extrae el nuevo nombre de usuario y correo del cuerpo de la solicitud.

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { usuario, correo }, { new: true }); // Actualiza el usuario por su ID y devuelve el usuario actualizado.

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve un error si el usuario no se encuentra.
    }

    res.status(200).json(updatedUser); // Devuelve el usuario actualizado.
  } catch (error) {
    console.error('Error al actualizar usuario', error); // Imprime el error en la consola si ocurre.
    res.status(500).send('Error al actualizar usuario'); // Devuelve un error interno del servidor.
  }
});

app.post('/user/:id/contact', async (req, res) => { // Ruta para agregar un nuevo contacto a un usuario.
  const { id } = req.params; // Extrae el ID del usuario de los parámetros de la ruta.
  const newContact = req.body; // Extrae los datos del nuevo contacto del cuerpo de la solicitud.

  try {
    const user = await User.findById(id); // Busca al usuario por su ID.
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve un error si el usuario no se encuentra.
    }

    newContact.propietario = user.usuario; // Asigna el nombre de usuario al contacto como propietario.
    user.contactos.push(newContact); // Agrega el nuevo contacto al array de contactos del usuario.
    await user.save(); // Guarda el usuario con el nuevo contacto en la base de datos.

    res.status(201).json({ message: 'Contacto creado con éxito' }); // Devuelve una respuesta de éxito al cliente.
  } catch (error) {
    console.error('Error al crear contacto', error); // Imprime el error en la consola si ocurre.
    res.status(500).send('Error al crear contacto'); // Devuelve un error interno del servidor.
  }
});

app.get('/user/:id/contactos', async (req, res) => { // Ruta para obtener todos los contactos de un usuario.
  const { id } = req.params; // Extrae el ID del usuario de los parámetros de la ruta.

  try {
    const user = await User.findById(id); // Busca al usuario por su ID.
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve un error si el usuario no se encuentra.
    }

    const publicContacts = await User.aggregate([ // Realiza una agregación para obtener contactos públicos y visibles.
      { $unwind: '$contactos' }, // Descompone el array de contactos en documentos individuales.
      { $match: { 'contactos.esPublico': true, 'contactos.esVisible': true } }, // Filtra los contactos públicos y visibles.
      { $replaceRoot: { newRoot: '$contactos' } } // Reemplaza el documento raíz con el contacto.
    ]);

    const userContacts = user.contactos.filter(contact => contact.esVisible); // Filtra los contactos visibles del usuario.

    res.status(200).json([...userContacts, ...publicContacts]); // Devuelve la combinación de contactos del usuario y contactos públicos.
  } catch (error) {
    console.error('Error al obtener contactos', error); // Imprime el error en la consola si ocurre.
    res.status(500).send('Error al obtener contactos'); // Devuelve un error interno del servidor.
  }
});

app.put('/user/:userId/contact/:contactId', async (req, res) => { // Ruta para actualizar un contacto específico de un usuario.
  const { userId, contactId } = req.params; // Extrae los IDs del usuario y del contacto de los parámetros de la ruta.
  const updatedData = req.body; // Extrae los datos actualizados del cuerpo de la solicitud.

  try {
    const user = await User.findById(userId); // Busca al usuario por su ID.
    if (!user) {
      return res.status(404).send('Usuario no encontrado'); // Devuelve un error si el usuario no se encuentra.
    }

    const contactIndex = user.contactos.findIndex(contact => contact._id.toString() === contactId); // Encuentra el índice del contacto en el array.
    if (contactIndex === -1) {
      return res.status(404).send('Contacto no encontrado'); // Devuelve un error si el contacto no se encuentra.
    }

    user.contactos[contactIndex] = { ...user.contactos[contactIndex]._doc, ...updatedData }; // Actualiza los datos del contacto.
    await user.save(); // Guarda el usuario con el contacto actualizado en la base de datos.

    res.status(200).json(user.contactos[contactIndex]); // Devuelve el contacto actualizado.
  } catch (error) {
    console.error('Error al actualizar contacto:', error); // Imprime el error en la consola si ocurre.
    res.status(500).send('Error interno del servidor'); // Devuelve un error interno del servidor.
  }
});

app.delete('/user/:userId/contact/:contactId', async (req, res) => { // Ruta para eliminar un contacto específico de un usuario.
  const { userId, contactId } = req.params; // Extrae los IDs del usuario y del contacto de los parámetros de la ruta.

  try {
    const user = await User.findById(userId); // Busca al usuario por su ID.
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve un error si el usuario no se encuentra.
    }

    user.contactos = user.contactos.filter(c => c._id.toString() !== contactId); // Filtra los contactos para eliminar el contacto con el ID especificado.
    await user.save(); // Guarda el usuario con el contacto eliminado en la base de datos.

    res.status(200).json({ message: 'Contacto eliminado con éxito' }); // Devuelve una respuesta de éxito al cliente.
  } catch (error) {
    console.error('Error al eliminar contacto', error); // Imprime el error en la consola si ocurre.
    res.status(500).send('Error al eliminar contacto'); // Devuelve un error interno del servidor.
  }
});

app.get('/contactos', async (req, res) => { // Ruta para obtener todos los contactos de todos los usuarios.
  try {
    const users = await User.find().select('contactos'); // Busca todos los usuarios y selecciona solo el campo de contactos.
    const contactos = users.flatMap(user => user.contactos); // Combina todos los contactos de todos los usuarios en un solo array.
    res.json(contactos); // Devuelve todos los contactos.
  } catch (error) {
    console.error('Error al obtener contactos:', error); // Imprime el error en la consola si ocurre.
    res.status(500).send('Error al obtener contactos'); // Devuelve un error interno del servidor.
  }
});

app.put('/contacto/:id', async (req, res) => { // Ruta para actualizar un contacto específico por su ID.
  const { id } = req.params; // Extrae el ID del contacto de los parámetros de la ruta.
  const { esPublico } = req.body; // Extrae el estado de visibilidad del cuerpo de la solicitud.

  try {
    const user = await User.findOne({ "contactos._id": id }); // Busca un usuario que tenga un contacto con el ID especificado.
    if (!user) return res.status(404).send('Contacto no encontrado'); // Devuelve un error si no se encuentra el contacto.

    const contacto = user.contactos.id(id); // Busca el contacto en el array de contactos del usuario.
    contacto.esPublico = esPublico; // Actualiza el estado de visibilidad del contacto.
    await user.save(); // Guarda el usuario con el contacto actualizado en la base de datos.

    res.send('Contacto actualizado'); // Devuelve una respuesta de éxito al cliente.
  } catch (error) {
    res.status(500).send('Error al actualizar el contacto'); // Devuelve un error interno del servidor si ocurre un problema.
  }
});

app.listen(port, () => { // Inicia el servidor en el puerto definido.
  console.log(`Server is running on http://localhost:${port}`); // Imprime en la consola que el servidor está corriendo.
});
