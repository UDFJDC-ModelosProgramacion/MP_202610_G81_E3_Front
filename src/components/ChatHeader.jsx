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
                <span className="chat-header-emoji">🏠</span>
                <div className="chat-header-info">
                    <span className="chat-header-nombre">{conversation.name}</span>
                </div>
            </div>
        );
    }
}

export default ChatHeader;