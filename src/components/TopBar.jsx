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

                    {/* Hay que modificarlo y poner el logo. */}
                    <div className="navbar-logo">
                        <img src={logoHuella} alt="Logo Pagina" className="logo-img" />
                    </div>

                    {/* Lista para redirigir a las paginas */}
                    <ul className="navbar-links">
                        <li>Inicio</li>
                        <li>Adoptar</li>
                        <li>Refugios</li>
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