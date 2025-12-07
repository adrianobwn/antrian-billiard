import api from './api';

const tableTypeService = {
    // Get all table types
    getAll: async () => {
        const response = await api.get('/table-types');
        return response.data.data;
    },

    // Get table type by ID
    getById: async (id) => {
        const response = await api.get(`/table-types/${id}`);
        return response.data.data;
    },

    // Create new table type
    create: async (data) => {
        const response = await api.post('/table-types', data);
        return response.data;
    },

    // Update table type
    update: async (id, data) => {
        const response = await api.put(`/table-types/${id}`, data);
        return response.data;
    },

    // Delete table type
    delete: async (id) => {
        const response = await api.delete(`/table-types/${id}`);
        return response.data;
    },

    // Toggle table type status (activate/deactivate)
    toggleStatus: async (id) => {
        const response = await api.patch(`/table-types/${id}/toggle-status`);
        return response.data;
    }
};

export default tableTypeService;