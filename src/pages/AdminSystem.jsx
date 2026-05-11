import { useNavigate } from 'react-router-dom';
import '../css/AdminSystem.css';

function AdminSystem() {
  const navigate = useNavigate();
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Administración general de Refugios y Mascotas</h1>
        <p>Panel interno para la gestión de refugios.</p>
      </header>

      <section className="options-grid">
        {/* Opción Shelter */}
        <div className="menu-card card-refugio">
          <div className="card-icon">🏠</div>
          <h3>Gestion de Refugios</h3>
          <button
            className="btn-action" 
            onClick={() => navigate('/refugios')}
           >
            Gestionar
          </button> 
        </div>

        {/* Opción Pets */}
        <div className="menu-card card-mascota">
          <div className="card-icon">🐕</div>
          <h3>Gestion de Mascotas</h3>
          <button
            className="btn-action" 
            onClick={() => navigate('/mascotas')}
           >
            Gestionar
          </button> 
        </div>
        
      </section>
    </div>
  );
}

export default AdminSystem;