import React, { useState } from 'react'; // Importa React y useState para manejar el estado del componente.
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir a otras rutas.
import Swal from 'sweetalert2'; // Importa SweetAlert2 para mostrar alertas.
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP.

const Editar = () => {
  const [usuario, setUsuario] = useState(''); // Estado para almacenar el usuario.
  const [correo, setCorreo] = useState(''); // Estado para almacenar el correo.
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga del componente.
  const navigate = useNavigate(); // Hook para redirigir a otras rutas.
  
  const userId = localStorage.getItem('id'); // Obtiene el ID del usuario desde localStorage.
  const storedUsuario = localStorage.getItem('usuario'); // Obtiene el nombre de usuario desde localStorage.
  const storedCorreo = localStorage.getItem('correo'); // Obtiene el correo desde localStorage.
  
  React.useEffect(() => { // Hook que se ejecuta cuando el componente se monta o cuando cambian las dependencias.
    if (!userId) { // Si no hay ID de usuario en localStorage, redirige al login.
      navigate('/ingreso');
      return;
    }
    
    if (storedUsuario && storedCorreo) { // Si hay usuario y correo almacenados, los establece en el estado.
      setUsuario(storedUsuario);
      setCorreo(storedCorreo);
      setIsLoading(false); // Actualiza el estado para indicar que ya no está cargando.
    }
  }, [navigate, userId, storedUsuario, storedCorreo]); // Dependencias del useEffect.

  const handleSubmit = async (e) => { // Función para manejar el envío del formulario.
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    
    if (!userId) { // Si no hay ID de usuario en localStorage, redirige al login.
      navigate('/ingreso');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/user/${userId}`, { usuario, correo }); // Envía una solicitud PUT para actualizar los datos del usuario.
      localStorage.setItem('usuario', usuario); // Actualiza el usuario en localStorage.
      localStorage.setItem('correo', correo); // Actualiza el correo en localStorage.
      
      Swal.fire({ // Muestra una alerta de éxito.
        icon: 'success',
        title: 'Éxito',
        text: 'Datos actualizados correctamente.',
      });
      navigate('/home'); // Redirige a la página de inicio.
    } catch (error) { // Maneja errores de la solicitud PUT.
      console.error('Error updating user', error); // Muestra el error en la consola.
      Swal.fire({ // Muestra una alerta de error.
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron actualizar los datos.',
      });
    }
  };

  if (isLoading) { // Muestra un mensaje de carga mientras se obtienen los datos.
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100"> {/* Contenedor principal con flexbox y altura mínima. */}
      <nav className="navbar navbar-light bg-light fixed-top"> {/* Barra de navegación fija en la parte superior. */}
        <a className="navbar-brand ms-3" href="#" onClick={() => navigate('/home')}> {/* Botón para volver a la página de inicio. */}
          <i className="bi bi-arrow-left"></i> Volver
        </a>
      </nav>
      
      <div className="container d-flex align-items-center justify-content-center flex-grow-1 mt-5"> {/* Contenedor centrado para el formulario. */}
        <div className="w-100" style={{ maxWidth: '600px' }}> {/* Contenedor del formulario con ancho máximo. */}
          <h1 className="mb-4">Editar Perfil</h1> {/* Título del formulario. */}
          <form onSubmit={handleSubmit}> {/* Formulario con función de manejo de envío. */}
            <div className="mb-3"> {/* Contenedor para el campo de usuario. */}
              <label htmlFor="usuario" className="form-label">Usuario</label> {/* Etiqueta para el campo de usuario. */}
              <input
                id="usuario"
                type="text"
                className="form-control"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)} // Actualiza el estado cuando cambia el valor del input.
              />
            </div>
            <div className="mb-3"> {/* Contenedor para el campo de correo. */}
              <label htmlFor="correo" className="form-label">Correo</label> {/* Etiqueta para el campo de correo. */}
              <input
                id="correo"
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)} // Actualiza el estado cuando cambia el valor del input.
              />
            </div>
            <button type="submit" className="btn btn-primary">Guardar Cambios</button> {/* Botón para enviar el formulario. */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Editar; // Exporta el componente Editar.