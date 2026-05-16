import React from 'react';
import '../css/ShelterCard.css';

function ShelterCard({ refugio, onVerMas }) {
  const inicial = refugio.name ? refugio.name.charAt(0).toUpperCase() : '?';

  const resolverImagen = (image) => {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    try {
      return new URL(`../assets/${image}`, import.meta.url).href;
    } catch {
      return null;
    }
  };

  const fotoUrl = resolverImagen(refugio.image);

  return (
    <div className="shelter-card">

      <div className="card-header-visual">
        {fotoUrl ? (
          <img src={fotoUrl} alt={refugio.name} className="shelter-photo" />
        ) : (
          <div className="avatar-circle">{inicial}</div>
        )}
        <span className="location-badge">{refugio.city}</span>
      </div>

      <div className="card-body">
        <h3 className="shelter-name-title">{refugio.name}</h3>
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