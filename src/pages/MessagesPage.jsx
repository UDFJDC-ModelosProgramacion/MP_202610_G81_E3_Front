import React, { Component } from 'react';
import "../css/MessagesPage.css";
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { shelterService } from '../services/ShelterService';
import { mensajesService } from '../services/MessagesService';

class MessagesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shelters: [],       // lista de refugios para el sidebar
            loading: true,      // si está cargando los refugios
            error: null,        // si hubo un error al cargar
            selectedId: null,   // id del refugio seleccionado
            messages: [],       // mensajes de la conversación actual
        };
    }

    // Se ejecuta automáticamente cuando la página carga
    async componentDidMount() {
        const result = await shelterService.getShelters();

        if (result.success) {
            this.setState({
                shelters: result.shelters,
                loading: false,
            });
        } else {
            this.setState({
                error: result.mensaje,
                loading: false,
            });
        }
    }

    // Se ejecuta cuando el usuario selecciona un refugio
    async handleSelectShelter(id) {
        this.setState({ selectedId: id, messages: [] });

        const result = await mensajesService.getMessages();

        if (result.success) {
            this.setState({ messages: result.messages });
        }
    }

    // Se ejecuta cuando el usuario envía un mensaje
    async handleSend(text) {
        const { selectedId } = this.state;

        const result = await mensajesService.createMessage({ text });

        if (result.success) {
            this.setState((prevState) => ({
                messages: [...prevState.messages, result.message]
            }));
        }
    }

    render() {
        const { shelters, loading, error, selectedId, messages } = this.state;

        // Busca el refugio seleccionado para pasárselo al ChatArea
        const selectedShelter = shelters.find((s) => s.id === selectedId) ?? null;

        return (
            <div className="messages-page">
                <Sidebar
                    conversations={shelters}
                    loading={loading}
                    error={error}
                    selectedId={selectedId}
                    onSelect={(id) => this.handleSelectShelter(id)}
                />
                <ChatArea
                    conversation={selectedShelter}
                    messages={messages}
                    onSend={(text) => this.handleSend(text)}
                />
            </div>
        );
    }
}

export default MessagesPage;