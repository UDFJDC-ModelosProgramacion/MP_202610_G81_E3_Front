// src/services/petService.js

const API_URL = 'http://localhost:8080/api/pets';

export const petService = {

  // Obtener todas las mascotas
  obtenerTodas: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener mascotas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Obtener una mascota por ID
  obtenerPorId: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`Error al obtener la mascota con id ${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Actualizar una mascota por ID
  actualizar: async (id, petData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData),
      });
      if (!response.ok) throw new Error(`Error al actualizar la mascota con id ${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Buscar por keyword + filtros (array de strings)
  buscar: async (keyword = '', filtros = []) => {
    try {
      let url = `${API_URL}/search?keyword=${encodeURIComponent(keyword)}`;

      if (filtros.length > 0) {
        const filtrosQuery = filtros
          .map(f => `filter=${encodeURIComponent(f)}`)
          .join('&');
        url += `&${filtrosQuery}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en la búsqueda de mascotas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Buscar solo por keyword (sin filtros)
  buscarPorNombre: async (nombre) => {
    try {
      const response = await fetch(
        `${API_URL}/search?keyword=${encodeURIComponent(nombre)}`
      );
      if (!response.ok) throw new Error('Mascota no encontrada');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Buscar solo por filtros (sin keyword)
  buscarPorFiltros: async (filtros = []) => {
    try {
      const filtrosQuery = filtros
        .map(f => `filter=${encodeURIComponent(f)}`)
        .join('&');

      const response = await fetch(`${API_URL}/search?keyword=&${filtrosQuery}`);
      if (!response.ok) throw new Error('Error al filtrar mascotas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  crear: async (petData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData),
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Error del servidor (${response.status}): ${errorBody}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en petService.crear:', error);
      throw error;
    }
  }
};