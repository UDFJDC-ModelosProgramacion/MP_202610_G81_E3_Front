import React, { Component } from 'react';
import "../css/ChatHeader.css";

class ChatHeader extends Component {
    render() {
        const { conversation } = this.props;

        if (!conversation) {
            return null;
        }

        return (
            <div className="chat-header">
                {conversation.imagen
                    ? <img src={conversation.imagen} alt={conversation.nombre} className="chat-header-avatar" />
                    : <span className="chat-header-emoji">🏠</span>
                }
                <span className="chat-header-nombre">{conversation.nombre}</span>
            </div>
        );
    }
}

export default ChatHeader;