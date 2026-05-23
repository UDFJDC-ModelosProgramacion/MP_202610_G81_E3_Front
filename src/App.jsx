// Para definir que elementos existen en la pantalla.

// Importacion para que le diga al jsx como se ven los elementos.
import './App.css';

import { BrowserRouter, Routes, Route} from 'react-router-dom';
import TopBar from './components/TopBar';
import Shelter from './pages/Shelter';
import Search from './pages/Search';
import MessagesPage from "./pages/MessagesPage.jsx";
import AdoptionForm from './components/AdoptionForm';
import ProfilePage from './pages/ProfilePage';
import MedicalEvents from './pages/MedicalEvents';
import AdminSystem from './pages/AdminSystem';
import Pet from './pages/Pet';
import AddPet from './pages/AddPet';
import GestionAdopciones from './pages/GestionAdopciones';
import RegistroDevolucion from './pages/RegistroDevolucion';
import EditShelter from './pages/EditShelter.jsx';
import ActualizarMascota from './pages/ActualizarMascota.jsx';

// Para mostrar en el incio.
function Home() {
  return (
    <div className="home-container">
      {/* Bloque Principal de Bienvenida */}
      <section className="home-hero">
        <div className="hero-content">
          <h1>Sistema de Registro y Adopción de Mascotas</h1>
          <p className="hero-subtitle">
            Una plataforma diseñada  la gestión de refugios,
            mascotas y adopciones, que ayuda a que las personas consigan sus 
            mascotas ideales y lleven un seguimiento.
          </p>
        </div>
      </section>

      {/* Información del Sistema */}
      <section className="home-info-section">
        <h2 className="section-title">¿Qué hace nuestra plataforma?</h2>
        
        <div className="info-features-grid">
          <div className="info-feature-card">
            <div className="info-icon">🐱</div>
            <h3>Control de Mascotas</h3>
            <p>
              Lleva un segumiento de las nuevas mascotas registradas, asi
              como los procesos de adopcion de cada mascota.
            </p>
          </div>

          <div className="info-feature-card">
            <div className="info-icon">🩺</div>
            <h3>Seguimiento médico</h3>
            <p>
              Posee un apartado para el control de vacunas y registros
              médicos asociados  la mascota, con el fin de llevar
              un seguimiento.
            </p>
          </div>

          <div className="info-feature-card">
            <div className="info-icon">🐶</div>
            <h3>Facilidad de busqueda</h3>
            <p>
              Tiene un apartado de búsqueda para que encuentres
              la mascota que más se adapte a tus necesidades, con la
              información que necesitas para tomar una decisión.
            </p>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="home-metrics-section">
        <div className="metrics-wrapper">
          <div className="metric-item">
            <h4>+1000</h4>
            <p>Mascotas con nuevos hogares</p>
          </div>
          <div className="metric-item">
            <h4>96%</h4>
            <p>Satisfacción de clientes</p>
          </div>
          <div className="metric-item">
            <h4>+100</h4>
            <p>Refugios registrados</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// App principal.
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <TopBar/>
        </header>

          <main className="content">
          <Routes>
            {/* Ruta para el Inicio */}
            <Route path="/" element={<Home />} />

            {/* Ruta para la pagina de Refugios */}
            <Route path="/refugios" element={<Shelter />} />

            {/*Ruta para la pagina de busqueda*/}
            <Route path="/buscar" element={<Search />} />

            {/*Ruta para la pagina de mensajes*/}
            <Route path="/messages" element={<MessagesPage />} />

            {/*Ruta para la página de adopcion*/}
            <Route path="/adoptar" element={<AdoptionForm />} />

            {/* Ruta para la página de perfil */}
            <Route path="/perfil" element={<ProfilePage />} />

            {/* Ruta para la página de historial médico */}
            <Route path="/historial-medico" element={<MedicalEvents />} />

            {/* Ruta para la página de gestion */}
            <Route path="/gestion" element={<AdminSystem />} />

            {/* Ruta para la página de mascotas */}
            <Route path="/mascotas" element={<Pet />} />

            {/* Ruta para la página de agregar mascotas */}
            <Route path="/agregarmascotas" element={<AddPet />} />

            <Route path="/gestion-adopciones" element={<GestionAdopciones />} />

            <Route path="/devolucion" element={<RegistroDevolucion />} />

            <Route path="/actualizar-mascota" element={<ActualizarMascota />} />

            {/*Ruta para editar datos del refugio*/}
            <Route path="/editar_refugio" element={<EditShelter />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;