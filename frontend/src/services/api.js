import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors and logging
api.interceptors.response.use(
    (response) => {
        // Log successful requests in development
        if (import.meta.env.DEV) {
            const duration = new Date() - response.config.metadata.startTime;
            console.log(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }
        return response;
    },
    (error) => {
        // Log failed requests in development
        if (import.meta.env.DEV) {
            const duration = error.config ? new Date() - error.config.metadata.startTime : 0;
            console.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${duration}ms`, error.response?.data);
        }

        // Handle specific error cases
        if (error.code === 'ECONNABORTED') {
            error.userMessage = 'Connection timeout. Please check your internet connection and try again.';
        } else if (error.code === 'NETWORK_ERROR') {
            error.userMessage = 'Network error. Please check your internet connection.';
        } else if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 401:
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Only redirect if not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    error.userMessage = 'Session expired. Please login again.';
                    break;
                case 403:
                    error.userMessage = 'Access denied. You do not have permission to perform this action.';
                    break;
                case 404:
                    error.userMessage = 'The requested resource was not found.';
                    break;
                case 422:
                    // Validation errors
                    if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                        error.userMessage = error.response.data.errors.map(err => err.msg).join(', ');
                    } else {
                        error.userMessage = error.response.data.error?.message || 'Invalid data provided.';
                    }
                    break;
                case 429:
                    error.userMessage = 'Too many requests. Please wait a moment and try again.';
                    break;
                case 500:
                    error.userMessage = 'Server error. Please try again later.';
                    break;
                case 502:
                case 503:
                case 504:
                    error.userMessage = 'Service unavailable. Please try again later.';
                    break;
                default:
                    error.userMessage = error.response.data.error?.message || 'An unexpected error occurred.';
            }
        } else if (error.request) {
            // Request was made but no response received
            error.userMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else {
            // Something else happened
            error.userMessage = 'An unexpected error occurred. Please try again.';
        }

        return Promise.reject(error);
    }
);

// Helper function to handle API errors gracefully
export const handleApiError = (error) => {
    if (error.userMessage) {
        return error.userMessage;
    }

    if (error.response?.data?.error?.message) {
        return error.response.data.error.message;
    }

    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};

export default api;
