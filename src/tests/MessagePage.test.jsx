import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MessagesPage from '../pages/MessagesPage';

// Mocks.
vi.mock('../services/ShelterService.js', () => ({
    shelterService: {
        getShelters: vi.fn(),
    },
}));

vi.mock('../services/MessagesService.js', () => ({
    mensajesService: {
        getMessages: vi.fn(),
        createMessage: vi.fn(),
    },
}));

vi.mock('../css/MessagesPage.css', () => ({}));

vi.mock('../components/Sidebar', () => ({
    default: ({ conversations, loading, error, selectedId, onSelect }) => (
        <div data-testid="sidebar">
            {loading && <span>Cargando refugios...</span>}
            {error && <span data-testid="sidebar-error">{error}</span>}
            {conversations.map((s) => (
                <button key={s.id} onClick={() => onSelect(s.id)}>
                    {s.name}
                </button>
            ))}
            {selectedId && <span data-testid="selected-id">{selectedId}</span>}
        </div>
    ),
}));

vi.mock('../components/ChatArea', () => ({
    default: ({ conversation, messages, onSend }) => (
        <div data-testid="chat-area">
            {conversation && <span data-testid="chat-title">{conversation.name}</span>}
            {messages.map((m, i) => (
                <span key={i} data-testid="message">{m.text}</span>
            ))}
            <button onClick={() => onSend('Hola refugio')}>Enviar</button>
        </div>
    ),
}));

import { shelterService } from '../services/ShelterService.js';
import { mensajesService } from '../services/MessagesService.js';

// Datos de prueba.
const sheltersMock = [
    { id: 1, name: 'Huellitas' },
    { id: 2, name: 'Patitas Felices' },
];

const messagesMock = [
    { id: 1, text: 'Hola, ¿tienen perros disponibles?' },
    { id: 2, text: 'Sí, tenemos varios.' },
];

const renderComponent = () =>
    render(
        <MemoryRouter>
            <MessagesPage />
        </MemoryRouter>
    );

