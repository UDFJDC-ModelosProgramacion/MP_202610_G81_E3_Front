import React, { Component } from 'react';
import "../css/SideBar.css"

class SideBar extends Component {
    renderContenido() {
        const {
            loading,
            error,
            conversations = [],
            selectedId,
            onSelect,
        } = this.props;

        if (loading) {
            return (
                <div className="sidebar-state">
                    <span>Cargando mensajes...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="sidebar-state">
                    <span className="sidebar-error">No se pudieron cargar los mensajes</span>
                </div>
            );
        }

        if (conversations.length === 0) {
            return (
                <div className="sidebar-state">
                    <span>Sin conversaciones aun</span>
                </div>
            );
        }

        return (
            <ul className="sidebar-lista">
                {conversations.map((conv) => (
                    <li
                        key={conv.id}
                        className={`sidebar-item ${selectedId === conv.id ? "sidebar-item--activo" : ""}`}
                        onClick={() => onSelect?.(conv.id)}
                    >
                        {conv.imagen ? (
                            <img src={conv.imagen} alt={conv.name} className="sidebar-avatar" />
                        ) : (
                            <span className="sidebar-avatar-emoji">🏠</span>
                        )}
                        <div className="sidebar-info">
                            <span className="sidebar-name">{conv.name}</span>
                            <span className="sidebar-preview">{conv.ultimoMensaje}</span>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        return (
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-titulo">Mensajes</span>
                </div>
                {this.renderContenido()}
            </aside>
        );
    }
}

export default SideBar;