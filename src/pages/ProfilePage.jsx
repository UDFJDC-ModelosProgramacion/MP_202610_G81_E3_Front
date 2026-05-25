import React, { useState, useEffect } from 'react';
import '../css/ProfilePage.css'; 

const ProfilePage = () => {
  // 1. Estado inicial con los campos mapeados a tus entidades
  const [profile, setProfile] = useState({
    id: null,
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    hasChildren: false,
    hasPets: false
  });

  const [loading, setLoading] = useState(true);

  // Recuperamos el ID real que guardó el Login en el localStorage
  const loggedInId = localStorage.getItem('clientId');

  // 2. Cargar los datos específicos de TU usuario al iniciar o rescatar desde clientes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!loggedInId) {
        console.error("No se encontró ningún clientId en el localStorage. Inicia sesión primero.");
        setLoading(false);
        return;
      }

      try {
        // 1. Intentamos traerlo de la tabla de adoptantes primero
        const adopterResponse = await fetch(`http://localhost:8080/api/adopters/${loggedInId}`);
        
        if (adopterResponse.ok) {
          const adopterData = await adopterResponse.json();
          setProfile(adopterData); 
          console.log("Perfil del adoptante cargado con éxito:", adopterData);
        } else if (adopterResponse.status === 404) {
          // 2. Al dar 404, rescatamos los datos desde la lista de clientes
          console.log("El usuario no tiene perfil de adoptante aún. Buscando datos en clientes...");
          const clientResponse = await fetch(`http://localhost:8080/api/clients`);
          
          if (clientResponse.ok) {
            const clientsList = await clientResponse.json();
            
            // Buscamos en la lista el cliente que coincida con tu email de estudiante
            const myClient = clientsList.find(c => c.clientEmail === "julian.campos@estudiante.udistrital.edu.co");
            
            if (myClient) {
              setProfile({
                id: myClient.id || loggedInId,
                clientName: myClient.clientName,
                clientPhone: myClient.clientPhone,
                clientEmail: myClient.clientEmail,
                hasChildren: false,
                hasPets: false
              });
              console.log("Datos base del cliente cargados exitosamente.");
            } else {
              console.error("No se encontró tu usuario específico en la lista de clientes.");
            }
          } else {
            console.error("Error al consultar la lista general de clientes.");
          }
        }
      } catch (error) {
        console.error("Error conectando con el servidor al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [loggedInId]);

  // 3. Función para enviar los cambios editados (Decide dinámicamente si usa POST o PUT)
  const handleUpdate = async () => {
    const idToUpdate = profile.id || loggedInId;
    
    if (!idToUpdate) {
      alert("Error: No se detectó el ID del usuario para guardar.");
      return;
    }

    try {
      // Verificamos si el adoptante ya existe físicamente en el Backend
      const checkAdopter = await fetch(`http://localhost:8080/api/adopters/${idToUpdate}`);
      const exists = checkAdopter.ok;

      // Si existe usamos PUT a su ruta específica, si no existe usamos POST a la ruta general
      const methodToSend = exists ? 'PUT' : 'POST';
      const urlToSend = exists 
        ? `http://localhost:8080/api/adopters/${idToUpdate}`
        : `http://localhost:8080/api/adopters`;

      console.log(`Enviando perfil con método ${methodToSend} al servidor...`);

      const response = await fetch(urlToSend, {
        method: methodToSend,
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          id: parseInt(idToUpdate), // Aseguramos que viaje como número para que case con el de ClientEntity
          clientName: profile.clientName,
          clientPhone: profile.clientPhone,
          clientEmail: profile.clientEmail,
          hasChildren: profile.hasChildren,
          hasPets: profile.hasPets
        })
      });

      if (response.ok) {
        // Actualizamos el nombre en el localStorage por si cambió
        localStorage.setItem('clientName', profile.clientName);
        alert("¡Perfil de adoptante guardado y sincronizado con éxito!");
      } else {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        alert("Error al intentar guardar los datos en el servidor.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error crítico de red al conectar con el servidor.");
    }
  };

  // Pantalla de espera mientras llega la respuesta del Back
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
        Cargando datos del perfil...
      </div>
    );
  }

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
                value={profile.clientName || ''} 
                onChange={(e) => setProfile({...profile, clientName: e.target.value})} 
              />
            </div>
            <div className="info-item">
              <span>Teléfono:</span>
              <input 
                type="text" 
                value={profile.clientPhone || ''} 
                onChange={(e) => setProfile({...profile, clientPhone: e.target.value})}
              />
            </div>
            <div className="info-item">
              <span>Email:</span>
              <input 
                type="email" 
                value={profile.clientEmail || ''} 
                disabled 
                className="input-read-only" 
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
                checked={!!profile.hasChildren} 
                onChange={(e) => setProfile({...profile, hasChildren: e.target.checked})}
              />
              <span>¿Tiene niños en casa?</span>
            </div>
            <div className="info-item-check">
              <input 
                type="checkbox" 
                checked={!!profile.hasPets} 
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