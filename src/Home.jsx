import React, { useEffect, useState } from 'react'; // Importa React y hooks useEffect y useState
import { useNavigate, Link } from 'react-router-dom'; // Importa useNavigate y Link para navegación
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP
import Swal from 'sweetalert2'; // Importa Swal para mostrar alertas

function Home() {
  const navigate = useNavigate(); // Hook para navegación programática
  const [misContactos, setMisContactos] = useState([]); // Estado para contactos del usuario
  const [contactosPublicos, setContactosPublicos] = useState([]); // Estado para contactos públicos
  const [selectedContact, setSelectedContact] = useState(null); // Estado para el contacto seleccionado para editar
  const [formData, setFormData] = useState({
    apellido: '',
    nombre: '',
    empresa: '',
    domicilio: '',
    telefonos: '',
    email: '',
    esPublico: false,
    contrasenia: '',
  }); // Estado para los datos del formulario
  const [creatingContact, setCreatingContact] = useState(true); // Estado para determinar si estamos creando o editando un contacto

  const handleLogout = () => {
    localStorage.removeItem('usuario'); // Elimina el usuario del localStorage
    localStorage.removeItem('correo'); // Elimina el correo del localStorage
    localStorage.removeItem('id'); // Elimina el id del localStorage
    navigate('/ingreso'); // Navega a la página de ingreso
  };

  const userId = localStorage.getItem('id'); // Obtiene el id del usuario del localStorage
  const usuario = localStorage.getItem('usuario'); // Obtiene el usuario del localStorage
  const correo = localStorage.getItem('correo'); // Obtiene el correo del localStorage

  useEffect(() => {
    if (!usuario || !correo) {
      navigate('/ingreso'); // Si no hay usuario o correo, redirige a ingreso
    } else {
      fetchContactos(); // Si hay usuario y correo, llama a la función para obtener contactos
    }
  }, [usuario, correo, navigate]); // Dependencias: usuario, correo, navigate

  const fetchContactos = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${userId}/contactos`); // Obtiene los contactos del servidor
      const userContacts = response.data.filter(contacto => contacto.propietario === usuario); // Filtra los contactos del usuario
      const publicContacts = response.data.filter(contacto => contacto.esPublico && contacto.propietario !== usuario); // Filtra contactos públicos que no son del usuario

      const uniqueUserContacts = Array.from(new Set(userContacts.map(c => c.email))).map(email => {
        return userContacts.find(c => c.email === email); // Obtiene contactos únicos por email
      });

      setMisContactos(uniqueUserContacts); // Actualiza el estado con los contactos del usuario
      setContactosPublicos(publicContacts); // Actualiza el estado con los contactos públicos
    } catch (error) {
      console.error('Error al obtener contactos', error); // Manejo de errores
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      await axios.post(`http://localhost:3000/user/${userId}/contact`, formData); // Envía los datos del formulario al servidor
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Contacto creado con éxito.', // Muestra una alerta de éxito
      });
      fetchContactos(); // Vuelve a obtener los contactos actualizados
      resetForm(); // Resetea el formulario
    } catch (error) {
      console.error('Error al crear contacto', error); // Manejo de errores
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el contacto.', // Muestra una alerta de error
      });
    }
  };

  const handleEdit = (contacto) => {
    setSelectedContact(contacto); // Establece el contacto seleccionado para editar
    setFormData({
      apellido: contacto.apellido,
      nombre: contacto.nombre,
      empresa: contacto.empresa,
      domicilio: contacto.domicilio,
      telefonos: contacto.telefonos,
      email: contacto.email,
      esPublico: contacto.esPublico,
      contrasenia: contacto.contrasenia,
    }); // Llena el formulario con los datos del contacto seleccionado
    setCreatingContact(false); // Cambia el estado a edición
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      await axios.put(`http://localhost:3000/user/${userId}/contact/${selectedContact._id}`, formData); // Envía los datos actualizados al servidor
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Contacto actualizado con éxito.', // Muestra una alerta de éxito
      });
      fetchContactos(); // Vuelve a obtener los contactos actualizados
      resetForm(); // Resetea el formulario
      setSelectedContact(null); // Limpia el contacto seleccionado
    } catch (error) {
      console.error('Error al actualizar contacto', error); // Manejo de errores
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el contacto.', // Muestra una alerta de error
      });
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`http://localhost:3000/user/${userId}/contact/${contactId}`); // Elimina el contacto del servidor
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Contacto eliminado con éxito.', // Muestra una alerta de éxito
      });
      fetchContactos(); // Vuelve a obtener los contactos actualizados
    } catch (error) {
      console.error('Error al eliminar contacto', error); // Manejo de errores
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el contacto.', // Muestra una alerta de error
      });
    }
  };

  const handleTogglePublico = async (contacto) => {
    try {
      await axios.put(`http://localhost:3000/user/${userId}/contact/${contacto._id}`, {
        ...contacto,
        esPublico: !contacto.esPublico,
      }); // Cambia el estado de público/privado del contacto
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Contacto ${contacto.esPublico ? 'cambiado a privado' : 'cambiado a público'} con éxito.`, // Muestra una alerta de éxito
      });
      fetchContactos(); // Vuelve a obtener los contactos actualizados
    } catch (error) {
      console.error('Error al cambiar el estado del contacto', error); // Manejo de errores
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado del contacto.', // Muestra una alerta de error
      });
    }
  };

  const resetForm = () => {
    setFormData({
      apellido: '',
      nombre: '',
      empresa: '',
      domicilio: '',
      telefonos: '',
      email: '',
      esPublico: false,
      contrasenia: '',
    }); // Resetea los datos del formulario
    setCreatingContact(true); // Cambia el estado a creación de contacto
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home"><i className="bi bi-person-lines-fill"></i> Agenda </Link> {/* Enlace al home */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className="btn btn-primary mx-2" onClick={() => navigate('/editar')}>@{usuario}</button> {/* Botón para editar perfil */}
              </li>
              <li className="nav-item">
                <button className="btn btn-danger mx-2" onClick={handleLogout}>Salir</button> {/* Botón para cerrar sesión */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5 pt-5">
        <div className="row">
          <div className="col-md-3">
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="text-center mb-4">{creatingContact ? 'Crear Contacto' : 'Editar Contacto'}</h2> {/* Título dinámico */}
                <form onSubmit={creatingContact ? handleSubmit : handleUpdate}> {/* Formulario para crear o editar contacto */}
                  <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} // Actualiza apellido
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} // Actualiza nombre
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Empresa</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} // Actualiza empresa
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Domicilio</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.domicilio}
                      onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })} // Actualiza domicilio
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfonos</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.telefonos}
                      onChange={(e) => setFormData({ ...formData, telefonos: e.target.value })} // Actualiza teléfonos
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Actualiza email
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.esPublico}
                      onChange={(e) => setFormData({ ...formData, esPublico: e.target.checked })} // Actualiza estado público
                    />
                    <label className="form-check-label">Público</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.contrasenia}
                      onChange={(e) => setFormData({ ...formData, contrasenia: e.target.value })} // Actualiza contraseña
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">{creatingContact ? 'Crear Contacto' : 'Actualizar Contacto'}</button> {/* Botón de enviar */}
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <h2>Mis Contactos</h2>
            <div className="row">
              {misContactos.map((contacto) => (
                <div key={contacto._id} className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{contacto.apellido} {contacto.nombre}</h5>
                      <p className="card-text">Empresa: {contacto.empresa}</p>
                      <p className="card-text">Domicilio: {contacto.domicilio}</p>
                      <p className="card-text">Teléfonos: {contacto.telefonos}</p>
                      <p className="card-text">Email: {contacto.email}</p>
                      <button className="btn btn-warning mx-1" onClick={() => handleEdit(contacto)}>Editar</button> {/* Botón para editar */}
                      <button className="btn btn-danger mx-1" onClick={() => handleDelete(contacto._id)}>Eliminar</button> {/* Botón para eliminar */}
                      <button className={`btn ${contacto.esPublico ? 'btn-secondary' : 'btn-success'} mx-1`} onClick={() => handleTogglePublico(contacto)}>
                        {contacto.esPublico ? 'Hacer Privado' : 'Hacer Público'}
                      </button> {/* Botón para cambiar el estado público */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h2>Contactos Públicos</h2>
            <div className="row">
              {contactosPublicos.map((contacto) => (
                <div key={contacto._id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{contacto.apellido} {contacto.nombre}</h5>
                      <p className="card-text">Empresa: {contacto.empresa}</p>
                      <p className="card-text">Domicilio: {contacto.domicilio}</p>
                      <p className="card-text">Teléfonos: {contacto.telefonos}</p>
                      <p className="card-text">Email: {contacto.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
