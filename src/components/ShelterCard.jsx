import React from 'react';
import '../css/ShelterCard.css';

/*Tarjetas individuales de los refugios.*/
function ShelterCard({ refugio, onVerMas }) {
  const inicial = refugio.name ? refugio.name.charAt(0).toUpperCase() : '?';

  /*Para buscar la imagen.*/
  const getImageUrl = (name) => {
    try {
      return new URL(`../assets/${name}`, import.meta.url).href;
    } catch (error) {
      return null;
    }
  };

  // Procesar foto.
  const fotoUrl = refugio.image ? getImageUrl(refugio.image) : null;

  return (
    <div className="shelter-card">
      
      {/* Foto o avatar. */}
      <div className="card-header-visual">
        {fotoUrl ? (
          <img src={fotoUrl} alt={refugio.name} className="shelter-photo" />
        ) : (
          <div className="avatar-circle">{inicial}</div>
        )}
        
        {/*Para mostrar la ciudad.*/}
        <span className="location-badge">{refugio.city}</span>
      </div>

      <div className="card-body">
        <h3 className="shelter-name-title">{refugio.name}</h3>
        
        {/* Abrir la ventana de detalles. */}
        <div className="card-actions">
          <button className="btn-main" onClick={onVerMas}>
            Más información
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default ShelterCard;