'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

        const promos = [
            {
                id: uuidv4(),
                code: 'WELCOME10',
                description: 'Welcome discount for new customers',
                discount_type: 'percentage',
                discount_value: 10.00,
                min_hours: 1,
                valid_from: today,
                valid_until: nextYear,
                max_uses: null,
                current_uses: 5,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                code: 'WEEKEND20',
                description: 'Weekend special - 20% off on bookings',
                discount_type: 'percentage',
                discount_value: 20.00,
                min_hours: 2,
                valid_from: today,
                valid_until: nextMonth,
                max_uses: 100,
                current_uses: 12,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                code: 'HAPPY25K',
                description: 'Happy hour - Rp 25,000 off',
                discount_type: 'fixed',
                discount_value: 25000.00,
                min_hours: 0,
                valid_from: today,
                valid_until: nextMonth,
                max_uses: 50,
                current_uses: 8,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                code: 'LOYALTY15',
                description: 'Loyalty program - 15% off for loyal customers',
                discount_type: 'percentage',
                discount_value: 15.00,
                min_hours: 3,
                valid_from: today,
                valid_until: nextYear,
                max_uses: null,
                current_uses: 23,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                code: 'STUDENT10',
                description: 'Student discount - 10% off with valid ID',
                discount_type: 'percentage',
                discount_value: 10.00,
                min_hours: 1,
                valid_from: today,
                valid_until: nextMonth,
                max_uses: 30,
                current_uses: 6,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                code: 'EARLYBIRD30',
                description: 'Early bird special - 30% off',
                discount_type: 'percentage',
                discount_value: 30.00,
                min_hours: 2,
                valid_from: new Date(today.getFullYear(), today.getMonth(), 1),
                valid_until: new Date(today.getFullYear(), today.getMonth(), 15),
                max_uses: 20,
                current_uses: 20,
                is_active: false,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        await queryInterface.bulkInsert('promos', promos);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('promos', null, {});
    }
};