describe('MessagesPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Renderizado inicial.
    describe('Renderizado inicial', () => {

        it('muestra el Sidebar y el ChatArea', () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: [] });
            renderComponent();
            expect(screen.getByTestId('sidebar')).toBeInTheDocument();
            expect(screen.getByTestId('chat-area')).toBeInTheDocument();
        });

        it('muestra el estado de carga mientras obtiene los refugios', () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: [] });
            renderComponent();
            expect(screen.getByText('Cargando refugios...')).toBeInTheDocument();
        });

        it('muestra los refugios en el Sidebar tras cargarlos', async () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: sheltersMock });
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Huellitas')).toBeInTheDocument();
                expect(screen.getByText('Patitas Felices')).toBeInTheDocument();
            });
        });

        it('no muestra estado de carga una vez que los refugios cargaron', async () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: sheltersMock });
            renderComponent();
            await waitFor(() => {
                expect(screen.queryByText('Cargando refugios...')).not.toBeInTheDocument();
            });
        });
    });

    // Manejo de errores al cargar refugios.
    describe('Manejo de errores', () => {

        it('muestra el mensaje de error si getShelters falla', async () => {
            shelterService.getShelters.mockResolvedValue({
                success: false,
                mensaje: 'No se pudieron cargar los refugios',
            });
            renderComponent();
            await waitFor(() => {
                expect(screen.getByTestId('sidebar-error')).toHaveTextContent(
                    'No se pudieron cargar los refugios'
                );
            });
        });

        it('no muestra refugios si la carga falla', async () => {
            shelterService.getShelters.mockResolvedValue({
                success: false,
                mensaje: 'Error de red',
            });
            renderComponent();
            await waitFor(() => {
                expect(screen.queryByText('Huellitas')).not.toBeInTheDocument();
            });
        });
    });

    // Selección de refugio.
    describe('Selección de refugio', () => {

        it('llama a mensajesService.getMessages al seleccionar un refugio', async () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: sheltersMock });
            mensajesService.getMessages.mockResolvedValue({ success: true, messages: messagesMock });

            renderComponent();
            await waitFor(() => screen.getByText('Huellitas'));

            await userEvent.click(screen.getByText('Huellitas'));

            await waitFor(() => {
                expect(mensajesService.getMessages).toHaveBeenCalledTimes(1);
            });
        });

        it('muestra el nombre del refugio seleccionado en el ChatArea', async () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: sheltersMock });
            mensajesService.getMessages.mockResolvedValue({ success: true, messages: [] });

            renderComponent();
            await waitFor(() => screen.getByText('Huellitas'));

            await userEvent.click(screen.getByText('Huellitas'));

            await waitFor(() => {
                expect(screen.getByTestId('chat-title')).toHaveTextContent('Huellitas');
            });
        });

        it('muestra los mensajes del refugio seleccionado', async () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: sheltersMock });
            mensajesService.getMessages.mockResolvedValue({ success: true, messages: messagesMock });

            renderComponent();
            await waitFor(() => screen.getByText('Huellitas'));

            await userEvent.click(screen.getByText('Huellitas'));

            await waitFor(() => {
                const mensajes = screen.getAllByTestId('message');
                expect(mensajes).toHaveLength(2);
                expect(mensajes[0]).toHaveTextContent('Hola, ¿tienen perros disponibles?');
                expect(mensajes[1]).toHaveTextContent('Sí, tenemos varios.');
            });
        });

        it('limpia los mensajes al cambiar de refugio', async () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: sheltersMock });

            mensajesService.getMessages
                .mockResolvedValueOnce({ success: true, messages: messagesMock })
                .mockResolvedValueOnce({ success: true, messages: [] });

            renderComponent();
            await waitFor(() => screen.getByText('Huellitas'));

            await userEvent.click(screen.getByText('Huellitas'));
            await waitFor(() => expect(screen.getAllByTestId('message')).toHaveLength(2));

            await userEvent.click(screen.getByText('Patitas Felices'));
            await waitFor(() => {
                expect(screen.queryByTestId('message')).not.toBeInTheDocument();
            });
        });

        it('no muestra mensajes si getMessages falla', async () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: sheltersMock });
            mensajesService.getMessages.mockResolvedValue({ success: false, messages: [] });

            renderComponent();
            await waitFor(() => screen.getByText('Huellitas'));

            await userEvent.click(screen.getByText('Huellitas'));

            await waitFor(() => {
                expect(screen.queryByTestId('message')).not.toBeInTheDocument();
            });
        });
    });

    // Envío de mensajes.
    describe('Envío de mensajes', () => {

        const setupWithShelterSelected = async () => {
            shelterService.getShelters.mockResolvedValue({ success: true, shelters: sheltersMock });
            mensajesService.getMessages.mockResolvedValue({ success: true, messages: [] });

            renderComponent();
            await waitFor(() => screen.getByText('Huellitas'));
            await userEvent.click(screen.getByText('Huellitas'));
            await waitFor(() => expect(mensajesService.getMessages).toHaveBeenCalled());
        };

        it('llama a mensajesService.createMessage al enviar un mensaje', async () => {
            mensajesService.createMessage.mockResolvedValue({
                success: true,
                message: { id: 10, text: 'Hola refugio' },
            });

            await setupWithShelterSelected();
            await userEvent.click(screen.getByText('Enviar'));

            await waitFor(() => {
                expect(mensajesService.createMessage).toHaveBeenCalledWith({ text: 'Hola refugio' });
            });
        });

        it('agrega el mensaje nuevo a la lista tras enviarlo', async () => {
            mensajesService.createMessage.mockResolvedValue({
                success: true,
                message: { id: 10, text: 'Hola refugio' },
            });

            await setupWithShelterSelected();
            await userEvent.click(screen.getByText('Enviar'));

            await waitFor(() => {
                const mensajes = screen.getAllByTestId('message');
                expect(mensajes[mensajes.length - 1]).toHaveTextContent('Hola refugio');
            });
        });

        it('no agrega mensaje si createMessage falla', async () => {
            mensajesService.createMessage.mockResolvedValue({ success: false });

            await setupWithShelterSelected();
            await userEvent.click(screen.getByText('Enviar'));

            await waitFor(() => {
                expect(screen.queryByTestId('message')).not.toBeInTheDocument();
            });
        });

        it('acumula mensajes al enviar varios', async () => {
            mensajesService.createMessage
                .mockResolvedValueOnce({ success: true, message: { id: 10, text: 'Hola refugio' } })
                .mockResolvedValueOnce({ success: true, message: { id: 11, text: 'Hola refugio' } });

            await setupWithShelterSelected();
            await userEvent.click(screen.getByText('Enviar'));
            await userEvent.click(screen.getByText('Enviar'));

            await waitFor(() => {
                expect(screen.getAllByTestId('message')).toHaveLength(2);
            });
        });
    });
});