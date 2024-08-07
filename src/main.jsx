import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap.
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa los íconos de Bootstrap.
import React from 'react'; // Importa la biblioteca principal de React.
import { createRoot } from 'react-dom/client'; // Importa la función para renderizar la aplicación en el DOM.
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importa los componentes para el enrutamiento.
import App from './App'; // Importa el componente principal de la aplicación.
import Registro from './Registro'; // Importa el componente de registro de usuarios.
import Ingreso from './Ingreso'; // Importa el componente de inicio de sesión de usuarios.
import Home from './Home'; // Importa el componente de la página principal después de iniciar sesión.
import Editar from './Editar'; // Importa el componente para editar la información del usuario.
import IngresoAdministrador from './IngresoAdministrador'; // Importa el componente de inicio de sesión para administradores.
import PanelAdministrador from './PanelAdministrador'; // Importa el componente para el panel administrativo.

createRoot(document.getElementById('root')).render( // Encuentra el elemento con ID 'root' y renderiza la aplicación.
  <React.StrictMode> // Envuélvelo en React.StrictMode para advertencias adicionales en desarrollo.
    <BrowserRouter> // Envuélvelo en BrowserRouter para habilitar el enrutamiento basado en el navegador.
      <Routes> // Define el contenedor para las rutas.
        <Route path="/" element={<App />} /> // Ruta raíz, renderiza el componente App.
        <Route path="/registro" element={<Registro />} /> // Ruta '/registro', renderiza el componente Registro.
        <Route path="/ingreso" element={<Ingreso />} /> // Ruta '/ingreso', renderiza el componente Ingreso.
        <Route path="/home" element={<Home />} /> // Ruta '/home', renderiza el componente Home.
        <Route path="/editar" element={<Editar />} /> // Ruta '/editar', renderiza el componente Editar.
        <Route path="/ingreso-administrador" element={<IngresoAdministrador />} /> // Ruta '/ingreso-administrador', renderiza el componente IngresoAdministrador.
        <Route path="/panel-administrador" element={<PanelAdministrador />} /> // Ruta '/panel-administrador', renderiza el componente PanelAdministrador.
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
