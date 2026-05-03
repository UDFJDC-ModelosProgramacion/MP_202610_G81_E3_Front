import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "../css/TopBar.css";
import logoHuella from '../assets/huella.png'


class TopBar extends Component {
    render() {
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
                            <Link to="/" className="nav-links">Adoptar</Link>
                            </li>

                            <li>
                            <Link to="/refugios" className="nav-links">Refugios</Link>
                            </li>

                            {/*Se añade el boton de busqueda*/}
                            <li>
                            <Link to="/buscar" className="nav-search-link">
                                <span className="search-icon">🔍</span>
                            </Link>
                        </li>
                    </ul>

                    {/* Para los dos de autenticacion */}
                    <div className="navbar-auth">
                        <button className="btn-registro">Registrarse</button>
                        <button className="btn-login">Iniciar Sesión</button>
                    </div>
                </nav>
            </div>
        );
    }
}

export default TopBar;