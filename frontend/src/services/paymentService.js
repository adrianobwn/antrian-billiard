import api from './api';

const paymentService = {
    // Process payment for a reservation
    processPayment: async (reservationId, paymentData) => {
        const response = await api.post(`/reservations/${reservationId}/payment`, paymentData);
        return response.data;
    },

    // Get payment details by ID
    getPaymentById: async (paymentId) => {
        const response = await api.get(`/payments/${paymentId}`);
        return response.data;
    },

    // Get all payments for a customer
    getCustomerPayments: async () => {
        const response = await api.get('/customer/payments');
        return response.data;
    },

    // Simulate payment method (for demo purposes)
    simulatePayment: async (reservationId, method = 'cash') => {
        const response = await api.post(`/reservations/${reservationId}/payment`, {
            payment_method: method,
            amount: null, // Backend will calculate
            payment_details: {
                simulated: true,
                timestamp: new Date().toISOString()
            }
        });
        return response.data;
    }
};

export default paymentService;