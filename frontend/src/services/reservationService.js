import api from './api';

const reservationService = {
    // Get all reservations (for admin or customer history)
    getAll: async () => {
        const response = await api.get('/reservations');
        return response.data;
    },

    // Get single reservation details
    getById: async (id) => {
        const response = await api.get(`/reservations/${id}`);
        return response.data;
    },

    // Create a new reservation
    create: async (data) => {
        const response = await api.post('/reservations', data);
        return response.data;
    },

    // Update specific reservation
    update: async (id, data) => {
        const response = await api.put(`/reservations/${id}`, data);
        return response.data;
    },

    // Cancel/Delete reservation
    cancel: async (id) => {
        const response = await api.delete(`/reservations/${id}`);
        return response.data;
    },

    // Get available tables for a specific time slot (helper if backend has this specific endpoint, otherwise logic might be mixed)
    // Assuming backend might implement a check availability, but for now standard CRUD.
};

export default reservationService;
