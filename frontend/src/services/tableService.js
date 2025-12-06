import api from './api';
import { tableCache } from '../utils/cache';

const tableService = {
    // Get all tables (public endpoint) with caching
    getAll: async () => {
        const cacheKey = 'all_tables';
        const cached = tableCache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const response = await api.get('/tables');
        const data = response.data.data || response.data;

        // Cache the response
        tableCache.set(cacheKey, data);

        return data;
    },

    // Public endpoint to get available tables for specific date/time
    getAvailable: async (params) => {
        const cacheKey = `available_tables_${JSON.stringify(params)}`;
        const cached = tableCache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const response = await api.get('/tables/available', { params });
        const data = response.data.data || response.data;

        // Cache for shorter time since availability changes frequently
        tableCache.set(cacheKey, data, 30 * 1000); // 30 seconds

        return data;
    },

    getById: async (id) => {
        const response = await api.get(`/admin/tables/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/admin/tables', data);
        // Clear cache when new table is created
        tableCache.clear();
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/admin/tables/${id}`, data);
        // Clear cache when table is updated
        tableCache.clear();
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/admin/tables/${id}`);
        // Clear cache when table is deleted
        tableCache.clear();
        return response.data;
    }
};

export default tableService;
