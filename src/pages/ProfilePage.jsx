import React, { useState, useEffect } from 'react';
import '../css/ProfilePage.css'; 

const ProfilePage = () => {
  // 1. Ajustamos el estado a los nombres de ClientEntity y AdopterEntity
  const [profile, setProfile] = useState({
    clientName: "Julian David Campos Alvarado",
    clientPhone: "3101234567",
    clientEmail: "julian.campos@estudiante.udistrital.edu.co",
    hasChildren: false,
    hasPets: false
  });

  // 2. Cargar datos del backend al iniciar (HU11)
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      // 1. Pedimos la lista completa
      const response = await fetch('http://localhost:8080/api/adopters');
      if (response.ok) {
        const data = await response.json();
        // 2. Si hay al menos un usuario, lo usamos
        if (data.length > 0) {
          setProfile(data[0]); 
          console.log("Perfil cargado con éxito:", data[0]);
        }
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };
  fetchProfile();
}, []);

  // 3. Función para enviar cambios al AdopterController (PUT)
  const handleUpdate = async () => {
    try {
      const response = await fetch('http://localhost:8080/adopters/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        alert("¡Datos actualizados en la base de datos!");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="profile-admin-container">
      <header className="profile-header">
        <h1>Mi Perfil de Usuario</h1>
        <p>Gestiona tu información personal y seguridad de cuenta.</p>
      </header>
      
      <div className="profile-cards-grid">
        
        {/* Datos Personales - Vinculado a ClientEntity */}
        <div className="profile-card">
          <div className="profile-icon">👤</div>
          <h3>Datos Personales</h3>
          <div className="profile-info-list">
            <div className="info-item">
              <span>Nombre:</span>
              <input 
                type="text" 
                value={profile.clientName} 
                onChange={(e) => setProfile({...profile, clientName: e.target.value})} 
              />
            </div>
            <div className="info-item">
              <span>Teléfono:</span>
              <input 
                type="text" 
                value={profile.clientPhone} 
                onChange={(e) => setProfile({...profile, clientPhone: e.target.value})}
              />
            </div>
            <div className="info-item">
              <span>Email:</span>
              <input 
                type="email" 
                value={profile.clientEmail} 
                disabled className="input-read-only" 
              />
            </div>
          </div>
          <button className="btn-registro" onClick={handleUpdate}>Actualizar Datos</button>
        </div>

        {/* Preferencias de Adoptante - Vinculado a AdopterEntity */}
        <div className="profile-card">
          <div className="profile-icon">🏠</div>
          <h3>Preferencias Hogar</h3>
          <div className="profile-info-list">
            <div className="info-item-check">
              <input 
                type="checkbox" 
                checked={profile.hasChildren} 
                onChange={(e) => setProfile({...profile, hasChildren: e.target.checked})}
              />
              <span>¿Tiene niños en casa?</span>
            </div>
            <div className="info-item-check">
              <input 
                type="checkbox" 
                checked={profile.hasPets} 
                onChange={(e) => setProfile({...profile, hasPets: e.target.checked})}
              />
              <span>¿Tiene otras mascotas?</span>
            </div>
          </div>
          <button className="btn-registro" onClick={handleUpdate}>Guardar Preferencias</button>
        </div>

        {/* Seguridad */}
        <div className="profile-card card-blue-border">
          <div className="profile-icon">🔒</div>
          <h3>Seguridad</h3>
          <p>Mantén tu cuenta protegida cambiando tu contraseña periódicamente.</p>
          <button className="btn-login">Cambiar Contraseña</button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;