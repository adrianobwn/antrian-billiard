import api from './api';

const promoService = {
    // Get all promos
    getAll: async (includeInactive = false) => {
        const response = await api.get('/promos', {
            params: { includeInactive }
        });
        return response.data.data;
    },

    // Get promo by ID
    getById: async (id) => {
        const response = await api.get(`/promos/${id}`);
        return response.data.data;
    },

    // Create new promo
    create: async (data) => {
        const response = await api.post('/promos', data);
        return response.data;
    },

    // Update promo
    update: async (id, data) => {
        const response = await api.put(`/promos/${id}`, data);
        return response.data;
    },

    // Delete promo
    delete: async (id) => {
        const response = await api.delete(`/promos/${id}`);
        return response.data;
    },

    // Validate promo code
    validate: async (code, hours = 0) => {
        const response = await api.get('/promos/validate', {
            params: { code, hours }
        });
        return response.data;
    },

    // Get promo statistics
    getStats: async () => {
        const response = await api.get('/promos/stats');
        return response.data.data;
    }
};

export default promoService;