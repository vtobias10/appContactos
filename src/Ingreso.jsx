import React, { useEffect, useState } from 'react'; // Importa React, useEffect y useState.
import Swal from 'sweetalert2'; // Importa SweetAlert2 para mostrar alertas.
import { Link, useNavigate } from 'react-router-dom'; // Importa Link y useNavigate para manejar rutas.

function Ingreso() {
  const [usuarioCorreo, setUsuarioCorreo] = useState(''); // Estado para almacenar el usuario o correo.
  const [contrasenia, setContrasenia] = useState(''); // Estado para almacenar la contraseña.
  const navigate = useNavigate(); // Hook para redirigir a otras rutas.

  const isAuthenticated = () => { // Función para verificar si el usuario está autenticado.
    const userId = localStorage.getItem('id'); // Obtiene el ID del usuario desde localStorage.
    return userId !== null; // Retorna verdadero si el ID existe, indicando que el usuario está autenticado.
  };

  useEffect(() => { // Hook que se ejecuta cuando el componente se monta o cuando cambia la función navigate.
    if (isAuthenticated()) { // Si el usuario está autenticado, redirige a la página de inicio.
      navigate('/home');
    }
  }, [navigate]); // Dependencias del useEffect.

  const handleSubmit = async (e) => { // Función para manejar el envío del formulario.
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.

    try {
      const response = await fetch('http://localhost:3000/login', { // Envía una solicitud POST al servidor.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Establece el tipo de contenido como JSON.
        },
        body: JSON.stringify({ usuarioCorreo, contrasenia }), // Convierte los datos del formulario a JSON.
      });

      if (response.ok) { // Si la respuesta es exitosa (código de estado 2xx).
        const data = await response.json(); // Obtiene los datos de la respuesta en formato JSON.
        localStorage.setItem('usuario', data.usuario); // Almacena el usuario en localStorage.
        localStorage.setItem('correo', data.correo); // Almacena el correo en localStorage.
        localStorage.setItem('id', data._id); // Almacena el ID del usuario en localStorage.
        navigate('/home'); // Redirige a la página de inicio.
      } else {
        const errorData = await response.json(); // Obtiene los datos de error de la respuesta en formato JSON.
        Swal.fire({ // Muestra una alerta de error.
          icon: 'error',
          title: 'Error',
          text: errorData.message,
        });
      }
    } catch (error) { // Maneja errores de la solicitud.
      console.error('Error al iniciar sesión', error); // Muestra el error en la consola.
      Swal.fire({ // Muestra una alerta de error si no se pudo conectar al servidor.
        icon: 'error',
        title: 'Error',
        text: 'No se pudo conectar al servidor.',
      });
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top"> {/* Barra de navegación fija en la parte superior. */}
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"><i className="bi bi-person-lines-fill"></i> Agenda </Link> {/* Enlace a la página de inicio. */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/registro" className="btn btn-primary me-2">Registrar</Link> {/* Enlace para registrarse. */}
              </li>
              <li className="nav-item">
                <Link to="/ingreso" className="btn btn-secondary">Ingresar</Link> {/* Enlace para ingresar. */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="d-flex vh-100 justify-content-center align-items-center"> {/* Contenedor centrado para el formulario. */}
        <div className="w-100" style={{ maxWidth: '400px' }}> {/* Contenedor del formulario con ancho máximo. */}
          <h2 className="text-center">Ingreso</h2> {/* Título del formulario. */}
          <form onSubmit={handleSubmit}> {/* Formulario con función de manejo de envío. */}
            <div className="mb-3"> {/* Contenedor para el campo de usuario o correo. */}
              <label className="form-label">Usuario o Correo</label> {/* Etiqueta para el campo de usuario o correo. */}
              <input
                type="text"
                className="form-control"
                value={usuarioCorreo}
                onChange={(e) => setUsuarioCorreo(e.target.value)} // Actualiza el estado cuando cambia el valor del input.
                required
                autoComplete="off"
              />
            </div>
            <div className="mb-3"> {/* Contenedor para el campo de contraseña. */}
              <label className="form-label">Contraseña</label> {/* Etiqueta para el campo de contraseña. */}
              <input
                type="password"
                className="form-control"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)} // Actualiza el estado cuando cambia el valor del input.
                required
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Ingresar</button> {/* Botón para enviar el formulario. */}
          </form>
        </div>
      </div>
    </>
  );
}

export default Ingreso; // Exporta el componente Ingreso.
