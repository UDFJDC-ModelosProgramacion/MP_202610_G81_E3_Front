import React, { useState, useEffect } from 'react';
import ShelterCard from '../components/ShelterCard';
import PetCard from '../components/PetCard'; 
import SearchFilter from '../components/SearchFilter';
import { petService } from '../services/petService';
import '../css/Search.css';

function Search() {
  const [tipoBusqueda, setTipoBusqueda] = useState('Refugio');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [refugioSeleccionado, setRefugioSeleccionado] = useState(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null); 
  const [baseDatosVacia, setBaseDatosVacia] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState([]);

  const cargarDatosIniciales = async () => {
    setCargando(true);
    try {
      let data;
      if (tipoBusqueda === 'Mascota') {
        data = await petService.obtenerTodas();
      } else {
        const response = await fetch('http://localhost:8080/api/shelters');
        if (!response.ok) throw new Error('Error al obtener refugios');
        data = await response.json();
      }
      setResultados(data || []);
      setBaseDatosVacia(!data || data.length === 0);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setResultados([]);
      setBaseDatosVacia(true);
    } finally {
      setCargando(false);
    }
  };

  const ejecutarBusquedaApi = async (keyword, filtros = []) => {
    setCargando(true);
    try {
      let data;
      if (tipoBusqueda === 'Mascota') {
        const tieneKeyword = keyword.trim() !== '';
        const tieneFiltros = filtros.length > 0;
        if (tieneKeyword && tieneFiltros)  data = await petService.buscar(keyword, filtros);
        else if (tieneKeyword)              data = await petService.buscarPorNombre(keyword);
        else if (tieneFiltros)              data = await petService.buscarPorFiltros(filtros);
        else                                data = await petService.obtenerTodas();
      } else {
        const response = await fetch(
          `http://localhost:8080/api/shelters/search?keyword=${encodeURIComponent(keyword)}`
        );
        if (!response.ok) throw new Error('Error al buscar refugios');
        data = await response.json();
      }
      setResultados(data || []);
      setBaseDatosVacia(!data || data.length === 0);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

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

  const handleFiltrosChange = (query, { filters }) => {
    setFiltrosAplicados(filters);
    if (query !== undefined) setTextoBusqueda(query);
  };

  const handleTipoBusqueda = (e) => {
    setTipoBusqueda(e.target.value);
    setFiltrosAplicados([]);
    setTextoBusqueda('');
    setResultados([]);
    setBaseDatosVacia(false);
    setRefugioSeleccionado(null);
    setMascotaSeleccionada(null);
  };

  const normalizarItem = (item) => {
    let resolvedImage = item.image || "";

    if (item.mediaFiles && item.mediaFiles.length > 0) {
      const photo = item.mediaFiles.find(
        (f) => f.mediaFileType === "PHOTOGRAPH" || f.mediaFileType === "FOTO"
      );
      resolvedImage = photo ? photo.url : item.mediaFiles[0].url;
    }

    if (resolvedImage.startsWith("blob:")) {
      resolvedImage = "";
    }

    return { ...item, image: resolvedImage };
  };

  const renderResultados = () => (
    <>
      {cargando && <div className="loading-spinner">Cargando resultados...</div>}

      {!cargando && resultados.length > 0 && (
        <div className="shelter-grid">
          {resultados.map((item) => {
            const itemNormalizado = normalizarItem(item);
            
            if (tipoBusqueda === 'Mascota') {
              return (
                <PetCard
                  key={itemNormalizado.id}
                  mascota={itemNormalizado}
                  onVerMas={() => setMascotaSeleccionada(itemNormalizado)}
                />
              );
            }

            return (
              <ShelterCard
                key={itemNormalizado.id}
                refugio={itemNormalizado}
                onVerMas={() => setRefugioSeleccionado(itemNormalizado)}
              />
            );
          })}
        </div>
      )}

      {!cargando && baseDatosVacia && textoBusqueda.trim() === '' && filtrosAplicados.length === 0 && (
        <div className="empty-state">
          <h3>No hay {tipoBusqueda.toLowerCase()}s registrados en el sistema</h3>
        </div>
      )}

      {!cargando && resultados.length === 0 && (textoBusqueda.trim() !== '' || filtrosAplicados.length > 0) && (
        <div className="no-results">
          <p>No se encontraron resultados para <strong>"{textoBusqueda}"</strong></p>
        </div>
      )}
    </>
  );
  
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
          <div className="search-layout-with-filter">
            <div className="search-filter-sidebar">
              <SearchFilter onSearch={handleFiltrosChange} />
            </div>
            <div className="search-results-main">{renderResultados()}</div>
          </div>
        ) : (
          renderResultados()
        )}
      </div>

      {/* Para mostrar los detalles del refugio*/}
      {refugioSeleccionado && (
        <div className="modal-overlay" onClick={() => setRefugioSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setRefugioSeleccionado(null)}>&times;</button>
            <div className="modal-header">
              <h2>{refugioSeleccionado.name}</h2>
              <span className="location-badge-modal">{refugioSeleccionado.city || 'Colombia'}</span>
            </div>
            <div className="modal-body">
              {refugioSeleccionado.image && (
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <img
                    src={refugioSeleccionado.image}
                    alt={`Logo de ${refugioSeleccionado.name}`}
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #eee' }}
                  />
                </div>
              )}
              <p><strong>📧 Correo:</strong> {refugioSeleccionado.email}</p>
              <p><strong>📍 Dirección:</strong> {refugioSeleccionado.address || 'No registrada'}</p>
              <hr />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setRefugioSeleccionado(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Para mostrar los detalles de la mascota*/}
      {mascotaSeleccionada && (
        <div className="modal-overlay" onClick={() => setMascotaSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setMascotaSeleccionada(null)}>&times;</button>
            
            <div className="modal-header">
              <h2>{mascotaSeleccionada.name}</h2>
              <span className="location-badge-modal">{mascotaSeleccionada.species || 'Mascota'}</span>
            </div>
            
            <div className="modal-body">
              {mascotaSeleccionada.image && (
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <img
                    src={mascotaSeleccionada.image}
                    alt={`Foto de ${mascotaSeleccionada.name}`}
                    style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                </div>
              )}
              
              <div className="modal-pet-details-grid">
                <p><strong>🧬 Raza:</strong> {mascotaSeleccionada.breed || 'Mestizo'}</p>
                <p><strong>⚧ Sexo:</strong> {mascotaSeleccionada.sex}</p>
                <p><strong>🎂 Edad:</strong> {mascotaSeleccionada.age} {mascotaSeleccionada.age === 1 ? 'año' : 'años'}</p>
                <p><strong>📏 Tamaño:</strong> {mascotaSeleccionada.size}</p>
                
                <p className="full-row"><strong>📅 Ingreso:</strong> {mascotaSeleccionada.arriveToShelterDate || 'No definida'}</p>
                <p className="full-row"><strong>🧠 Temperamento:</strong> {mascotaSeleccionada.temperament || 'No definido'}</p>
                <p className="full-row"><strong>🏠 Refugio:</strong> {mascotaSeleccionada.shelterName || 'Asociado'}</p>
                <p className="full-row"><strong>🌲 Espacio requerido:</strong> {mascotaSeleccionada.requiredSpace || 'Asociado'}</p>
                
                {mascotaSeleccionada.specificRequirements && (
                  <div className="requirements-box">
                    <strong>⚠️ Requerimientos específicos:</strong>
                    <p style={{ margin: '5px 0 0 0' }}>{mascotaSeleccionada.specificRequirements}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setMascotaSeleccionada(null)}>Volver a la búsqueda</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;