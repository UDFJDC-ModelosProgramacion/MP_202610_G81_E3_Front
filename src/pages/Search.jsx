import React, { useState, useEffect } from 'react';
import ShelterCard from '../components/ShelterCard';
import SearchFilter from '../components/SearchFilter';
import { petService } from '../services/petService';
import '../css/Search.css';

function Search() {
  const [tipoBusqueda, setTipoBusqueda] = useState('Refugio');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [refugioSeleccionado, setRefugioSeleccionado] = useState(null);
  const [baseDatosVacia, setBaseDatosVacia] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState([]);

  // ─── Carga inicial ────────────────────────────────────────────────────────
  const cargarDatosIniciales = async () => {
    setCargando(true);
    try {
      let data;

      if (tipoBusqueda === 'Mascota') {
        data = await petService.obtenerTodas();
      } else {
        const response = await fetch('http://localhost:8999/api/shelters');
        if (!response.ok) throw new Error('Error al obtener refugios');
        data = await response.json();
      }

      setResultados(data);
      setBaseDatosVacia(data.length === 0);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setResultados([]);
      setBaseDatosVacia(true);
    } finally {
      setCargando(false);
    }
  };

  // ─── Búsqueda con keyword y/o filtros ────────────────────────────────────
  const ejecutarBusquedaApi = async (keyword, filtros = []) => {
    setCargando(true);
    try {
      let data;

      if (tipoBusqueda === 'Mascota') {
        const tieneKeyword = keyword.trim() !== '';
        const tieneFiltros = filtros.length > 0;

        if (tieneKeyword && tieneFiltros) {
          data = await petService.buscar(keyword, filtros);
        } else if (tieneKeyword) {
          data = await petService.buscarPorNombre(keyword);
        } else if (tieneFiltros) {
          data = await petService.buscarPorFiltros(filtros);
        } else {
          data = await petService.obtenerTodas();
        }
      } else {
        const response = await fetch(
          `http://localhost:8999/api/shelters/search?keyword=${keyword}`
        );
        if (!response.ok) throw new Error('Error al buscar refugios');
        data = await response.json();
      }

      setResultados(data);
      setBaseDatosVacia(data.length === 0);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

  // ─── Effect principal ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!textoBusqueda.trim() && filtrosAplicados.length === 0) {
      cargarDatosIniciales();
      return;
    }

    const temporizador = setTimeout(() => {
      ejecutarBusquedaApi(textoBusqueda, filtrosAplicados);
    }, 300);

    return () => clearTimeout(temporizador);
  }, [textoBusqueda, tipoBusqueda, filtrosAplicados]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleFiltrosChange = (query, { filters }) => {
    setFiltrosAplicados(filters);
    if (query) setTextoBusqueda(query);
  };

  const handleTipoBusqueda = (e) => {
    setTipoBusqueda(e.target.value);
    setFiltrosAplicados([]);
    setTextoBusqueda('');
  };

  // ─── Resultados (reutilizable en ambos layouts) ───────────────────────────
  const renderResultados = () => (
    <>
      {cargando && (
        <div className="loading-spinner">Cargando...</div>
      )}

      {!cargando && resultados.length > 0 && (
        <div className="shelter-grid">
          {resultados.map((item) => (
            <ShelterCard
              key={item.id}
              refugio={item}
              onVerMas={() => setRefugioSeleccionado(item)}
            />
          ))}
        </div>
      )}

      {!cargando && baseDatosVacia && textoBusqueda.trim() === '' && filtrosAplicados.length === 0 && (
        <div className="empty-state">
          <h3>No hay {tipoBusqueda.toLowerCase()}s registrados</h3>
        </div>
      )}

      {!cargando && resultados.length === 0 && (textoBusqueda.trim() !== '' || filtrosAplicados.length > 0) && (
        <div className="no-results">
          <p>No se encontraron resultados para <strong>"{textoBusqueda}"</strong></p>
        </div>
      )}
    </>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="search-page-container">

      <div className="search-hero-section">
        <h1 className="search-main-title">Sección de búsqueda</h1>

        <div className="search-controls-card">
          <div className="search-input-group">
            <select
              className="search-type-select"
              value={tipoBusqueda}
              onChange={handleTipoBusqueda}
            >
              <option value="Refugio">Refugios</option>
              <option value="Mascota">Mascotas</option>
            </select>

            <div className="search-field-wrapper">
              <input
                type="text"
                placeholder={`Buscar ${tipoBusqueda.toLowerCase()}...`}
                className="search-main-input"
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="search-results-container">
        {tipoBusqueda === 'Mascota' ? (
          // Layout dos columnas: filtros + resultados
          <div className="search-layout-with-filter">
            <div className="search-filter-sidebar">
              <SearchFilter onSearch={handleFiltrosChange} />
            </div>
            <div className="search-results-main">
              {renderResultados()}
            </div>
          </div>
        ) : (
          // Layout normal para refugios
          renderResultados()
        )}
      </div>

      {/* Modal de detalle */}
      {refugioSeleccionado && (
        <div className="modal-overlay" onClick={() => setRefugioSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setRefugioSeleccionado(null)}>
              &times;
            </button>

            <div className="modal-header">
              <h2>{refugioSeleccionado.name}</h2>
              <span className="location-badge-modal">{refugioSeleccionado.city}</span>
            </div>

            <div className="modal-body">
              <p><strong>📧 Correo:</strong> {refugioSeleccionado.email}</p>
              <p><strong>📍 Dirección:</strong> {refugioSeleccionado.address || 'No registrada'}</p>
              <hr />
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setRefugioSeleccionado(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;