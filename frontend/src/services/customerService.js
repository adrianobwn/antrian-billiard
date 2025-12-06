import api from './api';

const customerService = {
    // Get customer dashboard statistics
    getDashboardStats: async () => {
        const response = await api.get('/customer/dashboard');
        return response.data;
    },

    // Get customer profile
    getProfile: async () => {
        const response = await api.get('/customer/profile');
        return response.data;
    },

    // Update customer profile
    updateProfile: async (data) => {
        const response = await api.put('/customer/profile', data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await api.put('/customer/change-password', data);
        return response.data;
    },

    // Get customer activity logs
    getActivityLogs: async (params = {}) => {
        const response = await api.get('/customer/activity', { params });
        return response.data;
    },

    // Get customer reservations
    getReservations: async (params = {}) => {
        const response = await api.get('/customer/reservations', { params });
        return response.data;
    },

    // Get customer statistics
    getStatistics: async () => {
        const response = await api.get('/customer/statistics');
        return response.data;
    },

    // Cancel reservation
    cancelReservation: async (reservationId) => {
        const response = await api.put(`/customer/reservations/${reservationId}/cancel`);
        return response.data;
    },
};

export default customerService;