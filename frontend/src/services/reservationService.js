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

    // Check table availability
    checkAvailability: async (data) => {
        const response = await api.post('/reservations/check-availability', data);
        return response.data;
    },

    // Process payment
    processPayment: async (id, data) => {
        const response = await api.post(`/reservations/${id}/payment`, data);
        return response.data;
    },

    // Get all reservations with filters (for admin)
    getAllReservations: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.date) params.append('date', filters.date);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);

        const queryString = params.toString();
        const response = await api.get(`/reservations${queryString ? `?${queryString}` : ''}`);
        return response.data;
    },

    // Update reservation status
    updateReservationStatus: async (id, status) => {
        const response = await api.put(`/reservations/${id}`, { status });
        return response.data;
    },
};

export default reservationService;
