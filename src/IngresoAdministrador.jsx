import React, { useState } from 'react'; // Importa React y useState.
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir a otras rutas.
import Swal from 'sweetalert2'; // Importa SweetAlert2 para mostrar alertas.

const IngresoAdministrador = () => {
  const [user, setUser] = useState(''); // Estado para almacenar el nombre de usuario.
  const [password, setPassword] = useState(''); // Estado para almacenar la contraseña.
  const navigate = useNavigate(); // Hook para redirigir a otras rutas.

  const handleLogin = async (e) => { // Función para manejar el envío del formulario de inicio de sesión.
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.

    if (user === 'admin' && password === 'admin') { // Verifica las credenciales.
      navigate('/panel-administrador'); // Redirige al panel de administrador si las credenciales son correctas.
    } else { // Si las credenciales son incorrectas.
      Swal.fire({ // Muestra una alerta de error.
        icon: 'error',
        title: 'Error',
        text: 'Usuario o contraseña incorrectos',
      });
    }
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light fixed-top"> {/* Barra de navegación fija en la parte superior. */}
        <div className="container-fluid">
          <a 
            className="btn btn-primary me-2" 
            href="#" 
            onClick={() => navigate('/ingreso')} // Redirige al ingreso de usuario al hacer clic.
          >
            Ingresar como usuario
          </a>
        </div>
      </nav>

      <div className="d-flex justify-content-center align-items-center vh-100"> {/* Contenedor centrado para el formulario. */}
        <div className="card" style={{ width: '100%', maxWidth: '500px' }}> {/* Tarjeta con ancho máximo. */}
          <div className="card-body">
            <h5 className="card-title">Ingreso Administrador</h5> {/* Título del formulario. */}
            <form onSubmit={handleLogin}> {/* Formulario con función de manejo de envío. */}
              <div className="mb-3"> {/* Contenedor para el campo de usuario. */}
                <label htmlFor="user" className="form-label">Usuario</label> {/* Etiqueta para el campo de usuario. */}
                <input
                  type="text"
                  id="user"
                  className="form-control"
                  value={user}
                  onChange={(e) => setUser(e.target.value)} // Actualiza el estado cuando cambia el valor del input.
                  required
                />
              </div>
              <div className="mb-3"> {/* Contenedor para el campo de contraseña. */}
                <label htmlFor="password" className="form-label">Contraseña</label> {/* Etiqueta para el campo de contraseña. */}
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Actualiza el estado cuando cambia el valor del input.
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Ingresar</button> {/* Botón para enviar el formulario. */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default IngresoAdministrador; // Exporta el componente IngresoAdministrador.
