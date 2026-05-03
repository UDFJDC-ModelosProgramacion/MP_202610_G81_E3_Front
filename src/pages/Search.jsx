import React, { useState, useEffect } from 'react';
import ShelterCard from '../components/ShelterCard';
import '../css/Search.css';

/*Para a barra de búsqueda principal, en donde se pueden buscar mascotas y refugios.*/
function Search() {
  // Definición, en donde se determina si se busca refugio o mascota.
  const [tipoBusqueda, setTipoBusqueda] = useState('Refugio');

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [refugioSeleccionado, setRefugioSeleccionado] = useState(null);
  // Para identificar si no hay nada registrado.
  const [baseDatosVacia, setBaseDatosVacia] = useState(false);

  /*Configuracion con el backend*/

  /*Carga todos los datos registrados*/
  const cargarDatosIniciales = async () => {
    setCargando(true);
    try {
      const endpoint = tipoBusqueda === 'Refugio' ? 'shelters' : 'pets';
      const response = await fetch(`http://localhost:8999/api/${endpoint}`);
      const data = await response.json();
      
      setResultados(data);
      
      setBaseDatosVacia(data.length === 0);

    } catch (error) {
      console.error("Error cargando datos:", error);
      setResultados([]);
      setBaseDatosVacia(true);
    } finally {
      setCargando(false);
    }
  };

  /*Ejecucion de busqueda a través del backend.*/
  const ejecutarBusquedaApi = async (keyword) => {
    setCargando(true);
    try {
      const endpoint = tipoBusqueda === 'Refugio' ? 'shelters' : 'pets';
      const response = await fetch(`http://localhost:8999/api/${endpoint}/search?keyword=${keyword}`);
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // Para cargar todos los dato si no hay algo escrito.
    if (!textoBusqueda.trim()) {
      cargarDatosIniciales();
      return;
    }

    // Temporizador para la búsqueda.
    const temporizador = setTimeout(() => {
      ejecutarBusquedaApi(textoBusqueda);
    }, 300);
    return () => clearTimeout(temporizador);
  }, [textoBusqueda, tipoBusqueda]);

  // Parte de interfaz.

  return (
    <div className="search-page-container">
      
      <div className="search-hero-section">
        <h1 className="search-main-title">Sección de búsqueda</h1>
        
        <div className="search-controls-card">
          <div className="search-input-group">
            {/* Selector para refugio o mascota*/}
            <select 
              className="search-type-select" 
              value={tipoBusqueda} 
              onChange={(e) => setTipoBusqueda(e.target.value)}
            >
              <option value="Refugio">Refugios</option>
              <option value="Mascota">Mascotas</option>
            </select>

            {/* Input de texto para la búsqueda */}
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
        
        {/* Mensaje de carga. */}
        {cargando && <div className="loading-spinner">Cargando...</div>}
        
        {/*Se muetran correctamente los resultados arrojados en la busqueda*/}
        {!cargando && resultados.length > 0 && (
          <div className="shelter-grid">
            {resultados.map((item) => (
              <ShelterCard 
                key={item.id} 
                refugio={item} 
                // Para clic en la tarjeta.
                onVerMas={() => setRefugioSeleccionado(item)} 
              />
            ))}
          </div>
        )}

        {/* No se encuentran registrados refugios ni mascotas. */}
        {!cargando && baseDatosVacia && textoBusqueda.trim() === "" && (
          <div className="empty-state">
            <h3>No hay {tipoBusqueda.toLowerCase()}s registrados</h3>
          </div>
        )}

        {/*Hay registros pero no los buscados por el usuario.*/}
        {!cargando && resultados.length === 0 && textoBusqueda.trim() !== "" && (
          <div className="no-results">
            <p>No se encontraron resultados para "<strong>{textoBusqueda}</strong>"</p>
          </div>
        )}
      </div>

      {/*Ventana de datos adicionales de los refugios.*/}
      {refugioSeleccionado && (
        <div className="modal-overlay" onClick={() => setRefugioSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setRefugioSeleccionado(null)}>&times;</button>
            
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
              <button className="btn-secondary" onClick={() => setRefugioSeleccionado(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;