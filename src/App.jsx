import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap.
import React from 'react'; // Importa la biblioteca principal de React.
import { Routes, Route, Link, Navigate } from 'react-router-dom'; // Importa los componentes para enrutamiento.
import Registro from './Registro'; // Importa el componente de registro.
import Ingreso from './Ingreso'; // Importa el componente de inicio de sesión.
import Home from './Home'; // Importa el componente de la página principal.
import Editar from './Editar'; // Importa el componente de edición.
import ContactList from './ContactList'; // Importa el componente de lista de contactos públicos.

function App() {
  const isAuthenticated = () => { // Función para verificar la autenticación.
    const userId = localStorage.getItem('id'); // Obtiene el ID del usuario desde localStorage.
    console.log('Usuario autenticado:', userId); // Muestra el ID del usuario en la consola.
    return userId !== null; // Retorna true si el ID no es null.
  };

  const handleLogout = () => { // Función para manejar el cierre de sesión.
    localStorage.removeItem('usuario'); // Elimina el nombre de usuario de localStorage.
    localStorage.removeItem('correo'); // Elimina el correo electrónico de localStorage.
    localStorage.removeItem('id'); // Elimina el ID del usuario de localStorage.
    window.location.reload(); // Recarga la página.
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top"> {/* Navbar de Bootstrap */}
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"> {/* Enlace a la página principal */}
            <i className="bi bi-person-lines-fill"></i> Agenda {/* Icono y texto */}
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/registro" className="btn btn-primary me-2"> {/* Enlace al registro */}
                  Registrar
                </Link>
              </li>
              <li className="nav-item">
                {!isAuthenticated() ? ( // Si no está autenticado
                  <Link to="/ingreso" className="btn btn-secondary"> {/* Enlace al inicio de sesión */}
                    Ingresar
                  </Link>
                ) : (
                  <button className="btn btn-secondary" onClick={handleLogout}> {/* Botón de cerrar sesión */}
                    Cerrar Sesión
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center min-vh-100"> {/* Contenedor principal */}
        <Routes> {/* Definición de rutas */}
          <Route path="/registro" element={isAuthenticated() ? <Navigate to="/home" /> : <Registro />} /> {/* Ruta para el registro */}
          <Route path="/ingreso" element={isAuthenticated() ? <Navigate to="/home" /> : <Ingreso />} /> {/* Ruta para el inicio de sesión */}
          <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/ingreso" />} /> {/* Ruta para la página principal */}
          <Route path="/editar" element={isAuthenticated() ? <Editar /> : <Navigate to="/ingreso" />} /> {/* Ruta para la edición */}
          <Route path="/contactos-publicos" element={<ContactList />} /> {/* Ruta para contactos públicos */}
          <Route path="/" element={<ContactList />} /> {/* Ruta raíz */}
        </Routes>
      </div>
    </>
  );
}

export default App; // Exporta el componente App.
