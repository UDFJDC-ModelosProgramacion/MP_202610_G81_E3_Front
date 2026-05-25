import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "../css/TopBar.css";
import logoHuella from '../assets/huella.png'

class TopBar extends Component {

    // Función para limpiar la sesión y redirigir limpiamente
    handleLogout = () => {
        localStorage.clear();
        window.location.href = "/"; 
    };

    render() {
        // Leemos las llaves del localStorage en cada ciclo de renderizado
        const loggedInId = localStorage.getItem('clientId');
        const loggedInName = localStorage.getItem('clientName') || "Usuario";

        return (
            <div id="top-bar">
                {/*Barra de navegacion.*/}
                <nav className="navbar">

                    <div className="navbar-logo">
                        <Link to="/">
                            <img src={logoHuella} alt="Logo" className="logo-img" />
                        </Link>
                    </div>

                    {/* Lista para redirigir a las paginas (Respetando los cambios remotos) */}
                    <ul className="navbar-links">
                        <li>
                            <Link to="/" className="nav-links">Inicio</Link>
                        </li>

                        <li>
                            <Link to="/adoptar" className="nav-links">Adoptar</Link>
                        </li>

                        <li>
                            <Link to="/gestion" className="nav-links">Gestion</Link>
                        </li>

                        <li>
                            <Link to="/messages" className="nav-links">Mensajes</Link>
                        </li>

                        <li>
                            <Link to="/buscar" className="nav-search-link">
                                <span className="search-icon">🔍</span>
                            </Link>
                        </li>
                    </ul>

                    {/* Lógica de Autenticación Integrada */}
                    <div className="navbar-auth">
                        {loggedInId ? (
                            // Si el usuario está logueado, ve su nombre y acceso a su perfil
                            <div className="user-logged-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Link to="/perfil" className="nav-links" style={{ fontWeight: 'bold' }}>
                                    👤 {loggedInName}
                                </Link>
                                <button className="btn-login" onClick={this.handleLogout}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            // Si no hay sesión, se conservan los botones originales de tus compañeros
                            <>
                                <button className="btn-registro">Registrarse</button>
                                <button className="btn-login">Iniciar Sesión</button>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        );
    }
}

export default TopBar;