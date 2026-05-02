// Para definir que elementos existen en la pantalla.

// Importacion para que le diga al jsx como se ven los elementos.
import './App.css';

import logoHuella from './assets/huella.png'

// App principal.
function App() {
  return (
    <div className="layout">

      {/*Barra de navegacion.*/}
      <nav className="navbar">

        {/* Hay que modificarlo y poner el logo. */}
        <div className="navbar-logo">
          <img src={logoHuella} alt="Logo Pagina" className= "logo-img"/>
        </div>

        {/* Lista para redirigir a las paginas */}
        <ul className="navbar-links">
          <li>Inicio</li>
          <li>Adoptar</li>
          <li>Refugios</li>
        </ul>
        
        {/* Para los dos de autenticacion */}
        <div className="navbar-auth">
          <button className="btn-registro">Registrarse</button>
          <button className="btn-login">Iniciar Sesión</button>
        </div>
      </nav>

      {/* Contenido de la pagina */}
      <main className="page">
        <h1>Página de registro de mascotas</h1>
      </main>
    </div>
  );
}

export default App;