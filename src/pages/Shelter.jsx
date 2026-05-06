import '../css/Shelter.css';

function Shelter() {
  return (
    <div className="shelter-container">
      <header className="shelter-header">
        <h1>Administración de Refugios</h1>
        <p>Panel interno para gestionar refugios.</p>
      </header>

      <section className="shelter-grid">
        {/* Opción Crear */}
        <div className="menu-card card-crear">
          <div className="card-icon">➕</div>
          <h3>Crear Refugio</h3>
          <p>Registrar un nuevo refugio.</p>
          <button className="btn-action">Crear</button>
        </div>

        {/* Opción Editar */}
        <div className="menu-card card-editar">
          <div className="card-icon">✏️</div>
          <h3>Editar Refugio</h3>
          <p>Actualiza datos de contacto del refugio.</p>
          <button className="btn-action">Editar</button>
        </div>

        {/* Opción Eliminar */}
        <div className="menu-card card-eliminar">
          <div className="card-icon">🗑️</div>
          <h3>Eliminar Refugio</h3>
          <p>Eliminar refugios fuera de operación.</p>

          <button className="btn-action btn-eliminar">Eliminar</button>
        </div>
        
      </section>
    </div>
  );
}

export default Shelter;