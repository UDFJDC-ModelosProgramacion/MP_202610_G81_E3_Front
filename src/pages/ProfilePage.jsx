import React, { useState } from 'react';
import '../css/ProfilePage.css'; 

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    nombre: "Julian David Campos Alvarado",
    telefono: "3101234567",
    direccion: "Bogotá, D.C.",
    correo: "julian.campos@estudiante.udistrital.edu.co"
  });

  return (
    <div className="profile-admin-container">
      <header className="profile-header">
        <h1>Mi Perfil de Usuario</h1>
        <p>Gestiona tu información personal y seguridad de cuenta.</p>
      </header>
      
      <div className="profile-cards-grid">
        
        {/* Tarjeta de Información Personal */}
        <div className="profile-card">
          <div className="profile-icon">👤</div>
          <h3>Datos Personales</h3>
          <div className="profile-info-list">
            <div className="info-item">
              <span>Nombre:</span>
              <input type="text" value={profile.nombre} disabled className="input-read-only" />
            </div>
            <div className="info-item">
              <span>Teléfono:</span>
              <input 
                type="text" 
                value={profile.telefono} 
                onChange={(e) => setProfile({...profile, telefono: e.target.value})}
              />
            </div>
          </div>
          <button className="btn-registro">Actualizar Datos</button>
        </div>

        {/* Tarjeta de Seguridad (Siguiendo el patrón de la imagen) */}
        <div className="profile-card card-blue-border">
          <div className="profile-icon">🔒</div>
          <h3>Seguridad</h3>
          <p>Mantén tu cuenta protegida cambiando tu contraseña periódicamente.</p>
          <button className="btn-login">Cambiar Contraseña</button>
        </div>

        {/* Tarjeta de Ubicación */}
        <div className="profile-card">
          <div className="profile-icon">📍</div>
          <h3>Ubicación</h3>
          <div className="info-item">
            <span>Dirección:</span>
            <input 
              type="text" 
              value={profile.direccion} 
              onChange={(e) => setProfile({...profile, direccion: e.target.value})}
            />
          </div>
          <button className="btn-registro">Guardar Dirección</button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;