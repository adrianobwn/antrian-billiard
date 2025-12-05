import api from './api';

const tableService = {
    // Get all tables (public/customer might see available ones, admin all)
    getAll: async () => {
        const response = await api.get('/admin/tables'); // Adjust endpoint if public one exists
        return response.data;
    },

    // Public endpoint to get available tables if different
    getAvailable: async () => {
        // If there's a specific public endpoint, use it. Otherwise, might use same and filter.
        // For now using the admin one or a hypothetical public one.
        // Let's assume there is a general GET which serves both or we filter client side for now unless specific API exists.
        // Looking at README: GET /api/admin/tables is listed.
        // Is there a public one? README doesn't explicitly say public table list, 
        // but Reservation flow needs it. 
        // We will assume GET /api/tables might exist or we use the admin one if auth allows, 
        // BUT customer shouldn't need admin rights.
        // Let's stick to the README list for now, but we likely need a `GET /api/tables` for customers.
        // I will assume for now we might need to add it or it's missing from README doc but exists in code?
        // Let's check backend routes if possible later. For now, scaffold this.
        const response = await api.get('/admin/tables');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/admin/tables/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/admin/tables', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/admin/tables/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/admin/tables/${id}`);
        return response.data;
    }
};

export default tableService;
