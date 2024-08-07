import React, { useEffect, useState } from 'react'; // Importa React, useEffect y useState.
import Swal from 'sweetalert2'; // Importa SweetAlert2 para mostrar alertas.
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP.
import { Link, useNavigate } from 'react-router-dom'; // Importa Link y useNavigate para la navegación entre rutas.

function Registro() {
  const navigate = useNavigate(); // Hook para redirigir a otras rutas.

  const isAuthenticated = () => { // Función para verificar si el usuario ya está autenticado.
    const userId = localStorage.getItem('id'); // Obtiene el ID del usuario del localStorage.
    return userId !== null; // Devuelve true si el ID existe, false si no.
  };

  useEffect(() => {
    if (isAuthenticated()) { // Verifica si el usuario está autenticado al montar el componente.
      navigate('/home'); // Redirige al usuario a la página de inicio si está autenticado.
    }
  }, [navigate]); // El efecto se ejecuta cuando el componente se monta.

  const [formData, setFormData] = useState({ // Estado para almacenar los datos del formulario.
    usuario: '',
    correo: '',
    contrasenia: '',
    confirmarContrasenia: '',
  });

  const handleChange = (e) => { // Función para manejar los cambios en los campos del formulario.
    const { name, value } = e.target; // Obtiene el nombre y valor del campo modificado.
    setFormData({ ...formData, [name]: value }); // Actualiza el estado con el nuevo valor del campo.
  };

  const onSubmit = async (e) => { // Función para manejar el envío del formulario.
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    if (formData.contrasenia !== formData.confirmarContrasenia) { // Verifica si las contraseñas coinciden.
      Swal.fire({ // Muestra una alerta de error si las contraseñas no coinciden.
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
      });
      return; // Sale de la función si las contraseñas no coinciden.
    }

    try {
      const response = await axios.post('http://localhost:3000/register', formData); // Envía los datos del formulario al servidor.
      Swal.fire({ // Muestra una alerta de éxito si el registro es exitoso.
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Usuario registrado con éxito',
        timer: 2000,
        onClose: () => {
          window.location.replace('/'); // Redirige a la página de inicio después de mostrar la alerta.
        },
      });
    } catch (error) {
      if (error.response.status === 409) { // Maneja el error si el usuario ya está registrado.
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar usuario',
          text: error.response.data.message,
        });
      } else {
        console.error('Error al registrar usuario:', error); // Maneja otros errores.
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar el usuario',
        });
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top"> {/* Barra de navegación fija en la parte superior. */}
        <div className="container-fluid">
          <a className="navbar-brand" href="/"><i className="bi bi-person-lines-fill"></i> Agenda </a> {/* Enlace a la página principal. */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/registro" className="btn btn-primary me-2">Registrar</Link> {/* Enlace a la página de registro. */}
              </li>
              <li className="nav-item">
                <Link to="/ingreso" className="btn btn-secondary me-2">Ingresar</Link> {/* Enlace a la página de inicio de sesión. */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="d-flex vh-100 justify-content-center align-items-center"> {/* Contenedor para centrar el formulario vertical y horizontalmente. */}
        <div className="w-100" style={{ maxWidth: '400px' }}> {/* Contenedor para el formulario con un ancho máximo. */}
          <h2 className="text-center">Registro</h2> {/* Título del formulario de registro. */}
          <form onSubmit={onSubmit} autoComplete="off"> {/* Formulario para el registro del usuario. */}
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input type="text" className="form-control" name="usuario" value={formData.usuario} onChange={handleChange} required autoComplete="off" /> {/* Campo para el nombre de usuario. */}
            </div>
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} required autoComplete="off" /> {/* Campo para el correo electrónico. */}
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control" name="contrasenia" value={formData.contrasenia} onChange={handleChange} required autoComplete="off" /> {/* Campo para la contraseña. */}
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Contraseña</label>
              <input type="password" className="form-control" name="confirmarContrasenia" value={formData.confirmarContrasenia} onChange={handleChange} required autoComplete="off" /> {/* Campo para confirmar la contraseña. */}
            </div>
            <button type="submit" className="btn btn-primary w-100">Registrar</button> {/* Botón para enviar el formulario. */}
          </form>
        </div>
      </div>
    </>
  );
}

export default Registro; // Exporta el componente Registro.
