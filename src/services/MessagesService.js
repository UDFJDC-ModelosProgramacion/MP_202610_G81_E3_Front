// src/services/mensajesService.js

const API_URL = 'http://localhost:8080/api';

export const mensajesService = {

    // GET /messages - trae todos los mensajes
    getMessages: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/messages`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return { success: false, mensaje: 'Error al obtener los mensajes' };
            }

            const data = await response.json();
            return { success: true, messages: data };

        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            return { success: false, mensaje: 'Error de conexión' };
        }
    },

    // GET /messages/{id} - trae un mensaje por id
    getMessage: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/messages/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return { success: false, mensaje: 'Mensaje no encontrado' };
            }

            const data = await response.json();
            return { success: true, message: data };

        } catch (error) {
            console.error('Error al obtener mensaje:', error);
            return { success: false, mensaje: 'Error de conexión' };
        }
    },

    // POST /messages - crea un mensaje nuevo
    createMessage: async (messageDTO) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(messageDTO)
            });

            if (!response.ok) {
                return { success: false, mensaje: 'Error al crear el mensaje' };
            }

            const data = await response.json();
            return { success: true, message: data };

        } catch (error) {
            console.error('Error al crear mensaje:', error);
            return { success: false, mensaje: 'Error de conexión' };
        }
    },

    // DELETE /messages/{id} - elimina un mensaje
    deleteMessage: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return { success: false, mensaje: 'Error al eliminar el mensaje' };
            }

            return { success: true };

        } catch (error) {
            console.error('Error al eliminar mensaje:', error);
            return { success: false, mensaje: 'Error de conexión' };
        }
    }
};