    import React, { useState } from 'react';
import '../css/Login.css'; // Crearemos este archivo de estilos en el paso 2

export const Login = () => {
  const [role, setRole] = useState('USER'); // 'USER' (Adoptante) o 'COMPANY' (Fundación)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Apuntamos al puerto 8080 del Back con el context path /api
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // Guardamos la sesión en el localStorage del navegador
      localStorage.setItem('clientId', data.clientId);
      localStorage.setItem('clientName', data.clientName);
      localStorage.setItem('userRole', data.role);

      alert(data.message);

      // Redirección según el rol seleccionado
    if (data.role === 'USER') {
  window.location.href = '/perfil'; // <-- Corregido para que coincida con tu App.jsx
    } else {
  window.location.href = '/gestion'; // <-- O la ruta que use la empresa/refugio
}

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <p className="login-subtitle">Gestiona tus adopciones y procesos</p>

        {/* Selector de Rol mediante pestañas */}
        <div className="role-tabs">
          <button 
            type="button"
            className={role === 'USER' ? 'tab-btn active user-tab' : 'tab-btn'}
            onClick={() => setRole('USER')}
          >
            👤 Usuario / Adoptante
          </button>
          <button 
            type="button"
            className={role === 'COMPANY' ? 'tab-btn active company-tab' : 'tab-btn'}
            onClick={() => setRole('COMPANY')}
          >
            🏢 Empresa / Fundación
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@estudiante.udistrital.edu.co"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Verificando...' : `Ingresar como ${role === 'USER' ? 'Usuario' : 'Empresa'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;