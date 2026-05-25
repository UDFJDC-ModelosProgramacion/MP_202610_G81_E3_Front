import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "../css/TopBar.css";
import logoHuella from '../assets/huella.png';

class TopBar extends Component {
    
    // Función para borrar el localStorage y cerrar sesión
    handleLogout = () => {
        localStorage.clear(); // Borra clientId, clientName y role
        alert("Sesión cerrada correctamente");
        window.location.href = "/"; // Redirige al inicio
    };

    render() {
        // Revisamos si hay un usuario logueado actualmente en el navegador
        const isLoggedIn = localStorage.getItem('clientId') !== null;
        const clientName = localStorage.getItem('clientName') || "Usuario";

        return (
            <div id="top-bar">
                {/*Barra de navegacion.*/}
                <nav className="navbar">

                    <div className="navbar-logo">
                        <Link to="/">
                            <img src={logoHuella} alt="Logo" className="logo-img" />
                        </Link>
                    </div>

                    {/* Lista para redirigir a las paginas */}
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
                            <Link to="/buscar" className="nav-search-link">
                                <span className="search-icon">🔍</span>
                            </Link>
                        </li>
                    </ul>

                    {/* Sección de autenticación dinámica */}
                    <div className="navbar-auth">
                        {isLoggedIn ? (
                            // SI EL USUARIO YA INICIÓ SESIÓN: Muestra su Perfil y Cerrar Sesión
                            <>
                                <Link to="/perfil" className="nav-links" style={{ marginRight: '15px', fontWeight: '500' }}>
                                    👤 ¡Hola, {clientName.split(' ')[0]}!
                                </Link>
                                <button className="btn-login" onClick={this.handleLogout}>
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            // SI NO HA INICIADO SESIÓN: Muestra los botones clásicos conectados
                            <>
                                <button className="btn-registro">Registrarse</button>
                                <Link to="/login">
                                    <button className="btn-login">Iniciar Sesión</button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        );
    }
}

export default TopBar;