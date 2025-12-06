'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableTypes = [
            {
                id: uuidv4(),
                name: 'Standard',
                hourly_rate: 50000,
                description: 'Standard billiard table suitable for casual players',
                color: '#00a859',
                icon: 'table',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'VIP',
                hourly_rate: 100000,
                description: 'Premium table with better equipment and more space',
                color: '#f97316',
                icon: 'crown',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'VVIP',
                hourly_rate: 150000,
                description: 'Luxury table with professional equipment and private area',
                color: '#8b5cf6',
                icon: 'star',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        await queryInterface.bulkInsert('table_types', tableTypes);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('table_types', null, {});
    }
};