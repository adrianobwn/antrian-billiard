import api from './api';

const dashboardService = {
    // Get dashboard statistics
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    // Get real-time table status
    getTableStatus: async () => {
        const response = await api.get('/dashboard/table-status');
        return response.data.data;
    }
};

export default dashboardService;