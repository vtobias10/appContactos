import React, { useEffect, useState } from 'react'; // Importa React, useEffect y useState.
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP.
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir a otras rutas.
import Swal from 'sweetalert2'; // Importa SweetAlert2 para mostrar alertas.

function PanelAdministrador() {
  const [contactos, setContactos] = useState([]); // Estado para almacenar la lista de contactos.
  const navigate = useNavigate(); // Hook para redirigir a otras rutas.

  useEffect(() => {
    const fetchContactos = async () => { // Función para obtener los contactos del servidor.
      try {
        const response = await axios.get('http://localhost:3000/contactos'); // Solicita la lista de contactos.
        setContactos(response.data); // Actualiza el estado con la lista de contactos obtenida.
      } catch (error) {
        console.error('Error al obtener contactos', error); // Manejo de errores en caso de fallo.
      }
    };

    fetchContactos(); // Llama a la función para obtener los contactos cuando el componente se monta.
  }, []); // El array vacío significa que el efecto se ejecutará solo una vez, similar a componentDidMount.

  const toggleEstado = async (contactoId, esPublicoActual) => { // Función para cambiar el estado de visibilidad de un contacto.
    try {
      const nuevoEstado = !esPublicoActual; // Determina el nuevo estado.
      await axios.put(`http://localhost:3000/contacto/${contactoId}`, { esPublico: nuevoEstado }); // Actualiza el estado en el servidor.
      setContactos(prevContactos => // Actualiza el estado local con el nuevo estado.
        prevContactos.map(contacto =>
          contacto._id === contactoId ? { ...contacto, esPublico: nuevoEstado } : contacto
        )
      );
      Swal.fire({ // Muestra una alerta de éxito.
        icon: 'success',
        title: 'Estado actualizado',
        text: `El contacto ha sido cambiado a ${nuevoEstado ? 'Público' : 'Privado'}`,
      });
    } catch (error) {
      console.error('Error al cambiar el estado del contacto', error); // Manejo de errores en caso de fallo.
      Swal.fire({ // Muestra una alerta de error.
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado del contacto',
      });
    }
  };

  const handleLogout = () => { // Función para manejar el cierre de sesión.
    navigate('/ingreso-administrador'); // Redirige al usuario a la página de inicio de sesión del administrador.
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light fixed-top"> {/* Barra de navegación fija en la parte superior. */}
        <div className="container-fluid">
          <button 
            className="btn btn-danger"
            onClick={handleLogout} // Maneja el cierre de sesión.
          >
            Salir
          </button>
          <span className="mx-auto navbar-brand mb-0 h1">Panel Administrador</span> {/* Título del panel. */}
        </div>
      </nav>

      <div className="container mt-5 pt-5 text-center"> {/* Contenedor principal con márgenes para desplazar hacia abajo el contenido. */}
        <h2>Contactos</h2> {/* Título de la sección. */}
        <div className="row"> {/* Fila para los contactos. */}
          {contactos.map(contacto => ( // Mapea los contactos para crear una tarjeta para cada uno.
            <div className="col-md-4 mb-3" key={contacto.email}> {/* Columna con margen en la parte inferior. */}
              <div className="card" style={{ fontSize: '0.9rem' }}> {/* Tarjeta con estilo de fuente pequeño. */}
                <div className="card-body">
                  <h5 className="card-title">{contacto.apellido} {contacto.nombre} </h5> {/* Nombre del contacto. */}
                  <p className="card-text">Empresa: {contacto.empresa}</p> {/* Información del contacto. */}
                  <p className="card-text">Domicilio: {contacto.domicilio}</p>
                  <p className="card-text">Teléfonos: {contacto.telefonos || 'No disponible'}</p>
                  <p className="card-text">Email: {contacto.email}</p>
                  <p className="card-text">Estado: {contacto.esPublico ? 'Público' : 'Privado'}</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => toggleEstado(contacto._id, contacto.esPublico)} // Cambia el estado del contacto.
                  >
                    Cambiar a {contacto.esPublico ? 'Privado' : 'Público'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PanelAdministrador; // Exporta el componente PanelAdministrador.
