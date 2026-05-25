import React, { Component } from 'react';
import "../css/MessageBuble.css";

class MessageBuble extends Component {
    render() {
        const { message } = this.props;

        // Compara el author del mensaje con el username guardado en localStorage
        const currentUser = localStorage.getItem('username');
        const isOwn = message.author === currentUser;

        return (
            <div className={`bubble-wrapper ${isOwn ? "bubble-wrapper--right" : "bubble-wrapper--left"}`}>
                <div className={`bubble ${isOwn ? "bubble--own" : "bubble--other"}`}>
                    {message.messageContent}
                </div>
            </div>
        );
    }
}

export default MessageBuble;