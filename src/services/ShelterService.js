// src/services/shelterService.js

const API_URL = 'http://localhost:8080/api';

export const shelterService = {

    // GET /shelters - trae todos los refugios
    getShelters: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/shelters`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return { success: false, mensaje: 'Error al obtener los refugios' };
            }

            const data = await response.json();
            return { success: true, shelters: data };

        } catch (error) {
            console.error('Error al obtener refugios:', error);
            return { success: false, mensaje: 'Error de conexión' };
        }
    },

    // GET /shelters/{id} - trae un refugio por id
    getShelter: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/shelters/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return { success: false, mensaje: 'Refugio no encontrado' };
            }

            const data = await response.json();
            return { success: true, shelter: data };

        } catch (error) {
            console.error('Error al obtener refugio:', error);
            return { success: false, mensaje: 'Error de conexión' };
        }
    },
    // PUT /shelters/{id} - para actualizar un refugio por id.
    updateShelter: async (id, formData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/shelters/${id}`, {

                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    id: Number(id)
                })
            });

            const data = await response.json().catch(() => ({}));
            return {
                ok: response.ok,
                success: response.ok,
                data: data
            };

        } catch (error) {
            console.error("Error al actualizar refugio:", error);

            return {
                ok: false,
                success: false,
                mensaje: "Error de conexión",
                data: {}
            };
        }
    }
};