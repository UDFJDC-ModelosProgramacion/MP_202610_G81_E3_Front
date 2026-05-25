import { useNavigate } from 'react-router-dom';
import '../css/Pet.css';

function Pet() {
  const navigate = useNavigate();
  return (
    <div className="pet-container">
      <header className="pet-header">
        <h1>Administración de Mascotas</h1>
        <p>Panel de gestion de mascotas.</p>
      </header>

      <section className="pet-grid">
        {/* Opción Crear */}
        <div className="menu-card card-crear">
          <div className="card-icon">➕</div>
          <h3>Crear Mascotas</h3>
          <p>Registrar una nueva mascota.</p>
          <button
            className="btn-action" 
            onClick={() => navigate('/agregarmascotas')}
           >
            Crear
          </button> 
        </div>

        {/* Opción Editar */}
        <div className="menu-card card-editar">
          <div className="card-icon">✏️</div>
          <h3>Editar Detalles de Mascotas</h3>
          <p>Actualiza datos de cada mascota.</p>
          <button className="btn-action"onClick={() => navigate('/mascotas/editar')}>Editar</button>
        </div>

        {/* Opción Eliminar */}
        <div className="menu-card card-eliminar">
          <div className="card-icon">🗑️</div>
          <h3>Eliminar Mascotas</h3>
          <p>Eliminar mascotas.</p>

          <button className="btn-action btn-eliminar">Eliminar</button>
        </div>
        
      </section>
    </div>
  );
}

export default Pet;