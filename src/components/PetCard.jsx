import React from 'react';

function PetCard({ mascota, onVerMas }) {

  // Imagen por defecto.
  const defaultImage = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500&auto=format&fit=crop";
  
  let fotoReal = mascota.image || "";
  if (mascota.mediaFiles && mascota.mediaFiles.length > 0) {
    const archivoFoto = mascota.mediaFiles.find(
      (f) => f.mediaFileType === "PHOTOGRAPH" || f.mediaFileType === "FOTO"
    );
    fotoReal = archivoFoto ? archivoFoto.url : mascota.mediaFiles[0].url;
  }
  const finalImage = fotoReal && !fotoReal.startsWith("blob:") ? fotoReal : defaultImage;

  const nombreRefugio = mascota.shelterName || 
                        (mascota.shelter && mascota.shelter.name) || 
                        (mascota.shelterEntity && mascota.shelterEntity.name) || 
                        'Refugio Asociado';
  return (
    <div className="shelter-card">
      <div className="card-header-visual">
        <img 
          src={finalImage} 
          alt={`Foto de ${mascota.name}`} 
          className="shelter-photo"
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <span className={`location-badge species-${mascota.species?.toLowerCase() || 'desconocido'}`}>
          {mascota.species || 'Mascota'}
        </span>
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="card-body">
        <h3 className="shelter-name-title">{mascota.name}</h3>
        
        <div className="pet-details-box">
          <p className="pet-info-line"><strong>Raza:</strong> {mascota.breed || 'Mestizo'}</p>
          
          <div className="pet-badge-row">
            <span className="pet-mini-badge">🎂 {mascota.age} {mascota.age === 1 ? 'año' : 'años'}</span>
            <span className="pet-mini-badge">⚧ {mascota.sex}</span>
          </div>
          
          <p className="pet-info-line text-muted">🏠 {nombreRefugio}</p>
        </div>
        
        <button className="btn-main" onClick={() => onVerMas(mascota)}>
          Ver detalles
        </button>
      </div>
    </div>
  );
}

export default PetCard;