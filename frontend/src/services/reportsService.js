import api from './api';

const reportsService = {
    // Get revenue reports
    getRevenueReports: async (params = {}) => {
        const response = await api.get('/reports/revenue', { params });
        return response.data.data;
    },

    // Get table performance reports
    getTablePerformance: async (params = {}) => {
        const response = await api.get('/reports/table-performance', { params });
        return response.data.data;
    },

    // Get customer analytics
    getCustomerAnalytics: async (params = {}) => {
        const response = await api.get('/reports/customer-analytics', { params });
        return response.data.data;
    },

    // Get promo effectiveness reports
    getPromoEffectiveness: async () => {
        const response = await api.get('/reports/promo-effectiveness');
        return response.data.data;
    },

    // Get hourly analytics
    getHourlyAnalytics: async (params = {}) => {
        const response = await api.get('/reports/hourly-analytics', { params });
        return response.data.data;
    }
};

export default reportsService;