// src/pages/SeleccionarMascota.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { petService } from '../services/petService';
import PetCard from '../components/PetCard';
import '../css/SeleccionarMascota.css';

export default function SeleccionarMascota() {
  const navigate = useNavigate();

  const [mascotas, setMascotas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Carga inicial 
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await petService.obtenerTodas();
        setMascotas(data);
      } catch (err) {
        setError('No se pudieron cargar las mascotas. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // ── Filtrado local por nombre 
  const mascotasFiltradas = mascotas.filter((m) =>
    m.name?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ── Al hacer clic en "Ver detalles" → ir a editar 
  const handleSeleccionar = (mascota) => {
    navigate(`/mascotas/${mascota.id}/editar`);
  };

  // ── Renders de estado 
  if (loading) {
    return (
      <div className="sm-loading">
        <span className="sm-spinner" />
        Cargando mascotas…
      </div>
    );
  }

  if (error) {
    return (
      <div className="sm-page">
        <div className="sm-error">
          <span>⚠</span> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="sm-page">
      {/* Encabezado */}
      <header className="sm-header">
        <div>
          <h1 className="sm-title">Editar mascota</h1>
          <p className="sm-subtitle">
            Selecciona la mascota cuya información deseas actualizar
          </p>
        </div>
      </header>

      {/* Buscador */}
      <div className="sm-search-wrap">
        <span className="sm-search-icon">🔍</span>
        <input
          type="text"
          className="sm-search"
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button className="sm-clear" onClick={() => setBusqueda('')} aria-label="Limpiar">
            ✕
          </button>
        )}
      </div>

      {/* Contador */}
      <p className="sm-count">
        {mascotasFiltradas.length === mascotas.length
          ? `${mascotas.length} mascotas registradas`
          : `${mascotasFiltradas.length} de ${mascotas.length} mascotas`}
      </p>

      {/* Grid de cards */}
      {mascotasFiltradas.length > 0 ? (
        <div className="sm-grid">
          {mascotasFiltradas.map((mascota) => (
            <PetCard
              key={mascota.id}
              mascota={mascota}
              onVerMas={handleSeleccionar}   // ← redirige a /mascotas/:id/editar
            />
          ))}
        </div>
      ) : (
        <div className="sm-empty">
          <span className="sm-empty-icon">🐾</span>
          <p>No se encontraron mascotas con ese nombre.</p>
        </div>
      )}
    </div>
  );
}