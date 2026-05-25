import React, { Component } from 'react';
import "../css/ChatArea.css";
import BurbujaMensaje from './MessageBuble';
import ChatHeader from './ChatHeader';

class ChatArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: "",
        };
    }

    handleInputChange(e) {
        this.setState({ inputText: e.target.value });
    }

    handleSend() {
        const { inputText } = this.state;
        const { onSend } = this.props;

        if (!inputText.trim()) return;

        onSend?.(inputText.trim());
        this.setState({ inputText: "" });
    }

    handleKeyDown(e) {
        if (e.key === "Enter") {
            this.handleSend();
        }
    }

    render() {
        const { conversation, messages } = this.props;
        const { inputText } = this.state;

        if (!conversation) {
            return (
                <div className="chat-area chat-area--empty">
                    <span>Selecciona una conversación para comenzar</span>
                </div>
            );
        }

        return (
            <div className="chat-area">
                <ChatHeader conversation={conversation} />

                <div className="chat-area-messages">
                    {messages.map((message) => (
                        <BurbujaMensaje key={message.id} message={message} />
                    ))}
                </div>

                <div className="chat-area-input">
                    <input
                        className="chat-area-input-field"
                        type="text"
                        placeholder="Escribe un mensaje"
                        value={inputText}
                        onChange={(e) => this.handleInputChange(e)}
                        onKeyDown={(e) => this.handleKeyDown(e)}
                    />
                    <button
                        className="chat-area-send-btn"
                        onClick={() => this.handleSend()}
                    >
                        Enviar
                    </button>
                </div>
            </div>
        );
    }
}

export default ChatArea;